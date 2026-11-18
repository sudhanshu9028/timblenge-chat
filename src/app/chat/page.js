import Link from 'next/link';
import ConsentModal from '../components/ConsentModal';
import styles from '@/styles/chatVideoPage.module.scss';
import { CHAT_FAQ_ITEMS } from '@/lib/chatFaqData';

const PAGE_URL = 'https://anoniz.com/chat';

const FEATURES = [
  {
    title: 'One-on-one, not a chat room',
    text: "You talk to one person at a time. There are no group rooms and no public feed, so only the two of you see the conversation. When you're done, press Next and we'll match you with someone else.",
  },
  {
    title: 'No sign-up, no email, no app',
    text: "There's no account to create and no password to remember. Anoniz runs in your browser on a phone or a laptop, and text chat never asks for your camera or microphone.",
  },
  {
    title: "Matched on what you're into",
    text: 'Add interests separated by commas, such as music, gaming or travel. We look for someone waiting who entered the same word, so short, common words work best. If nobody has, we connect you with the next person available.',
  },
  {
    title: 'Photos that disappear',
    text: "Photos are view-once: the other person can open one once, for 10 seconds. It's deleted when opened, when either of you leaves, or after five minutes unopened, and location details are removed before it's sent.",
  },
  {
    title: 'A game for when it goes quiet',
    text: "Either of you can start Would You Rather with a real person, and we suggest it when the chat stalls. You both pick a side, then see each other's answers together.",
  },
  {
    title: 'Free, with no message limit',
    text: 'There is no trial, no premium tier and no cap on how much you can say.',
  },
];

const RELATED_LINKS = [
  {
    href: '/blog/what-to-say-after-hi',
    label: 'What to say after hi',
  },
  {
    href: '/blog/50-best-questions-to-ask-strangers-online-to-keep-conversations-going',
    label: '50 questions to keep a conversation going',
  },
  {
    href: '/blog/how-to-stay-safe-chatting-with-strangers-online',
    label: 'How to stay safe chatting with strangers',
  },
  {
    href: '/blog/text-chat-vs-video-chat-which-is-better',
    label: 'Text chat vs video chat',
  },
  {
    href: '/blog/how-to-practice-social-skills-and-overcome-anxiety-online',
    label: 'Practising social skills online',
  },
  {
    href: '/blog/what-to-say-when-conversation-dies-stranger-chat',
    label: 'What to say when a conversation dies',
  },
  {
    href: '/blog/would-you-rather-questions-to-get-to-know-someone',
    label: 'Would You Rather questions that go somewhere',
  },
  {
    href: '/blog/why-random-chat-sites-are-full-of-bots',
    label: 'Why random chat sites are full of bots',
  },
  { href: '/random-question-generator', label: 'Random question generator' },
  { href: '/would-you-rather', label: 'Would You Rather generator' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: 'Anonymous Text Chat with Strangers',
      description:
        'Free one-to-one anonymous text chat with strangers. No sign-up, interest matching and view-once photos.',
      inLanguage: 'en',
      isPartOf: { '@id': 'https://anoniz.com/#website' },
      about: { '@id': 'https://anoniz.com/#webapp' },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://anoniz.com' },
        { '@type': 'ListItem', position: 2, name: 'Text chat', item: PAGE_URL },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: CHAT_FAQ_ITEMS.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ],
};

export default function ChatPage() {
  return (
    <div className={styles.pageContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.seoContent}>
        <h1 className={styles.seoTitle}>Anonymous Text Chat with Strangers Online</h1>
        <p className={styles.seoDescription}>
          Anoniz is free anonymous text chat: we pair you with one random person for a one-on-one
          conversation. There is nothing to download and no account to make. Confirm you&apos;re
          over 18 and you&apos;ll usually be talking to someone within seconds.
        </p>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>How it works</h2>
          <ol className={styles.seoSteps}>
            <li>
              <strong>Confirm you&apos;re 18 or older.</strong> You can also add a few interests,
              such as music, gaming or travel.
            </li>
            <li>
              <strong>We look for a real person.</strong> Matching usually takes a few seconds. If
              the site is quiet we keep searching, and our AI can keep you company in the meantime.
              It&apos;s clearly labelled, and we can move you to a real person when one is free.
            </li>
            <li>
              <strong>Talk, or move on.</strong> Send messages and view-once photos. If the
              conversation isn&apos;t working, press Next and we&apos;ll find someone else.
            </li>
          </ol>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>What you get with Anoniz text chat</h2>
          {FEATURES.map((feature) => (
            <div key={feature.title} className={styles.seoFeature}>
              <h3 className={styles.seoSubheading}>{feature.title}</h3>
              <p className={styles.seoText}>{feature.text}</p>
            </div>
          ))}
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Why people use text chat instead of video</h2>
          <p className={styles.seoText}>
            Text is the lower-pressure way to meet someone new. You don&apos;t have to think about
            your camera, your room, your hair or the time of day, and you get a moment to think
            before you reply. That makes it easier if you&apos;re shy, if you&apos;re practising a
            language, or if you just want to talk to someone without being seen.
          </p>
          <p className={styles.seoText}>
            Rather see who you&apos;re talking to? Try <Link href="/video">random video chat</Link>{' '}
            instead.
          </p>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Is it safe to chat with strangers?</h2>
          <p className={styles.seoText}>
            It can be, if you keep the conversation anonymous. The one rule that matters: never
            share anything that identifies you. No full name, no address, no school or workplace, no
            phone number, no social handles, and no photos you wouldn&apos;t want a stranger to
            keep. Anoniz never asks for any of it.
          </p>
          <p className={styles.seoText}>
            We don&apos;t read or store your messages, which also means nobody is watching the
            conversation for you. If someone makes you uncomfortable, don&apos;t argue with them.
            Press Next and you&apos;ll move on. To tell us about a problem, email{' '}
            <a href="mailto:support@anoniz.com">support@anoniz.com</a>.
          </p>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Common questions</h2>
          {CHAT_FAQ_ITEMS.map((item) => (
            <div key={item.question} className={styles.seoQa}>
              <h3 className={styles.seoQuestion}>{item.question}</h3>
              <p className={styles.seoText}>
                {item.answer}
                {item.link ? (
                  <>
                    {' '}
                    <Link href={item.link.href}>{item.link.label}</Link>.
                  </>
                ) : null}
              </p>
            </div>
          ))}
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Helpful reading</h2>
          <p className={styles.seoText}>
            A few things worth reading if it&apos;s your first time, or if your conversations keep
            fizzling out after two messages.
          </p>
          <ul className={styles.seoLinks}>
            {RELATED_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <ConsentModal isOpen={true} chatType="text" />
    </div>
  );
}
