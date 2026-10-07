import { useEffect, useRef, useState } from 'react';
import MotionTitle from './components/MotionTitle';
import useSiteMotion from './hooks/useSiteMotion';
import { Compass, Sparkles, MessageSquare, ScanLine, Route, MapPin, Menu, X, Check, Navigation, ChevronDown, CalendarDays, Clock3, CloudSun } from 'lucide-react';
import Assistant from './components/Assistant';
import Recognition from './components/Recognition';
import Planner from './components/Planner';
import WeatherForecast from './components/WeatherForecast';
import HeroBackground from './components/HeroBackground';
import TravelInspiration from './components/TravelInspiration';
import PostHeroContent from './components/PostHeroContent';
import HeroParticleTitle from './components/HeroParticleTitle';
import HeroStartButton from './components/HeroStartButton';

const links = [['home', '首页'], ['assistant', 'AI 助手'], ['recognition', '景点识别'], ['planner', '路线规划'], ['weather', '天气预判'], ['features', '产品功能']];
const startChat = () => { window.setTimeout(() => window.dispatchEvent(new Event('tripmind:focus-chat')), 250); };
function Brand() { return <a className="brand" href="#home" aria-label="途知 TripMind 首页"><span className="brand-icon"><Navigation size={23} strokeWidth={2.2} /></span><span>途知<span className="brand-english">TripMind</span></span></a>; }
function Header() {
  const [active, setActive] = useState(location.hash.slice(1) || 'home');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(window.scrollY > 40);
  useEffect(() => {
    let previous = window.scrollY > 40;
    const update = () => {
      const next = window.scrollY > 40;
      if (next !== previous) { previous = next; setScrolled(next); }
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id); }, { rootMargin: '-15% 0px -60% 0px' });
    links.forEach(([id]) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  return <header className={`header hero-header ${scrolled || open ? 'header-scrolled' : ''}`}><div className="header-inner"><Brand /><nav className={open ? 'nav open' : 'nav'} aria-label="主导航">{links.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => { setActive(id); setOpen(false); }}>{label}</a>)}</nav><div className="header-actions"><span className="demo-badge">Demo v0.1</span><a className="button header-cta" href="#assistant" onClick={startChat}>开始体验<Sparkles size={15} /></a><button type="button" className="icon-button mobile-menu" aria-label={open ? '收起导航' : '打开导航'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></div></header>;
}
function Hero({ openingComplete }) {
  return <section className="immersive-hero" id="home" aria-labelledby="hero-title">
    <HeroBackground openingComplete={openingComplete} />
    <div className="hero-opening-shutter" aria-hidden="true"><span /><span /></div>
    <div className="immersive-inner">
      <div className="immersive-copy">
        <p className="immersive-kicker"><Sparkles size={15} /> AI 驱动的文旅探索<span /> 你的专属旅行助手</p>
        <HeroParticleTitle openingComplete={openingComplete} />
        <p className="immersive-description">从一段灵感，到一份专属行程。<br />用 AI 规划路线、读懂景点，<br className="mobile-copy-break" />发现旅行的更多可能。</p>
        <div className="immersive-actions"><HeroStartButton openingComplete={openingComplete} onStart={() => { window.location.hash = 'assistant'; startChat(); }} /><a href="#recognition" className="immersive-secondary"><span><ScanLine size={20} /></span><div>体验景点识别<small>用一张照片，开启探索</small></div></a></div>
        <div className="immersive-proof"><span><Check size={13} /> 无需注册</span><span><Check size={13} /> 即刻体验</span><span className="immersive-demo">模拟 AI 演示</span></div>
      </div>
      <div className="immersive-discovery" aria-label="旅行探索示例">
        <a href="#planner" className="discovery-card discovery-route"><span className="discovery-label"><Route size={15} /> 文化漫游路线<span className="discovery-sample">示例</span></span><div className="discovery-route-line"><span /><i /><span /><i /><span /></div><div className="discovery-stops"><span>磁器口</span><span>白公馆</span><span>鹅岭二厂</span></div><p>按你的兴趣，串联每一次停留</p></a>
        <a href="#recognition" className="discovery-card discovery-landmark"><span className="discovery-label"><ScanLine size={15} /> 景点探索<span className="discovery-sample">示例</span></span><div className="discovery-landmark-body"><span className="landmark-target"><ScanLine size={30} /></span><div><strong>洪崖洞</strong><span>巴渝建筑 · 山城夜景</span><small><MapPin size={11} /> 重庆，渝中区</small></div></div><p>看见风景，也读懂风景</p></a>
        <a href="#assistant" onClick={startChat} className="discovery-card discovery-plan"><span className="discovery-label"><Sparkles size={15} /> 你的山城旅行灵感<span className="discovery-sample">示例</span></span><strong>留一点时间，给沿途的故事。</strong><div className="discovery-plan-meta"><span><CalendarDays size={14} /> 2 日慢游</span><span><MapPin size={14} /> 6 处停留</span><span><Clock3 size={14} /> 轻松节奏</span></div></a>
        <div className="discovery-location"><span className="location-crosshair"><MapPin size={19} /></span><div><strong>探索灵感 · 重庆</strong><span>两日文化漫游示例</span></div></div>
      </div>
      <div className="immersive-bottom"><CapabilityStrip /><a href="#assistant" className="hero-scroll"><span><ChevronDown size={16} /></span>向下探索</a></div>
    </div>
  </section>;
}
function CapabilityStrip() { return <div className="capability-strip"><div><MessageSquare size={20} /><span><strong>随时提问</strong><small>一个懂旅行的 AI 旅伴</small></span></div><div><ScanLine size={20} /><span><strong>拍照识景</strong><small>让每处风景都有故事</small></span></div><div><Route size={20} /><span><strong>专属路线</strong><small>按你的偏好，安排旅程</small></span></div><span className="strip-signature">把旅行的选择，交给灵感。</span></div>; }
function Features() {
  const features = [{ icon: MessageSquare, title: 'AI 智能问答', description: '不止回答“去哪儿”，也告诉你“为什么”。聊景点、问玩法、找美食，让旅行更有方向。', tag: '自然语言交互', href: '#assistant', button: '和途知聊一聊', className: 'violet' }, { icon: ScanLine, title: '景点识别与讲解', description: '用一张照片开启探索。从景点简介到建筑故事，让你看见的风景变成记得住的故事。', tag: '图片探索体验', href: '#recognition', button: '探索照片里的故事', className: 'blue' }, { icon: Route, title: '个性化路线规划', description: '城市、时间、兴趣和预算，都是行程的一部分。把零散的想法，整理成可以出发的路线。', tag: '偏好驱动规划', href: '#planner', button: '规划下一次出发', className: 'teal' }, { icon: CloudSun, title: '景点天气预判', description: '看七日天气趋势，选择出游日期。从随身准备到室内备选，给计划多留一份从容。', tag: '天气场景演示', href: '#weather', button: '看看下一站的天气', className: 'weather-feature' }];
  return <section className="section features-section" id="features"><MotionTitle words={["ONE", "COMPANION."]} /><div className="section-heading centered"><div><div className="eyebrow">旅行中的每个问题，都有一个新起点。</div><h2>一个旅伴，四种探索方式。</h2></div></div><div className="feature-grid">{features.map(({ icon: Icon, ...item }) => <article className={`feature-card ${item.className}`} key={item.title}><span className="feature-icon"><Icon size={25} /></span><span className="feature-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.description}</p><a href={item.href}>{item.button}</a></article>)}</div></section>;
}
function Footer() { return <><section className="closing" data-motion-section><MotionTitle words={["GO SOMEWHERE", "NEW."]} /><div className="closing-copy"><div className="closing-icon"><Compass size={28} /></div><h2>下一段故事，从这里出发。</h2><p>让 AI 做你的旅伴，让你专心感受世界。</p></div><a className="button primary" href="#assistant" onClick={startChat}><Sparkles size={17} /> 开启我的旅行</a></section><footer className="footer"><div className="footer-main"><div><Brand /><p>AI 文旅智能导览 · 探索，懂你所想。</p></div><div className="footer-nav"><span>体验产品</span><a href="#assistant">AI 助手</a><a href="#recognition">景点识别</a><a href="#planner">路线规划</a><a href="#weather">天气预判</a></div><div className="footer-contact"><span>联系项目</span><p>项目联系方式待补充</p><small>欢迎交流产品想法与体验反馈</small></div></div><div className="footer-bottom"><span>© 2026 途知 TripMind · MVP Demo</span><p>洪崖洞夜景 © <a href="https://commons.wikimedia.org/wiki/File:%E9%87%8D%E5%BA%86%E6%B4%AA%E5%B4%96%E6%B4%9E.jpg" target="_blank" rel="noreferrer">GeoffLeng</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a> · 页面展示裁切</p><span>以灵感为起点，以体验为中心。</span></div></footer></>; }
export default function App() {
  const siteRef = useRef(null);
  const openingComplete = useSiteMotion(siteRef);
  return <div ref={siteRef} className="site-shell"><a href="#assistant" className="skip-link">跳至 AI 助手</a><Header /><main><Hero openingComplete={openingComplete} /><PostHeroContent><Assistant /><Recognition /><Planner /><WeatherForecast /><TravelInspiration /><Features /><Footer /></PostHeroContent></main></div>;
}
