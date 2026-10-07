import { Component, useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import './SpecularButton.css';
import './HeroStartButton.css';

class ButtonEffectBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function HeroStartButton({ onStart, openingComplete = true }) {
  const rootRef = useRef(null);
  const supportedRef = useRef(null);
  const [ButtonEffect, setButtonEffect] = useState(null);
  const [fallbackFocused, setFallbackFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => setReducedMotion(preference.matches);
    const onVisibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && supportedRef.current === null) {
        try {
          const context = document.createElement('canvas').getContext('webgl2');
          supportedRef.current = Boolean(context);
          context?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch { supportedRef.current = false; }
      }
      setVisible(entry.isIntersecting && supportedRef.current === true);
    });
    observer.observe(rootRef.current);
    preference.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!visible || !pageVisible || reducedMotion || !openingComplete || ButtonEffect) return;
    let disposed = false;
    import('./SpecularButton').then(module => {
      if (!disposed) setButtonEffect(() => module.default);
    }).catch(() => { if (!disposed) setVisible(false); });
    return () => { disposed = true; };
  }, [visible, pageVisible, reducedMotion, openingComplete, ButtonEffect]);

  const label = <><Sparkles size={18} /> 开始我的旅程</>;
  const fallback = <button type="button" className="specular-button specular-button--lg hero-start-button hero-start-fallback" onClick={onStart}><span className="specular-button__label">{label}</span></button>;

  return <span ref={rootRef} className="hero-start-slot"
    onFocusCapture={event => { if (event.target.closest('.hero-start-fallback')) setFallbackFocused(true); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFallbackFocused(false); }}>
    {ButtonEffect && visible && pageVisible && !reducedMotion && openingComplete && !fallbackFocused ? <ButtonEffectBoundary fallback={fallback}>
      <ButtonEffect
        size="lg"
        radius={18}
        tint="#ffffff"
        tintOpacity={0}
        blur={0}
        textColor="#f5f5f5"
        lineColor="#ffffff"
        baseColor="#525252"
        intensity={1}
        shineSize={10}
        shineFade={40}
        thickness={1}
        speed={0.35}
        followMouse
        proximity={250}
        autoAnimate={false}
        onClick={onStart}
        className="hero-start-button"
      >{label}</ButtonEffect>
    </ButtonEffectBoundary> : fallback}
  </span>;
}
