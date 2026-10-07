import { useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const openClip = 'inset(0% 0% 0% 0%)';
const cardsBySection = {
  assistant: '.assistant-sidebar, .chat-panel, .trip-overview',
  recognition: '.upload-card, .recognition-result',
  planner: '.planner-form, .planner-result',
  weather: '.weather-form, .weather-report',
  inspiration: '.inspiration-copy',
  features: '.feature-card'
};

export default function useSiteMotion(siteRef) {
  const [openingComplete, setOpeningComplete] = useState(false);

  useLayoutEffect(() => {
    const root = siteRef.current;
    // ScrollTrigger caches this mode at registration, which occurs while the
    // HTML startup guard temporarily uses manual restoration.
    const syncRestoration = () => ScrollTrigger.clearScrollMemory(history.scrollRestoration);
    syncRestoration();
    window.addEventListener('tripmind:startup-ready', syncRestoration, { once: true });
    const media = gsap.matchMedia();
    let opened = false;
    let initialized = false;
    const revealed = new WeakSet();
    let mediaScroll = null;
    const rememberScroll = () => { mediaScroll = { x: window.scrollX, y: window.scrollY }; };
    const restoreScroll = () => {
      if (!mediaScroll) return;
      const saved = mediaScroll;
      mediaScroll = null;
      window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
      ScrollTrigger.update();
    };
    // Rebuilding triggers after reduced-motion changes can reset cached scroll.
    gsap.addEventListener('matchMediaInit', rememberScroll);
    gsap.addEventListener('matchMedia', restoreScroll);
    // MatchMedia owns all timelines and triggers, including StrictMode cleanup.
    media.add({
      desktop: '(min-width: 1001px)',
      compact: '(max-width: 1000px)',
      reduced: '(prefers-reduced-motion: reduce)'
    }, context => {
      const { desktop, reduced } = context.conditions;
      if (reduced) {
        opened = true;
        initialized = true;
        setOpeningComplete(true);
        return;
      }

      const select = selector => Array.from(root.querySelectorAll(selector));
      const sectionTimelines = new Map();
      const animatedNodes = new Set();
      const imageNodes = select('.overview-photo img, .photo-upload img');
      const isDeepLink = location.hash && location.hash !== '#home';
      let opening;
      const scroll = () => { if (window.scrollY > 100 && opening?.progress() < 1) finish(opening); };

      const finish = timeline => {
        if (!timeline) return;
        timeline.scrollTrigger?.kill(false);
        timeline.progress(1).pause();
      };

      if (!opened && !isDeepLink && window.scrollY < 80) {
        setOpeningComplete(false);
        const shutter = select('.hero-opening-shutter');
        const panels = select('.hero-opening-shutter > span');
        const lines = select('.hero-title-line-ink');
        const supporting = select('.immersive-description, .immersive-actions, .immersive-proof');
        const discoveries = select('.discovery-card, .discovery-location');
        const temporary = [...lines, ...supporting, ...discoveries, ...select('.header-inner, .immersive-kicker, .immersive-bottom, .hero-video-control, .immersive-backdrop')];
        temporary.forEach(node => animatedNodes.add(node));

        opening = gsap.timeline({
          id: 'tripmind-opening',
          defaults: { ease: 'power4.out' },
          onComplete: () => { opened = true; setOpeningComplete(true); window.removeEventListener('scroll', scroll); }
        });
        opening.set(shutter, { display: 'block' })
          .set(temporary, { willChange: 'transform, clip-path' })
          .fromTo('.immersive-backdrop', { scale: 1.14 }, { scale: 1, duration: 3.5 }, 0)
          .to(panels[0], { yPercent: -102, duration: 1.9, ease: 'power3.inOut' }, 0.05)
          .to(panels[1], { yPercent: 102, duration: 1.9, ease: 'power3.inOut' }, 0.18)
          .fromTo('.header-inner', { y: -65, clipPath: 'inset(100% 0% 0% 0%)' }, { y: 0, clipPath: openClip, duration: 1.25 }, 0.3)
          .fromTo('.immersive-kicker', { y: 28, clipPath: 'inset(0% 0% 100% 0%)' }, { y: 0, clipPath: openClip, duration: 1.1 }, 0.55)
          .fromTo(lines, { yPercent: 118, x: desktop ? -38 : -14, scaleY: 0.52, scaleX: 1.1, skewY: 4 }, { yPercent: 0, x: 0, scaleY: 1, scaleX: 1, skewY: 0, duration: 1.85, stagger: 0.26 }, 0.66)
          .fromTo(supporting, { y: 55, clipPath: 'inset(0% 0% 100% 0%)' }, { y: 0, clipPath: openClip, duration: 1.3, stagger: 0.15 }, 1.56)
          .fromTo(discoveries, { y: desktop ? 100 : 50, clipPath: 'inset(0% 0% 100% 0%)' }, { y: 0, clipPath: openClip, duration: 1.55, stagger: 0.16 }, 1.92)
          .fromTo('.immersive-bottom, .hero-video-control', { y: 32, clipPath: 'inset(0% 0% 100% 0%)' }, { y: 0, clipPath: openClip, duration: 1.1 }, 2.5)
          .set(temporary, { clearProps: 'transform,clipPath,willChange' })
          .set(shutter, { clearProps: 'display' });
      } else {
        opened = true;
        setOpeningComplete(true);
      }

      select('.post-hero-content .section, [data-motion-section]').forEach(section => {
        const words = Array.from(section.querySelectorAll('.motion-word'));
        if (!words.length) return;
        const details = Array.from(section.querySelectorAll('.section-heading'));
        const cards = Array.from(section.querySelectorAll(cardsBySection[section.id] || '.closing-copy, :scope > .button'))
          .filter(card => getComputedStyle(card).display !== 'none');
        const frames = Array.from(section.querySelectorAll('.overview-photo, .photo-upload'));
        const gallery = section.querySelector('.inspiration-gallery');
        const app = section.querySelector('.assistant-app');
        const temporary = [...words, ...details, ...cards, ...frames, ...(gallery ? [gallery] : []), ...(app ? [app] : [])];
        temporary.forEach(node => animatedNodes.add(node));
        const timeline = gsap.timeline({
          id: `tripmind-${section.id || 'closing'}`,
          defaults: { ease: 'power4.out' },
          scrollTrigger: { trigger: section, start: 'top 82%', once: true, fastScrollEnd: true },
          onStart: () => temporary.forEach(node => { node.style.willChange = 'transform, clip-path'; }),
          onComplete: () => revealed.add(section)
        });
        timeline.fromTo(words, { yPercent: 122, x: desktop ? -70 : -25, scaleX: 0.74, skewY: 4 }, { yPercent: 0, x: 0, scaleX: 1, skewY: 0, duration: 1.8, stagger: 0.19 }, 0);
        if (details.length) timeline.fromTo(details, { y: 35, clipPath: 'inset(0% 0% 100% 0%)' }, { y: 0, clipPath: openClip, duration: 1.1 }, 0.64);
        if (app) timeline.fromTo(app, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: openClip, duration: 1.5 }, 0.95);
        if (cards.length) timeline.fromTo(cards, { y: desktop ? 115 : 65, clipPath: 'inset(0% 0% 100% 0%)' }, { y: 0, clipPath: openClip, duration: 1.45, stagger: 0.21 }, 1.02);
        if (gallery) timeline.fromTo(gallery, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: openClip, duration: 1.8 }, 1.2);
        if (frames.length) timeline.fromTo(frames, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: openClip, duration: 1.65, stagger: 0.2 }, 1.42);
        timeline.set(temporary, { clearProps: 'transform,clipPath,willChange' });
        sectionTimelines.set(section, timeline);
        // Initial deep links and content already above the viewport stay readable.
        const bounds = section.getBoundingClientRect();
        if (revealed.has(section) || section.id === location.hash.slice(1) || bounds.bottom < 0 || (initialized && bounds.top < innerHeight * 0.82)) finish(timeline);
      });
      initialized = true;

      if (desktop) imageNodes.forEach(image => {
        const frame = image.parentElement;
        gsap.fromTo(image, { scale: 1.14, yPercent: -4 }, {
          scale: 1.14, yPercent: 4, ease: 'none',
          scrollTrigger: {
            trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 1.3,
            invalidateOnRefresh: true,
            onToggle: self => { image.style.willChange = self.isActive ? 'transform' : ''; }
          }
        });
      });

      const completeSection = element => {
        if (element === root.querySelector('#home')) return;
        finish(opening);
        const section = element?.closest('.section, [data-motion-section]');
        if (section) finish(sectionTimelines.get(section));
      };
      const navigate = () => {
        const id = location.hash.slice(1);
        if (id && id !== 'home') completeSection(document.getElementById(id));
      };
      const focus = event => completeSection(event.target);
      const fontReady = () => ScrollTrigger.refresh();
      let disposed = false;
      document.fonts?.ready.then(() => { if (!disposed) fontReady(); });
      window.addEventListener('hashchange', navigate);
      root.addEventListener('focusin', focus);
      if (opening && !opened) window.addEventListener('scroll', scroll, { passive: true });

      return () => {
        disposed = true;
        window.removeEventListener('hashchange', navigate);
        root.removeEventListener('focusin', focus);
        window.removeEventListener('scroll', scroll);
        animatedNodes.forEach(node => { node.style.willChange = ''; });
        imageNodes.forEach(image => { image.style.willChange = ''; });
      };
    }, root);
    // React renders these anchors after the initial HTML is parsed, so the
    // browser's first hash navigation may run before its target exists.
    const anchorFrame = window.requestAnimationFrame(() => {
      const id = location.hash.slice(1);
      const target = id && id !== 'home' ? document.getElementById(id) : null;
      if (target && root.contains(target)) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => {
      window.cancelAnimationFrame(anchorFrame);
      window.removeEventListener('tripmind:startup-ready', syncRestoration);
      gsap.removeEventListener('matchMediaInit', rememberScroll);
      gsap.removeEventListener('matchMedia', restoreScroll);
      media.revert();
    };
  }, [siteRef]);

  return openingComplete;
}
