'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AnonizLogo from './AnonizLogo';
import styles from '@/styles/navigation.module.scss';
import { track, EVENTS } from '@/lib/analytics';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // One event name, varying parameters. Interpolating the name would mint a
  // new GA4 event for every link — the property caps out at 500 names.
  const trackClick = (section, label) => track(EVENTS.NAV_CLICK, { section, label });

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/support', label: 'Support' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logoContainer} onClick={() => trackClick('nav', 'logo')}>
          <div className={styles.logoWrapper}>
            <AnonizLogo className={styles.logoIcon} />
          </div>
          <span className={styles.brandName}>Anoniz</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={(e) => trackClick('nav', link.label.toLowerCase())}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={isMobileMenuOpen ? styles.open : ''}></span>
          <span className={isMobileMenuOpen ? styles.open : ''}></span>
          <span className={isMobileMenuOpen ? styles.open : ''}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileNavLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={() => {
                trackClick('nav', link.label.toLowerCase());
                setIsMobileMenuOpen(false);
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
