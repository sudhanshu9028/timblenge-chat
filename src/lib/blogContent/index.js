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
import ScienceOfTalkingToStrangers, {
  frontmatter as scienceStrangersFm,
} from './science-of-talking-to-strangers';
import WorkingFromHomeLonely, { frontmatter as wfhLonelyFm } from './working-from-home-lonely';
import SocialMediaDetoxRealConversations, {
  frontmatter as socialDetoxFm,
} from './social-media-detox-real-conversations';
import LonelyInCollegeMeetPeople, {
  frontmatter as lonelyCollegeFm,
} from './lonely-in-college-meet-people';
import SpotRedFlagsVideoChat, { frontmatter as redFlagsFm } from './spot-red-flags-video-chat';
import MonkModeDeletedApps, { frontmatter as monkModeFm } from './monk-mode-deleted-apps';
import StrangerBetterThanGroupChat, {
  frontmatter as strangerGroupChatFm,
} from './stranger-better-than-group-chat';
import BedRottingBrainNeeds, { frontmatter as bedRottingFm } from './bed-rotting-brain-needs';
import ScreenAddictionIndiaCrisis, {
  frontmatter as screenAddictionFm,
} from './screen-addiction-india-crisis';
import PracticeEnglishSpeakingOnline, {
  frontmatter as practiceEnglishFm,
} from './practice-english-speaking-online';
import InstantStrangerMatchingAnonymous, {
  frontmatter as instantMatchingFm,
} from './instant-stranger-matching-anonymous';
import SocialBatteryRecharge, { frontmatter as socialBatteryFm } from './social-battery-recharge';
import ThirdPlacesOnline, { frontmatter as thirdPlacesFm } from './third-places-online-gen-z';
import ParasocialBondsCost, { frontmatter as parasocialFm } from './parasocial-bonds-cost';

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
  'science-of-talking-to-strangers-research-benefits': {
    component: ScienceOfTalkingToStrangers,
    frontmatter: scienceStrangersFm,
  },
  'working-from-home-lonely-remote-work-loneliness-solutions': {
    component: WorkingFromHomeLonely,
    frontmatter: wfhLonelyFm,
  },
  'social-media-detox-real-conversations-2026': {
    component: SocialMediaDetoxRealConversations,
    frontmatter: socialDetoxFm,
  },
  'lonely-in-college-meet-people-online-2026': {
    component: LonelyInCollegeMeetPeople,
    frontmatter: lonelyCollegeFm,
  },
  'spot-red-flags-random-video-chat-safety-2026': {
    component: SpotRedFlagsVideoChat,
    frontmatter: redFlagsFm,
  },
  'monk-mode-deleted-apps-now-what-2026': {
    component: MonkModeDeletedApps,
    frontmatter: monkModeFm,
  },
  'talking-to-stranger-better-than-group-chat': {
    component: StrangerBetterThanGroupChat,
    frontmatter: strangerGroupChatFm,
  },
  'bed-rotting-what-your-brain-needs-instead': {
    component: BedRottingBrainNeeds,
    frontmatter: bedRottingFm,
  },
  'screen-addiction-india-crisis-fix': {
    component: ScreenAddictionIndiaCrisis,
    frontmatter: screenAddictionFm,
  },
  'practice-english-speaking-online-strangers': {
    component: PracticeEnglishSpeakingOnline,
    frontmatter: practiceEnglishFm,
  },
  'instant-stranger-matching-anonymous-identity': {
    component: InstantStrangerMatchingAnonymous,
    frontmatter: instantMatchingFm,
  },
  'social-battery-dead-lowest-effort-recharge': {
    component: SocialBatteryRecharge,
    frontmatter: socialBatteryFm,
  },
  'third-places-gen-z-online': {
    component: ThirdPlacesOnline,
    frontmatter: thirdPlacesFm,
  },
  'parasocial-relationships-streamer-not-friend': {
    component: ParasocialBondsCost,
    frontmatter: parasocialFm,
  },
};

export default BLOG_CONTENT;
