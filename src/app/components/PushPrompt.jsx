'use client';

import { useEffect, useState } from 'react';
import { getPushCapability, subscribeToPush } from '@/lib/push';
import { track, EVENTS } from '@/lib/analytics';
import styles from '@/styles/chatPanels.module.scss';

/**
 * The one thing on the site that can bring someone back tomorrow.
 *
 * Shown only after a conversation that actually went somewhere — asking on
 * page load is how permission prompts get denied forever, and a denial is
 * permanent per browser.
 */
export default function PushPrompt({ eligible = false }) {
  const [capability, setCapability] = useState(null);
  const [status, setStatus] = useState('idle');

  // Capability depends on browser APIs, so it can only be read after mount.
  useEffect(() => {
    if (eligible) setCapability(getPushCapability());
  }, [eligible]);

  useEffect(() => {
    if (capability === 'available') track(EVENTS.PUSH_PROMPT_SHOWN);
  }, [capability]);

  if (!eligible || !capability) return null;
  if (capability === 'unsupported' || capability === 'denied') return null;

  // iOS Safari only allows push for home-screen PWAs, so a button here would
  // silently do nothing. Tell them what would actually work instead.
  if (capability === 'needs-install') {
    return (
      <p className={styles.pushHint}>
        Add Anoniz to your home screen and we can ping you when it&apos;s busy.
      </p>
    );
  }

  if (capability === 'granted' || status === 'subscribed') {
    return <p className={styles.pushHint}>We&apos;ll ping you when Anoniz gets busy.</p>;
  }

  const handleClick = async () => {
    setStatus('working');
    const result = await subscribeToPush();
    setStatus(result);

    if (result === 'subscribed') track(EVENTS.PUSH_SUBSCRIBED, { kind: 'web_push' });
    else if (result === 'denied') track(EVENTS.PUSH_DENIED, { kind: 'web_push' });
  };

  if (status === 'denied' || status === 'error') return null;

  return (
    <div className={styles.push}>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'working'}
        className={styles.btnSecondary}
      >
        {status === 'working' ? 'Just a second…' : 'Ping me when Anoniz is busy'}
      </button>
      <p className={styles.pushHint}>
        One notification when 10+ people are online. Never more than once a day.
      </p>
    </div>
  );
}
