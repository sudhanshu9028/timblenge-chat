/**
 * Blog content index — maps slugs to their content components and metadata.
 * To add a new blog post, create a new file in this directory and add the import here.
 */
import BestOmegleAlternatives, { frontmatter as omegleFm } from './best-omegle-alternatives';
import StaySafeChatting, { frontmatter as staySafeFm } from './stay-safe-chatting-strangers';
import MakeFriendsOnline, { frontmatter as friendsFm } from './make-friends-online';

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
};

export default BLOG_CONTENT;
