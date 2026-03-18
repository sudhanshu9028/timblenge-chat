'use client';

import FaqAccordion from './FaqAccordion';
import styles from '@/styles/homeFaq.module.scss';
import { HOME_FAQ_ITEMS } from '@/lib/homeFaqData';

export default function HomeFaqSection() {
  return (
    <section className={styles.faqSection}>
      <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
      <div className={styles.faqContainer}>
        <FaqAccordion items={HOME_FAQ_ITEMS} />
      </div>
    </section>
  );
}
