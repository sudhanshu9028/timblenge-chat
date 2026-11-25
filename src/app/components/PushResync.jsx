'use client';

import { useEffect } from 'react';
import { resyncPushSubscription } from '@/lib/push';

/**
 * Re-registers a push subscription this browser already has, in case the
 * server lost it. Never prompts. Renders nothing.
 */
export default function PushResync() {
  useEffect(() => {
    resyncPushSubscription();
  }, []);

  return null;
}
