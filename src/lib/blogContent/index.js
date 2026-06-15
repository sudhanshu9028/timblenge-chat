/**
 * Blog content index — maps slugs to their content components and metadata.
 * To add a new blog post, create a new file in this directory and add the import here.
 */
import BestOmegleAlternatives, { frontmatter as omegleFm } from './best-omegle-alternatives';
import StaySafeChatting, { frontmatter as staySafeFm } from './stay-safe-chatting-strangers';
import MakeFriendsOnline, { frontmatter as friendsFm } from './make-friends-online';
import CuringBoredom, { frontmatter as boredomFm } from './curing-boredom-online';
import OvercomingSocialAnxiety, {
  frontmatter as anxietyFm,
} from './overcoming-social-anxiety-online';
import QuestionsToAskStrangers, {
  frontmatter as questionsFm,
} from './best-questions-to-ask-strangers';
import WhyOmegleShutDown, { frontmatter as omegleShutDownFm } from './why-omegle-shut-down';
import BestRandomChatAppsMobile, {
  frontmatter as mobileAppsFm,
} from './best-random-chat-apps-mobile';
import LateNightChatWithStrangers, {
  frontmatter as lateNightFm,
} from './late-night-chat-with-strangers';
import TextChatVsVideoChat, { frontmatter as textVsVideoFm } from './text-chat-vs-video-chat';
import AiCompanionVsRealPerson, {
  frontmatter as aiCompanionFm,
} from './ai-companion-vs-real-person';
import DatingAppBurnoutRandomChat, {
  frontmatter as datingBurnoutFm,
} from './dating-app-burnout-random-chat';

const BLOG_CONTENT = {
  'best-omegle-alternatives-safe-free-random-chat': {
    component: BestOmegleAlternatives,
    frontmatter: omegleFm,
  },
  'how-to-stay-safe-chatting-with-strangers-online': {
    component: StaySafeChatting,
    frontmatter: staySafeFm,
  },
  'how-to-make-friends-online-talk-to-strangers': {
    component: MakeFriendsOnline,
    frontmatter: friendsFm,
  },
  'fun-things-to-do-online-when-bored-random-chat': {
    component: CuringBoredom,
    frontmatter: boredomFm,
  },
  'how-to-practice-social-skills-and-overcome-anxiety-online': {
    component: OvercomingSocialAnxiety,
    frontmatter: anxietyFm,
  },
  '50-best-questions-to-ask-strangers-online-to-keep-conversations-going': {
    component: QuestionsToAskStrangers,
    frontmatter: questionsFm,
  },
  'why-did-omegle-shut-down-where-everyone-went-2026': {
    component: WhyOmegleShutDown,
    frontmatter: omegleShutDownFm,
  },
  'best-random-chat-apps-android-iphone-no-signup': {
    component: BestRandomChatAppsMobile,
    frontmatter: mobileAppsFm,
  },
  'cant-sleep-late-night-chat-with-strangers': {
    component: LateNightChatWithStrangers,
    frontmatter: lateNightFm,
  },
  'text-chat-vs-video-chat-which-is-better': {
    component: TextChatVsVideoChat,
    frontmatter: textVsVideoFm,
  },
  'ai-companion-vs-real-person-which-helps-loneliness': {
    component: AiCompanionVsRealPerson,
    frontmatter: aiCompanionFm,
  },
  'dating-app-burnout-why-people-are-trying-random-chat-instead': {
    component: DatingAppBurnoutRandomChat,
    frontmatter: datingBurnoutFm,
  },
};

export default BLOG_CONTENT;
