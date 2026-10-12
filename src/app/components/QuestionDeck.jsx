'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/styles/tools.module.scss';
import { track, EVENTS } from '@/lib/analytics';

const ALL = 'all';

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);

/** The question as one line of text — what the Copy button puts on the clipboard. */
function asText(mode, item) {
  if (mode !== 'versus') return item;
  return `Would you rather ${lowerFirst(item[0])} or ${lowerFirst(item[1])}?`;
}

/**
 * One question at a time, drawn at random from a group.
 *
 * Shared by the Would You Rather generator (`mode="versus"`, each item a pair
 * of options) and the random question generator (`mode="single"`, each item a
 * string).
 *
 * The first question is always item 0 of the first group rather than a random
 * one. A random first draw would differ between the server render and the
 * client, which is a hydration mismatch — and it would also mean a crawler and
 * a reader never see the same page.
 *
 * Nothing is stored. There are no vote counts because there is nowhere to keep
 * them, and a made-up "62% chose this" would be worse than none.
 *
 * @param {{
 *   tool: string,
 *   mode: 'versus' | 'single',
 *   groups: Array<{ id: string, label: string, hint: string, items: Array<string | string[]> }>,
 * }} props
 */
export default function QuestionDeck({ tool, mode, groups }) {
  const [groupId, setGroupId] = useState(groups[0].id);
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState([0]);
  const [choice, setChoice] = useState(null);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef(null);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const group = groups.find((entry) => entry.id === groupId);
  const pool = useMemo(
    () => (group ? group.items : groups.flatMap((entry) => entry.items)),
    [group, groups]
  );
  const item = pool[index];

  const reset = () => {
    setChoice(null);
    setCopied(false);
  };

  const selectGroup = (id) => {
    if (id === groupId) return;
    setGroupId(id);
    setIndex(0);
    setSeen([0]);
    reset();
  };

  const next = () => {
    const all = pool.map((_, i) => i);
    const unseen = all.filter((i) => !seen.includes(i));
    // Every question in the group has come up — start again, but never repeat
    // the one on screen, which would look like the button did nothing.
    const candidates = unseen.length ? unseen : all.filter((i) => i !== index);
    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    setIndex(pick);
    setSeen(unseen.length ? [...seen, pick] : [pick]);
    reset();
    track(EVENTS.TOOL_NEXT, { tool, group: groupId });
  };

  const choose = (side) => {
    setChoice(side);
    track(EVENTS.TOOL_ANSWERED, { tool, group: groupId });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asText(mode, item));
    } catch {
      // Clipboard access is blocked in some in-app browsers. The question is
      // on screen and selectable, so there is nothing useful to fall back to.
      return;
    }
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1600);
    track(EVENTS.TOOL_COPIED, { tool, group: groupId });
  };

  return (
    <div className={styles.deck}>
      <div className={styles.chips} role="group" aria-label="Question type">
        {groups.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`${styles.chip} ${entry.id === groupId ? styles.chipActive : ''}`}
            aria-pressed={entry.id === groupId}
            onClick={() => selectGroup(entry.id)}
          >
            {entry.label}
          </button>
        ))}
        <button
          type="button"
          className={`${styles.chip} ${groupId === ALL ? styles.chipActive : ''}`}
          aria-pressed={groupId === ALL}
          onClick={() => selectGroup(ALL)}
        >
          Mix
        </button>
      </div>
      <div className={styles.meta}>
        <p className={styles.hint}>{group ? group.hint : 'Anything from any group.'}</p>
        <span className={styles.progress}>
          {seen.length} of {pool.length}
        </span>
      </div>

      <div className={styles.card} aria-live="polite">
        {mode === 'versus' ? (
          <>
            <p className={styles.lead}>Would you rather…</p>
            <div className={styles.options}>
              {item.map((option, side) => (
                <Fragment key={option}>
                  {side === 1 ? (
                    <span className={styles.or} aria-hidden="true">
                      or
                    </span>
                  ) : null}
                  <button
                    type="button"
                    className={`${styles.option} ${choice === side ? styles.optionChosen : ''}`}
                    aria-pressed={choice === side}
                    onClick={() => choose(side)}
                  >
                    {option}
                  </button>
                </Fragment>
              ))}
            </div>
            <p className={styles.prompt}>
              {choice === null
                ? 'Pick a side. No “both”, no “neither”.'
                : 'Now say why. The why is the conversation.'}
            </p>
          </>
        ) : (
          <p className={styles.question}>{item}</p>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.next} onClick={next}>
          Next question
        </button>
        <button type="button" className={styles.copy} onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
