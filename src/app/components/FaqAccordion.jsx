'use client';

import { useState } from 'react';
import styles from '@/styles/faqAccordion.module.scss';

/**
 * Reusable FAQ Accordion component.
 * Each item is collapsed by default and expands on click.
 *
 * @param {{ items: Array<{ question: string, answer: string }>, className?: string }} props
 */
export default function FaqAccordion({ items, className = '' }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`${styles.faqList} ${className}`}>
      {items.map((item, index) => (
        <div key={index} className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}>
          <button
            className={styles.faqQuestion}
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span>{item.question}</span>
            <svg
              className={styles.chevron}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className={styles.faqAnswerWrapper}>
            <p className={styles.faqAnswer}>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
