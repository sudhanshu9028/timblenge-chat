'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AnonizLogo from './AnonizLogo';
import styles from '@/styles/footer.module.scss';
import { track, EVENTS } from '@/lib/analytics';

export default function Footer() {
  const pathname = usePathname();

  const trackClick = (label) => track(EVENTS.FOOTER_CLICK, { label });

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

          {/* Product Hunt's own embed rather than a self-hosted copy, so the
              badge reflects our current standing there instead of freezing on
              the day it was pasted. Like the Instagram link below, it is also a
              real outbound link to a profile named in the homepage `sameAs` —
              which is what a crawler actually follows to confirm the two are
              the same "Anoniz".

              eslint-disable-next-line reason: next/image can't serve this
              without `dangerouslyAllowSVG`, and turning that on globally would
              let every allowed remote host push scriptable SVG through the
              optimiser. Not a trade worth making for one badge. Width and
              height are set so it reserves its space, and it is lazy because
              the footer sits below the fold on every page. */}
          <a
            href="https://www.producthunt.com/products/anoniz-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-anoniz-chat-and-play-with-strangers"
            className={styles.productHuntBadge}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('product_hunt')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1244951&theme=neutral&t=1788893198010"
              alt="Anoniz — anonymous chat and video call, play games with strangers | Featured on Product Hunt"
              width="250"
              height="54"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>

        {/* Navigation Links */}
        <nav className={styles.navLinks}>
          <Link href="/blog" className={styles.navLink} onClick={() => trackClick('blog')}>
            Blog
          </Link>
          <Link
            href="/privacy-policy"
            className={styles.navLink}
            onClick={() => trackClick('privacy_policy')}
          >
            Privacy Policy
          </Link>
          <Link href="/terms" className={styles.navLink} onClick={() => trackClick('terms')}>
            Terms
          </Link>
          {/* An actual outbound link, not just a sameAs claim — this is the
              path a crawler follows from the site to the profile. */}
          <a
            href="https://www.instagram.com/anonizchat"
            className={styles.socialLink}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="Anoniz on Instagram"
            onClick={() => trackClick('instagram')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            <span>Instagram</span>
          </a>

          <a
            href="mailto:support@anoniz.com"
            className={styles.contactButton}
            onClick={() => trackClick('contact_us')}
          >
            Contact Us
          </a>
        </nav>
      </div>
    </footer>
  );
}
