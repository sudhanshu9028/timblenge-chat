import Link from 'next/link';
import QuestionDeck from '../components/QuestionDeck';
import ToolCta from '../components/ToolCta';
import FaqAccordion from '../components/FaqAccordion';
import styles from '@/styles/tools.module.scss';
// The same bank the in-chat game draws from, so the page can never promise a
// question the chat doesn't have, or the other way round.
import { QUESTIONS, TOTAL_QUESTIONS } from '@/server/games/wouldYouRather';

const URL = 'https://anoniz.com/would-you-rather';
const TITLE = `Would You Rather Generator – ${TOTAL_QUESTIONS} Questions, Free | Anoniz`;
const DESCRIPTION = `A free Would You Rather generator with ${TOTAL_QUESTIONS} questions in three levels: playful, values and deep. Pick a side, copy it, or play it with a stranger.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Would You Rather Generator | Anoniz',
    description: DESCRIPTION,
    url: URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Would You Rather Generator | Anoniz',
    description: DESCRIPTION,
  },
};

const LEVELS = [
  { tier: 1, id: 'playful', label: 'Playful', hint: 'Safe to answer in the first thirty seconds.' },
  { tier: 2, id: 'values', label: 'Values', hint: 'You learn something real about them here.' },
  { tier: 3, id: 'deep', label: 'Deep', hint: 'For two people who are still talking.' },
];

const GROUPS = LEVELS.map(({ tier, ...level }) => ({ ...level, items: QUESTIONS[tier] }));

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);

const FAQ_ITEMS = [
  {
    question: 'Is the Would You Rather generator free?',
    answer:
      'Yes. There is no account, no limit and nothing to install. It runs in your browser, and nothing you pick is stored or sent anywhere.',
  },
  {
    question: 'Can you play Would You Rather over text?',
    answer:
      'Yes, and it suits text well because each turn is one message. Press Copy to put the question on your clipboard, paste it into the chat, and make sure you both answer before either of you explains.',
  },
  {
    question: 'How many questions are there?',
    answer: `${TOTAL_QUESTIONS} in total: ${QUESTIONS[1].length} playful, ${QUESTIONS[2].length} about values and ${QUESTIONS[3].length} deep. They are the same questions the game uses inside an Anoniz chat.`,
  },
  {
    question: 'Are these questions safe to ask a stranger?',
    answer:
      'None of them asks for a name, a location or anything else that identifies you. The deep ones are personal, though, so save them for a conversation that has earned it, and skip any you would not want to answer yourself.',
  },
];

export default function WouldYouRatherPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Would You Rather Generator</h1>
          <p className={styles.subtitle}>
            {TOTAL_QUESTIONS} questions in three levels. Pick a side, then say why.
          </p>
        </header>

        <QuestionDeck tool="would_you_rather" mode="versus" groups={GROUPS} />

        <ToolCta
          tool="would_you_rather"
          title="Play it with a stranger"
          note="Free, no account. The game is not offered in AI chats."
        >
          Would You Rather is built into Anoniz text chat. Once you are talking to a real person,
          either of you can start a round, and the questions get deeper the longer you both stay.
        </ToolCta>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How to play</h2>
          <ol className={styles.list}>
            <li>
              <strong>Ask the question.</strong> Read it out, or copy it into a chat.
            </li>
            <li>
              <strong>Both pick a side.</strong> Answer before either of you explains.
            </li>
            <li>
              <strong>Say why.</strong> Then ask one follow-up before the next question.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why the questions come in levels</h2>
          <p className={styles.text}>
            A deep question lands badly with someone you met a minute ago, and a playful one lowers
            the guard first. So the levels are meant to be played in order.
          </p>
          <p className={styles.text}>
            The game inside an Anoniz chat follows the same order. Rounds one and two are playful,
            three and four are about values, and everything after that is deep.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>All {TOTAL_QUESTIONS} Would You Rather questions</h2>
          {GROUPS.map((group) => (
            <div key={group.id}>
              <h3 className={styles.groupTitle}>{group.label}</h3>
              <ol className={styles.list}>
                {group.items.map(([first, second]) => (
                  <li key={first}>
                    {first} or {lowerFirst(second)}?
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Common questions</h2>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>More ways to keep a chat going</h2>
          <p className={styles.text}>
            Want plain questions instead of dilemmas? Try the{' '}
            <Link href="/random-question-generator">random question generator</Link>. For the
            thinking behind the game, read{' '}
            <Link href="/blog/would-you-rather-questions-to-get-to-know-someone">
              Would You Rather questions that go somewhere
            </Link>{' '}
            and <Link href="/blog/games-to-play-over-text">eight games to play over text</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
