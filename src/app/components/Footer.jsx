'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AnonizLogo from './AnonizLogo';
import styles from '@/styles/footer.module.scss';

export default function Footer() {
  const pathname = usePathname();

  // GA4 click tracking
  const trackClick = (label) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const platform = window.innerWidth <= 768 ? 'mweb' : 'web';
      window.gtag('event', `footer_${label}`, { platform });
    }
  };

  // Hide footer on chat and video pages
  if (pathname?.startsWith('/chat') || pathname?.startsWith('/video')) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Branding Section */}
        <div className={styles.branding}>
          <Link href="/" className={styles.logoContainer} onClick={() => trackClick('logo')}>
            <div className={styles.logoWrapper}>
              <AnonizLogo className={styles.logoIcon} />
            </div>
            <span className={styles.brandName}>Anoniz</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className={styles.navLinks}>
          <Link href="/privacy-policy" className={styles.navLink} onClick={() => trackClick('privacy_policy')}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={styles.navLink} onClick={() => trackClick('terms')}>
            Terms
          </Link>
          <a href="mailto:support@anoniz.com" className={styles.contactButton} onClick={() => trackClick('contact_us')}>
            Contact Us
          </a>
        </nav>
      </div>
    </footer>
  );
}

