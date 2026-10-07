import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';

const Galaxy = lazy(() => import('./Galaxy'));

class GalaxyBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function GalaxyBackdrop({ paused, interactionRoot }) {
  const rootRef = useRef(null);
  const supportedRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const root = rootRef.current;
    const area = interactionRoot.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => setReducedMotion(preference.matches);
    const onVisibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && supportedRef.current === null) {
        try {
          const probe = document.createElement('canvas');
          const context = probe.getContext('webgl2') || probe.getContext('webgl');
          supportedRef.current = Boolean(context);
          context?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch { supportedRef.current = false; }
      }
      setVisible(entry.isIntersecting && supportedRef.current === true);
    }, { threshold: 0.01 });
    // Forward movement to the official component without putting the background
    // above clickable page content. Non-bubbling events avoid forwarding loops.
    let pointerFrame = null;
    let pointerEvent;
    const dispatchPointer = () => {
      pointerFrame = null;
      if (document.hidden || !pointerEvent) return;
      root.querySelector('.galaxy-container')?.dispatchEvent(new MouseEvent(pointerEvent.type, {
        clientX: pointerEvent.clientX, clientY: pointerEvent.clientY, bubbles: false
      }));
    };
    const forwardMouse = event => {
      if (!root.querySelector('.galaxy-container')) return;
      pointerEvent = { type: event.type, clientX: event.clientX, clientY: event.clientY };
      if (pointerFrame === null) pointerFrame = requestAnimationFrame(dispatchPointer);
    };
    observer.observe(root);
    preference.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', onVisibility);
    area.addEventListener('mousemove', forwardMouse);
    area.addEventListener('mouseleave', forwardMouse);
    return () => {
      observer.disconnect();
      if (pointerFrame !== null) cancelAnimationFrame(pointerFrame);
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
      area.removeEventListener('mousemove', forwardMouse);
      area.removeEventListener('mouseleave', forwardMouse);
    };
  }, [interactionRoot]);

  return (
    <div ref={rootRef} className="galaxy-backdrop" aria-hidden="true">
      {visible && pageVisible && !paused && !reducedMotion && (
        <GalaxyBoundary>
          <Suspense fallback={null}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Galaxy
                mouseRepulsion={true}
                mouseInteraction={true}
                density={1.5}
                glowIntensity={0.5}
                saturation={0.8}
                hueShift={240}
              />
            </div>
          </Suspense>
        </GalaxyBoundary>
      )}
    </div>
  );
}
