import dynamic from 'next/dynamic';
const GameApp = dynamic(() => import('./GameApp'), { ssr: false });

export default function Home() {
  return <GameApp />;
} 