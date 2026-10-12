import Link from 'next/link';
import QuestionDeck from '../components/QuestionDeck';
import ToolCta from '../components/ToolCta';
import FaqAccordion from '../components/FaqAccordion';
import styles from '@/styles/tools.module.scss';
import { QUESTION_GROUPS, TOTAL_QUESTIONS } from '@/lib/questionBank';

const URL = 'https://anoniz.com/random-question-generator';
const TITLE = `Random Question Generator: ${TOTAL_QUESTIONS} Conversation Starters | Anoniz`;
const DESCRIPTION = `A free random question generator with ${TOTAL_QUESTIONS} conversation starters: icebreakers, funny, hypothetical, deep and around-the-world questions to ask anyone.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Random Question Generator | Anoniz',
    description: DESCRIPTION,
    url: URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Question Generator | Anoniz',
    description: DESCRIPTION,
  },
};

const FAQ_ITEMS = [
  {
    question: 'What is a good random question to ask someone?',
    answer:
      'One that takes five seconds to answer and cannot be answered with yes or no. “What were you doing right before this?” works better than “how are you?”, because the answer gives you something to ask about next.',
  },
  {
    question: 'How do I use these with a stranger online?',
    answer:
      'Start in Icebreakers and ask one question at a time. Answer it yourself as well, then follow up on what they said before drawing another. Move to Deep only once the replies are getting longer.',
  },
  {
    question: 'Are these questions safe to ask someone I just met?',
    answer:
      'Yes. None of them asks for a name, a city, a school or a workplace. The around-the-world questions are about a country and its habits, never an address.',
  },
  {
    question: 'Is the random question generator free?',
    answer:
      'Yes. There is no account and no limit, and it runs in your browser. Nothing you draw or copy is stored.',
  },
];

export default function RandomQuestionGeneratorPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Random Question Generator</h1>
          <p className={styles.subtitle}>
            {TOTAL_QUESTIONS} questions to ask someone you have just met, sorted by how much effort
            they take to answer.
          </p>
        </header>

        <QuestionDeck tool="random_question" mode="single" groups={QUESTION_GROUPS} />

        <ToolCta
          tool="random_question"
          title="Try one on a real person"
          note="Free, no account, nothing stored afterwards."
        >
          Anoniz pairs you with a stranger for a one-to-one text chat. Add an interest before you
          start and we try to match you with someone who shares it.
        </ToolCta>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How to use a question well</h2>
          <ol className={styles.list}>
            <li>
              <strong>Ask one at a time.</strong> Three questions in a row reads like a form.
            </li>
            <li>
              <strong>Answer it yourself.</strong> A question with no answer attached asks them to
              do all the work.
            </li>
            <li>
              <strong>Follow the answer.</strong> When a reply surprises you, ask about it instead
              of drawing another.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>All {TOTAL_QUESTIONS} questions</h2>
          {QUESTION_GROUPS.map((group) => (
            <div key={group.id}>
              <h3 className={styles.groupTitle}>{group.label}</h3>
              <p className={styles.text}>{group.hint}</p>
              <ol className={styles.list}>
                {group.items.map((question) => (
                  <li key={question}>{question}</li>
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
            Prefer a game? Try the <Link href="/would-you-rather">Would You Rather generator</Link>.
            For openers, read <Link href="/blog/what-to-say-after-hi">what to say after hi</Link>{' '}
            and{' '}
            <Link href="/blog/50-best-questions-to-ask-strangers-online-to-keep-conversations-going">
              50 questions to ask strangers online
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
