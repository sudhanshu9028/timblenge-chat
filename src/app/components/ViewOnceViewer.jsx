'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/styles/viewOnce.module.scss';

export const VIEW_ONCE_SECONDS = 10;

const LABELS = {
  mine: {
    sending: 'Sending photo…',
    sent: 'Photo',
    opened: 'Opened',
    expired: 'Photo expired',
    failed: "Photo couldn't be sent",
  },
  theirs: {
    unopened: 'Photo · tap to view',
    opening: 'Opening…',
    opened: 'Opened',
    expired: 'Photo expired',
  },
};

/** The chat-bubble placeholder for a view-once photo. Never shows the photo itself. */
export function ViewOnceBubble({ mine, status, onOpen }) {
  const label = LABELS[mine ? 'mine' : 'theirs'][status] || 'Photo';
  const live = mine ? status === 'sent' || status === 'sending' : status === 'unopened';
  const icon = (
    <span className={`${styles.badge} ${live ? '' : styles.badgeSpent}`} aria-hidden="true">
      1
    </span>
  );

  if (!mine && status === 'unopened') {
    return (
      <button type="button" className={styles.bubbleBtn} onClick={onOpen}>
        {icon}
        {label}
      </button>
    );
  }
  return (
    <span className={`${styles.bubble} ${live ? '' : styles.bubbleSpent}`}>
      {icon}
      {label}
    </span>
  );
}

/**
 * Full-screen viewer for a view-once photo.
 *
 * The bytes are decoded straight onto a canvas: there is no <img>, no blob:
 * URL and nothing to right-click and save. The photo closes itself after
 * VIEW_ONCE_SECONDS, and early if the page loses focus or a screenshot
 * shortcut is pressed (reported through onCapture).
 *
 * Browsers cannot actually block screenshots or a second phone camera; this
 * removes the easy paths and tells the sender when we notice an attempt.
 *
 * @param {ArrayBuffer} data
 * @param {string}      mime
 * @param {Function}    onClose    called once, when the photo is gone
 * @param {Function}    onCapture  (reason) => void, best-effort capture signal
 */
export default function ViewOnceViewer({ data, mime, onClose, onCapture }) {
  const canvasRef = useRef(null);
  const closedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [remaining, setRemaining] = useState(VIEW_ONCE_SECONDS);

  // Latest callbacks without re-running the effects below.
  const onCloseRef = useRef(onClose);
  const onCaptureRef = useRef(onCapture);
  onCloseRef.current = onClose;
  onCaptureRef.current = onCapture;

  const wipe = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.height = 0;
    }
  };

  const close = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    wipe();
    onCloseRef.current?.();
  };

  const captured = (reason) => {
    onCaptureRef.current?.(reason);
    close();
  };

  // Decode and draw.
  useEffect(() => {
    let cancelled = false;
    createImageBitmap(new Blob([data], { type: mime }))
      .then((bitmap) => {
        const canvas = canvasRef.current;
        if (cancelled || !canvas) return bitmap.close();
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvas.getContext('2d').drawImage(bitmap, 0, 0);
        bitmap.close();
        setReady(true);
      })
      .catch(() => close());
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mime]);

  // The clock starts once the photo is actually on screen.
  useEffect(() => {
    if (!ready) return undefined;
    const endsAt = Date.now() + VIEW_ONCE_SECONDS * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, endsAt - Date.now());
      setRemaining(left / 1000);
      if (left === 0) close();
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Anything that takes the page out of view ends the photo: app switcher
  // thumbnails, the Windows snipping overlay, switching tabs.
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === 'hidden') close();
    };
    const onBlur = () => close();
    const onKeyDown = (e) => {
      const key = (e.key || '').toLowerCase();
      const isShot =
        key === 'printscreen' ||
        // macOS Cmd+Shift+3/4/5: the OS takes the digit, but we see the modifiers.
        (e.metaKey && e.shiftKey) ||
        // Windows Win+Shift+S
        (key === 's' && e.shiftKey && (e.metaKey || e.getModifierState?.('OS')));
      const isSaveOrPrint = (e.ctrlKey || e.metaKey) && (key === 's' || key === 'p');
      if (isShot || isSaveOrPrint) {
        e.preventDefault();
        captured(isShot ? 'screenshot_key' : 'save_or_print');
      } else if (key === 'escape') {
        close();
      }
    };
    // Windows only reports PrintScreen on keyup, after the capture. Overwrite
    // the clipboard copy it just made, where the browser lets us.
    const onKeyUp = (e) => {
      if ((e.key || '').toLowerCase() === 'printscreen') {
        navigator.clipboard?.writeText('').catch(() => {});
        captured('screenshot_key');
      }
    };

    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('blur', onBlur);
    window.addEventListener('pagehide', onBlur);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('pagehide', onBlur);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unmounting for any other reason (navigation) still clears the pixels. Only
  // wipe here: StrictMode runs this cleanup on mount in dev, and calling
  // onClose would dismiss the photo before it was ever shown.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => wipe(), []);

  const block = (e) => e.preventDefault();

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="View-once photo"
      onContextMenu={block}
      onDragStart={block}
    >
      <div className={styles.topBar}>
        <div className={styles.progress} aria-hidden="true">
          <div
            className={styles.progressFill}
            style={{ transform: `scaleX(${remaining / VIEW_ONCE_SECONDS})` }}
          />
        </div>
        <div className={styles.meta}>
          <span>View once · {Math.ceil(remaining)}s</span>
          <button type="button" onClick={close} className={styles.closeBtn}>
            Close
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className={styles.canvas} />
      {!ready && <p className={styles.loading}>Opening…</p>}
    </div>,
    document.body
  );
}
