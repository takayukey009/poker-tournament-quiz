"use client";

import dynamic from 'next/dynamic';

// Client component with no SSR
const PokerTrainer = dynamic(
  () => import('../src/components/PokerTrainer'),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <PokerTrainer />
    </main>
  );
}
