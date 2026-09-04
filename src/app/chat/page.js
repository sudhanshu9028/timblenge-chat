'use client';

import Link from 'next/link';
import ConsentModal from '../components/ConsentModal';
import styles from '@/styles/chatVideoPage.module.scss';

export default function ChatPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.seoContent}>
        <h1 className={styles.seoTitle}>Text Chat with Strangers Online</h1>
        <p className={styles.seoDescription}>
          Anoniz pairs you with a random person for a one-to-one text conversation. There is nothing
          to download and no account to make — confirm you&apos;re over 18 and you&apos;re talking
          to someone within seconds.
        </p>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>How it works</h2>
          <ol className={styles.seoSteps}>
            <li>
              <strong>Tell us roughly who you are.</strong> Pick your gender and confirm you&apos;re
              18 or older. You can add a few interests — music, gaming, travel — and we&apos;ll try
              to pair you with someone who shares them.
            </li>
            <li>
              <strong>We look for a real person.</strong> Matching usually takes a few seconds. If
              the site is quiet we keep searching, and our AI can keep you company in the meantime —
              it&apos;s clearly labelled, and we swap you over the moment a real person is free.
            </li>
            <li>
              <strong>Talk, or move on.</strong> Send messages and images. If the conversation
              isn&apos;t working, hit Next and you&apos;re matched with someone else immediately.
            </li>
          </ol>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Why people use text chat instead of video</h2>
          <p className={styles.seoText}>
            Text is the lower-pressure way to meet someone new. You don&apos;t have to think about
            your camera, your room, your hair or the time of day, and you get a moment to think
            before you reply. That makes it easier if you&apos;re shy, if you&apos;re practising a
            language, or if you just want to talk to someone without being seen.
          </p>
          <ul className={styles.seoList}>
            <li>
              <strong>Nothing to install.</strong> It runs in your browser, on a phone or a laptop.
            </li>
            <li>
              <strong>No account, no email.</strong> You&apos;re never asked to sign up.
            </li>
            <li>
              <strong>Nothing kept.</strong> Conversations aren&apos;t stored — once you disconnect,
              the chat is gone.
            </li>
            <li>
              <strong>Interest matching.</strong> Add a few tags and we prioritise people who put
              the same ones in.
            </li>
          </ul>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Is it safe to chat with strangers?</h2>
          <p className={styles.seoText}>
            It is, as long as you keep the conversation anonymous. The one rule that matters: never
            share anything that identifies you. No full name, no address, no school or workplace, no
            phone number, no social handles, and no photos you wouldn&apos;t want a stranger to
            keep. Anoniz never asks for any of it, so anything you give away is given by you.
          </p>
          <p className={styles.seoText}>
            If someone makes you uncomfortable, don&apos;t argue with them — press Next. You&apos;ll
            be with someone else in a second and they have no way to find you again.
          </p>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Common questions</h2>

          <div className={styles.seoQa}>
            <p className={styles.seoQuestion}>Do I need to register?</p>
            <p className={styles.seoText}>
              No. There&apos;s no sign-up, no email and no password. The only thing you confirm is
              that you&apos;re 18 or over.
            </p>
          </div>

          <div className={styles.seoQa}>
            <p className={styles.seoQuestion}>Is it really free?</p>
            <p className={styles.seoText}>
              Yes — text chat is free with no message limit and no trial.
            </p>
          </div>

          <div className={styles.seoQa}>
            <p className={styles.seoQuestion}>Am I talking to a real person or an AI?</p>
            <p className={styles.seoText}>
              A real person, unless the chat is labelled otherwise. When nobody is free we&apos;ll
              offer you our AI so you&apos;re not staring at an empty screen, and it carries a
              visible badge for the whole conversation. We keep looking for a real person in the
              background either way.
            </p>
          </div>

          <div className={styles.seoQa}>
            <p className={styles.seoQuestion}>What happened to Omegle?</p>
            <p className={styles.seoText}>
              Omegle shut down in November 2023 after fourteen years, following a lawsuit and years
              of moderation problems. Anoniz does the same one-to-one stranger matching without the
              things that got Omegle in trouble.{' '}
              <Link href="/blog/why-did-omegle-shut-down-where-everyone-went-2026">
                The full story is here
              </Link>
              .
            </p>
          </div>

          <div className={styles.seoQa}>
            <p className={styles.seoQuestion}>What do I say when the conversation dies?</p>
            <p className={styles.seoText}>
              Change direction rather than forcing the topic along, or start a game — we build Would
              You Rather into the chat and offer it automatically when things go quiet.{' '}
              <Link href="/blog/what-to-say-when-conversation-dies-stranger-chat">
                More ways to restart a stalled chat
              </Link>
              .
            </p>
          </div>

          <div className={styles.seoQa}>
            <p className={styles.seoQuestion}>Can someone find me afterwards?</p>
            <p className={styles.seoText}>
              No. There are no profiles and no usernames, so there&apos;s nothing to look up once
              the chat ends.
            </p>
          </div>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Before you start</h2>
          <p className={styles.seoText}>
            A few things worth reading if it&apos;s your first time, or if your conversations keep
            fizzling out after two messages.
          </p>
          <ul className={styles.seoLinks}>
            <li>
              <Link href="/blog/50-best-questions-to-ask-strangers-online-to-keep-conversations-going">
                50 questions to keep a conversation going
              </Link>
            </li>
            <li>
              <Link href="/blog/how-to-stay-safe-chatting-with-strangers-online">
                How to stay safe chatting with strangers
              </Link>
            </li>
            <li>
              <Link href="/blog/text-chat-vs-video-chat-which-is-better">
                Text chat vs video chat
              </Link>
            </li>
            <li>
              <Link href="/blog/how-to-practice-social-skills-and-overcome-anxiety-online">
                Practising social skills online
              </Link>
            </li>
            <li>
              <Link href="/blog/what-to-say-when-conversation-dies-stranger-chat">
                What to say when a conversation dies
              </Link>
            </li>
            <li>
              <Link href="/blog/would-you-rather-questions-to-get-to-know-someone">
                Would You Rather questions that go somewhere
              </Link>
            </li>
            <li>
              <Link href="/blog/why-random-chat-sites-are-full-of-bots">
                Why random chat sites are full of bots
              </Link>
            </li>
          </ul>
        </section>
      </div>
      <ConsentModal isOpen={true} chatType="text" />
    </div>
  );
}
