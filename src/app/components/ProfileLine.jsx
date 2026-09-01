'use client';

import { useEffect, useState } from 'react';
import { getProfileSummary } from '@/lib/profile';
import styles from '@/styles/primeTime.module.scss';

/**
 * One line of the visitor's own history, e.g. "You've talked to 14 strangers
 * on Anoniz." Renders nothing for newcomers — and nothing at all on the
 * server, since the profile only exists in their browser.
 */
export default function ProfileLine() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    setSummary(getProfileSummary());
  }, []);

  if (!summary) return null;

  return <p className={styles.profileLine}>{summary}</p>;
}
