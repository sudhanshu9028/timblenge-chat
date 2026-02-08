'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AnonizLogo from './AnonizLogo';
import styles from '@/styles/footer.module.scss';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on chat and video pages
  if (pathname?.startsWith('/chat') || pathname?.startsWith('/video')) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Branding Section */}
        <div className={styles.branding}>
          <Link href="/" className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <AnonizLogo className={styles.logoIcon} />
            </div>
            <span className={styles.brandName}>Anoniz</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className={styles.navLinks}>
          <Link href="/privacy-policy" className={styles.navLink}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={styles.navLink}>
            Terms
          </Link>
          <a href="mailto:support@anoniz.com" className={styles.contactButton}>
            Contact Us
          </a>
        </nav>
      </div>
    </footer>
  );
}

