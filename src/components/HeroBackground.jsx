import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const automaticPlayback = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  && !navigator.connection?.saveData && !['slow-2g', '2g'].includes(navigator.connection?.effectiveType);

export default function HeroBackground({ openingComplete = true }) {
  const videoRef = useRef(null);
  const [wanted, setWanted] = useState(automaticPlayback);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [source] = useState(() => window.matchMedia('(max-width: 760px)').matches
    ? '/videos/hero-background-mobile.mp4' : '/videos/hero-background-desktop.mp4');

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setWanted(automaticPlayback());
    const visibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= 0.2), { threshold: [0, 0.2] });
    observer.observe(videoRef.current.closest('section'));
    preference.addEventListener('change', change);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', change);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    if (loaded || failed || !wanted || !visible || !pageVisible || !openingComplete) return;
    // Recheck geometry after initial hash navigation, and keep media out of opening paint.
    const timer = window.setTimeout(() => {
      const rect = videoRef.current?.closest('section').getBoundingClientRect();
      if (rect && rect.bottom > 0 && rect.top < innerHeight && !document.hidden) setLoaded(true);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [loaded, failed, wanted, visible, pageVisible, openingComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (loaded && wanted && visible && pageVisible && !failed) video.play().catch(() => setPlaying(false));
    else video.pause();
    return () => video.pause();
  }, [loaded, wanted, visible, pageVisible, failed]);

  const toggle = () => {
    if (playing) { setWanted(false); videoRef.current?.pause(); }
    else {
      setLoaded(true); setWanted(true);
      if (loaded) videoRef.current?.play().catch(() => setPlaying(false));
    }
  };

  return <>
    <div className="immersive-backdrop" aria-hidden="true">
      <img src="/images/hero-video-poster-v2.jpg" alt="" width={1280} height={720} decoding="async" fetchPriority="high" />
      <video
        ref={videoRef}
        className={`hero-background-video ${started ? 'video-started' : ''}`}
        src={loaded && !failed ? source : undefined}
        muted loop playsInline preload="none" tabIndex={-1}
        onPlaying={() => { setStarted(true); setPlaying(true); }}
        onPause={() => setPlaying(false)}
        onError={() => { setFailed(true); setPlaying(false); }}
      />
      <div className="immersive-shade" />
    </div>
    {!failed && <button type="button" className="hero-video-control" onClick={toggle} aria-label={playing ? '暂停背景视频' : '播放背景视频'}>
      {playing ? <Pause size={14} /> : <Play size={14} />}
      <span>{playing ? '暂停背景' : '播放背景'}</span>
    </button>}
  </>;
}

