import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ParticleText from './ParticleText';
import './HeroParticleTitle.css';

const lines = ['让每一次出发，', '都有 AI 相伴。'];

export default function HeroParticleTitle({ openingComplete = true }) {
  const titleRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [supported, setSupported] = useState(true);
  const [particleReady, setParticleReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [type, setType] = useState({ fontSize: 72, letterSpacing: '-2px', lineHeight: '1.3' });

  useLayoutEffect(() => {
    const title = titleRef.current;
    const sync = () => {
      const computed = getComputedStyle(title);
      const next = { fontSize: parseFloat(computed.fontSize), letterSpacing: computed.letterSpacing, lineHeight: computed.lineHeight };
      setType(current => JSON.stringify(current) === JSON.stringify(next) ? current : next);
    };
    const observer = new ResizeObserver(sync);
    observer.observe(title);
    sync();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try { setSupported(Boolean(document.createElement('canvas').getContext('2d'))); }
    catch { setSupported(false); }
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReducedMotion(preference.matches);
    const visibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(titleRef.current);
    preference.addEventListener('change', change);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); preference.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  const animated = visible && pageVisible && supported && !reducedMotion && openingComplete;
  useEffect(() => {
    setParticleReady(false);
    if (!animated) return;
    // Sample only after opening transforms finish. Keep the solid title visible
    // while the original ParticleText performs its initial gathering offscreen.
    const timer = window.setTimeout(() => setParticleReady(true), 2600);
    return () => window.clearTimeout(timer);
  }, [animated]);

  return (
    <div className={`hero-particle-title ${animated && particleReady ? 'is-animated' : ''}`}>
      <h1 ref={titleRef} id="hero-title" className="hero-title-readable"><span className="hero-title-line-mask"><span className="hero-title-line-ink">让每一次出发，</span></span><span className="hero-title-line-mask"><span className="hero-title-line-ink hero-title-accent">都有 AI 相伴。</span></span></h1>
      {animated && <div className="hero-title-particle-layer" aria-hidden="true" style={type}>
        {lines.map(text => <div key={text} className="hero-title-particle-line">
          <span className="hero-title-line-metrics">{text}</span>
          <ParticleText
            text={text}
            particleSize={2}
            density={4}
            color="#ffffff"
            highlightColor="#8b5cf6"
            scatter={180}
            gatherDuration={1600}
            stagger={420}
            pointerRepel={40}
            repelRadius={120}
            idleDrift={0.7}
            trigger="hover"
            fontSize="clamp(3rem, 12vw, 8rem)"
            fontWeight={800}
            fontFamily="inherit"
            glow
          />
        </div>)}
      </div>}
    </div>
  );
}
