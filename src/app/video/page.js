'use client';

import Link from 'next/link';
import ConsentModal from '../components/ConsentModal';
import styles from '@/styles/chatVideoPage.module.scss';

export default function VideoPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.seoContent}>
        <h1 className={styles.seoTitle}>Video Chat with Strangers</h1>
        <p className={styles.seoDescription}>
          Anoniz connects you face-to-face with a random person, straight from your browser. No app,
          no account — allow your camera, confirm you&apos;re over 18, and you&apos;re in a call.
        </p>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>How it works</h2>
          <ol className={styles.seoSteps}>
            <li>
              <strong>Allow camera and microphone.</strong> Your browser will ask once. You can see
              your own preview before anyone else does.
            </li>
            <li>
              <strong>We find someone.</strong> Add interests and we&apos;ll prioritise people who
              share them. If it&apos;s quiet we keep searching rather than giving up — and you can
              ask us to ping you, or switch to text chat, while we look.
            </li>
            <li>
              <strong>Talk, or skip.</strong> Next moves you straight to a new person. Stop ends the
              call and shuts your camera off.
            </li>
          </ol>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>What makes video different</h2>
          <p className={styles.seoText}>
            Video conversations are shorter and warmer than text ones. You read tone and expression
            instantly, so you work out in five seconds whether you want to keep talking — something
            that takes a dozen messages in text. It&apos;s the closer thing to actually meeting
            someone.
          </p>
          <ul className={styles.seoList}>
            <li>
              <strong>Peer-to-peer.</strong> The video stream runs directly between the two
              browsers.
            </li>
            <li>
              <strong>Nothing recorded.</strong> Calls aren&apos;t saved anywhere.
            </li>
            <li>
              <strong>Works on mobile.</strong> No app store detour — it runs in the browser you
              already have.
            </li>
            <li>
              <strong>You control the camera.</strong> Stop at any time, and the camera light goes
              out with it.
            </li>
          </ul>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Staying safe on camera</h2>
          <p className={styles.seoText}>
            Video gives away more than text does, so it&apos;s worth thinking for a second before
            you connect. Check what&apos;s visible behind you — post, packages, a window with a
            recognisable view, anything with your name on it. Assume anything on camera could be
            screenshotted, because it could be.
          </p>
          <p className={styles.seoText}>
            Never feel obliged to stay in a call. If someone asks you to do something you&apos;re
            not comfortable with, or asks for money or personal details, press Next immediately —
            that&apos;s what the button is for.
          </p>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Common questions</h2>

          <div className={styles.seoQa}>
            <p className={styles.seoQuestion}>Do I need to sign up?</p>
            <p className={styles.seoText}>
              No. There&apos;s no account and no email — only a confirmation that you&apos;re 18 or
              over.
            </p>
          </div>

          <div className={styles.seoQa}>
            <p className={styles.seoQuestion}>Are my calls recorded?</p>
            <p className={styles.seoText}>
              No. Video runs peer-to-peer between the two browsers and nothing is stored on our
              side.
            </p>
          </div>

          <div className={styles.seoQa}>
            <p className={styles.seoQuestion}>What if nobody is online?</p>
            <p className={styles.seoText}>
              We keep you in the queue instead of dropping you out of it, and we&apos;ll show you a
              few options while you wait — switch to text chat, get a notification when someone
              joins, or read something. You stay in the queue the whole time.
            </p>
          </div>

          <div className={styles.seoQa}>
            <p className={styles.seoQuestion}>Does it work on a phone?</p>
            <p className={styles.seoText}>
              Yes, in any modern mobile browser. Allow camera access when prompted.
            </p>
          </div>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Worth reading first</h2>
          <ul className={styles.seoLinks}>
            <li>
              <Link href="/blog/spot-red-flags-random-video-chat-safety-2026">
                Red flags to watch for on video chat
              </Link>
            </li>
            <li>
              <Link href="/blog/how-to-stay-safe-chatting-with-strangers-online">
                Staying safe with strangers online
              </Link>
            </li>
            <li>
              <Link href="/blog/text-chat-vs-video-chat-which-is-better">
                Text chat vs video chat
              </Link>
            </li>
            <li>
              <Link href="/blog/best-omegle-alternatives-safe-free-random-chat">
                The best Omegle alternatives
              </Link>
            </li>
          </ul>
        </section>
      </div>
      <ConsentModal isOpen={true} chatType="video" />
    </div>
  );
}
