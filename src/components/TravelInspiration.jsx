import MotionTitle from './MotionTitle';
import { useState } from 'react';
import { Pause, Play, Route } from 'lucide-react';
import InfiniteSpiral from './InfiniteSpiral';
import './TravelInspiration.css';

const images = [
  { src: '/images/landscape-1.webp', alt: 'Mountain lake' },
  { src: '/images/landscape-2.webp', alt: 'Forest path' },
  { src: '/images/landscape-3.webp', alt: 'Rocky summit' },
  { src: '/images/landscape-4.webp', alt: 'Ocean shore' },
  { src: '/images/landscape-5.webp', alt: 'Green meadow' },
  { src: '/images/landscape-6.webp', alt: 'Desert light' }
];

export default function TravelInspiration() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="section travel-inspiration" id="inspiration" aria-labelledby="inspiration-title">
      <MotionTitle words={["FOLLOW YOUR", "CURIOSITY."]} /><div className="inspiration-layout">
        <div className="inspiration-copy">
          <p className="eyebrow"><span className="section-dash" /> 旅行灵感</p>
          <h2 id="inspiration-title">从一张风景，<br />找到下一站。</h2>
          <p className="inspiration-description">山间的湖，林中的路，海岸的风。<br />把心动的风景，变成下一次出发的理由。</p>
          <a className="button primary" href="#planner"><Route size={17} /> 规划我的下一站</a>
          <p className="inspiration-note">风景图片展示 · 行程规划支持重庆、成都、西安、杭州</p>
        </div>
        <div className="inspiration-gallery" style={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
          <InfiniteSpiral
            items={images}
            animationMode="all"
            speed={paused ? 0 : 0.55}
            radius={170}
            cardWidth={100}
            cardHeight={100}
            verticalSpacing={60}
            perspective={1000}
            cardRadius={10}
            centerScale={1.2}
            edgeBlur={6}
            cardsPerTurn={7}
            pauseOnHover
          />
          <div className="inspiration-gallery-controls">
            <span>拖动探索 · 悬停暂停</span>
            <button type="button" className="button secondary inspiration-pause" aria-pressed={paused} aria-label="暂停风景动画" onClick={() => setPaused(value => !value)}>
              {paused ? <Play size={14} /> : <Pause size={14} />}
              {paused ? '继续播放' : '暂停动画'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
