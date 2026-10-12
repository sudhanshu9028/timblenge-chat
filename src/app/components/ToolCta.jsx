'use client';

import Link from 'next/link';
import styles from '@/styles/tools.module.scss';
import { track, EVENTS } from '@/lib/analytics';

/**
 * The "now try it on a real person" band on a tool page.
 *
 * A client component only so the click can be tracked: these pages exist to
 * send people into a chat, and `location` is what separates their clicks from
 * the homepage's in the same `cta_click` event.
 */
export default function ToolCta({ tool, title, children, note }) {
  return (
    <section className={styles.cta}>
      <h2 className={styles.ctaTitle}>{title}</h2>
      <p className={styles.ctaText}>{children}</p>
      <Link
        href="/chat"
        className={styles.ctaButton}
        onClick={() => track(EVENTS.CTA_CLICK, { location: tool, target: 'text_chat' })}
      >
        Start a text chat
      </Link>
      {note ? <p className={styles.ctaNote}>{note}</p> : null}
    </section>
  );
}
