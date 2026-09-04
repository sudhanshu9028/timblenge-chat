'use client';

import { useEffect } from 'react';
import { captureAttribution } from '@/lib/attribution';

/**
 * Records where this session came from, once, as early as the client runs.
 * Renders nothing — it exists so every later event can carry the source.
 */
export default function AnalyticsBootstrap() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
