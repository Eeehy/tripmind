import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import GalaxyBackdrop from './GalaxyBackdrop';
import './PostHeroContent.css';

export default function PostHeroContent({ children }) {
  const [paused, setPaused] = useState(false);
  const contentRef = useRef(null);
  return (
    <div ref={contentRef} className="post-hero-content">
      <div className="page-galaxy-background" aria-hidden="true">
        <div className="page-galaxy-viewport"><GalaxyBackdrop paused={paused} interactionRoot={contentRef} /></div>
      </div>
      <button type="button" className="button secondary page-galaxy-control" aria-label="暂停页面背景动画" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
        {paused ? <Play size={14} /> : <Pause size={14} />}
        {paused ? '播放背景' : '暂停背景'}
      </button>
      <div className="main-container">{children}</div>
    </div>
  );
}
