import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';

const Beams = lazy(() => import('./Beams'));

class BeamsBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function BeamsBackdrop({ paused }) {
  const rootRef = useRef(null);
  const supportedRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const root = rootRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => setReducedMotion(preference.matches);
    const onVisibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && supportedRef.current === null) {
        // Probe once so browsers without WebGL can retain the static background.
        try {
          const context = document.createElement('canvas').getContext('webgl2');
          supportedRef.current = Boolean(context);
          context?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch { supportedRef.current = false; }
      }
      setVisible(entry.isIntersecting && supportedRef.current === true);
    }, { threshold: 0.01 });
    observer.observe(root);
    preference.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div ref={rootRef} className="beams-backdrop" aria-hidden="true">
      {visible && pageVisible && !paused && !reducedMotion && (
        <BeamsBoundary>
          <Suspense fallback={null}>
            <div className="beams-backdrop-stage" style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Beams
                beamWidth={2}
                beamHeight={15}
                beamNumber={12}
                lightColor="#ffffff"
                speed={2}
                noiseIntensity={1.75}
                scale={0.2}
                rotation={0}
              />
            </div>
          </Suspense>
        </BeamsBoundary>
      )}
    </div>
  );
}
