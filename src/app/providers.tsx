'use client';

import React from 'react';
import { SWRConfig } from 'swr';

const swrConfig = {
  // Global fetcher: Dùng fetch API cho mọi request
  fetcher: (resource: string) => fetch(resource).then(res => res.json()),
  revalidateOnFocus: false, // Tùy chọn
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
}