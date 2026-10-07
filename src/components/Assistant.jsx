import MotionTitle from './MotionTitle';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, Plus, MessageSquare, MapPin, Compass, ImagePlus, Send, RotateCcw, PanelLeftClose, Bot, UserRound, Route, Mountain, Utensils, Clock3 } from 'lucide-react';
import { INITIAL_ROUTE, mockReply } from '../mockAi';
import { ATTRACTIONS } from '../attractions';
import RouteCard from './RouteCard';
import HotspotSuggestions from './HotspotSuggestions';

const seedMessages = () => [
  { id: 'seed-user', role: 'user', text: '重庆两天旅游，喜欢历史文化' },
  { id: 'seed-ai', role: 'assistant', text: '当然！我为你准备了一份重庆两日文化漫游路线。走过老街、读懂巴渝故事，也给山城夜色留一点时间。', route: INITIAL_ROUTE }
];
export default function Assistant() {
  const [messages, setMessages] = useState(seedMessages);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [route, setRoute] = useState(INITIAL_ROUTE);
  const [sidebar, setSidebar] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const requestRef = useRef(0);
  const busyRef = useRef(false);
  useEffect(() => () => { requestRef.current += 1; }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = messages[0]?.id === 'seed-user' && messages.length === 2 && !busy ? 0 : scrollRef.current.scrollHeight; }, [messages, busy]);
  const send = async (value) => {
    const text = (value ?? input).trim();
    if (!text || busyRef.current) return;
    busyRef.current = true;
    setBusy(true); setInput('');
    const id = ++requestRef.current;
    setMessages(previous => [...previous, { id: `u-${id}-${Date.now()}`, role: 'user', text }]);
    const answer = await mockReply(text, route);
    if (id !== requestRef.current) return;
    setMessages(previous => [...previous, { id: `a-${id}-${Date.now()}`, role: 'assistant', ...answer }]);
    if (answer.route) setRoute(answer.route);
    busyRef.current = false; setBusy(false);
    inputRef.current?.focus();
  };
  const reset = (sample = false) => {
    requestRef.current += 1; busyRef.current = false; setBusy(false); setInput('');
    setMessages(sample ? seedMessages() : []); setRoute(INITIAL_ROUTE); inputRef.current?.focus();
  };
  useEffect(() => {
    const focus = () => inputRef.current?.focus({ preventScroll: true });
    window.addEventListener('tripmind:focus-chat', focus);
    return () => window.removeEventListener('tripmind:focus-chat', focus);
  }, []);
  return <section className="section assistant-section" id="assistant">
    <MotionTitle words={["A BETTER", "JOURNEY."]} /><div className="section-heading"><div><div className="eyebrow"><span className="section-dash" /> 和你的 AI 旅伴聊一聊</div><h2>灵感，从一句话开始。</h2></div><p>四座城市，{ATTRACTIONS.length} 处景点。问故事、查天气，或规划下一程。</p></div>
    <div className={`assistant-app ${sidebar ? '' : 'sidebar-hidden'}`}>
      <aside className="assistant-sidebar"><div className="workspace-brand"><span className="mini-logo"><Compass size={19} /></span><span>途知工作台</span><button className="icon-button" type="button" aria-label="收起聊天侧栏" onClick={() => setSidebar(false)}><PanelLeftClose size={16} /></button></div><button className="new-chat" type="button" onClick={() => reset()}><Plus size={16} /> 开始新对话</button><span className="sidebar-label">探索工具</span><a href="#assistant" className="sidebar-item active"><MessageSquare size={16} /> AI 旅游助手<span className="tiny-ai">AI</span></a><a href="#recognition" className="sidebar-item"><ImagePlus size={16} /> 景点识别</a><a href="#planner" className="sidebar-item"><Route size={16} /> 路线规划</a><span className="sidebar-label history-label">示例对话</span><button className="sidebar-item history" type="button" onClick={() => reset(true)}><MessageSquare size={14} /><span>重庆两日文化漫游</span></button><button className="sidebar-item history" type="button" disabled={busy} onClick={() => send('成都一天，喜欢美食探索')}><MessageSquare size={14} /><span>成都一日美食探索</span></button><div className="sidebar-bottom"><span className="avatar"><UserRound size={17} /></span><div>旅行体验者<small>无需登录，直接体验</small></div></div></aside>
      <div className="chat-panel"><div className="chat-topbar"><div>{!sidebar && <button type="button" className="icon-button" aria-label="展开聊天侧栏" onClick={() => setSidebar(true)}><PanelLeftClose size={17} /></button>}<Sparkles size={17} /><strong>AI 旅游助手</strong><span className="model-label">TripMind</span></div><button type="button" className="icon-button" aria-label="重置示例对话" onClick={() => reset(true)}><RotateCcw size={16} /></button></div>
      <div className="chat-messages" ref={scrollRef} role="log" aria-label="旅行对话" aria-live="polite">{messages.length === 0 && <div className="chat-empty"><span className="empty-icon"><Sparkles size={30} /></span><h3>下一站，你想去哪里？</h3><p>告诉我目的地、时间和兴趣，开始你的旅行。</p><button type="button" className="chip" onClick={() => send('重庆两天旅游，喜欢历史文化')}>试试重庆两日文化漫游</button></div>}{messages.map(message => <div key={message.id} className={`message ${message.role}`}><span className={`message-avatar ${message.role === 'assistant' ? 'ai-avatar' : ''}`}>{message.role === 'assistant' ? <Sparkles size={16} /> : <UserRound size={16} />}</span><div className="message-body"><span className="message-name">{message.role === 'assistant' ? '途知' : '你'}{message.role === 'assistant' && <span className="tiny-ai">AI</span>}</span><p className="message-text">{message.text}</p>{message.route && <RouteCard route={message.route} compact onAsk={send} />}</div></div>)}{busy && <div className="message assistant"><span className="message-avatar ai-avatar"><Sparkles size={16} /></span><div className="thinking"><span /> <span /> <span /><p>正在整理旅行灵感…</p></div></div>}</div>
      <div className="composer-area"><HotspotSuggestions city={route.city} busy={busy} onAsk={send} /><div className="suggestion-row"><button type="button" onClick={() => send(`${route.city}有哪些景点？`)} disabled={busy}><MapPin size={13} /> 探索更多景点</button><button type="button" onClick={() => send(`${route.city}${route.itinerary[0][0].name}有什么历史故事？`)} disabled={busy}><Mountain size={13} /> 了解景点故事</button><button type="button" onClick={() => send(`${route.city}有什么好吃的？`)} disabled={busy}><Utensils size={13} /> 推荐当地美食</button></div><form className="chat-composer" onSubmit={e => { e.preventDefault(); send(); }}><label className="sr-only" htmlFor="chat-input">输入你的旅行想法</label><textarea ref={inputRef} id="chat-input" value={input} onChange={e => setInput(e.target.value)} placeholder="告诉我，你想开启怎样的旅行？" maxLength={1000} rows={1} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} /><div className="composer-tools"><a href="#recognition" aria-label="前往上传景点图片"><ImagePlus size={19} /></a><span>Enter 发送 · Shift + Enter 换行</span><button type="submit" className="send-button" aria-label={busy ? '等待回复' : '发送消息'} disabled={busy || !input.trim()}><Send size={17} /></button></div></form><p className="ai-disclaimer"><Bot size={12} /> 当前为模拟 AI 演示，内容仅供体验参考</p></div></div>
      <aside className="trip-overview"><div className="overview-title"><Compass size={17} /><h3>你的旅行灵感</h3></div><div className="overview-photo"><img src="/images/chongqing-night-640.webp" srcSet="/images/chongqing-night-640.webp 640w, /images/chongqing-night-1200.webp 1200w" sizes="(max-width: 1000px) 320px, 280px" width={640} height={480} decoding="async" alt="重庆洪崖洞与江岸夜景" loading="lazy" /><span><MapPin size={13} /> {route.city === '重庆' ? '重庆 · 山城夜色' : '重庆 · 示例目的地图片'}</span></div><h4>{route.city} {route.days} 日探索</h4><p className="overview-subtitle">让旅行，刚好合你心意。</p><div className="overview-stats"><div><Clock3 size={15} /><span>旅行时长<strong>{route.days} 天</strong></span></div><div><MapPin size={15} /><span>推荐停留<strong>{route.days * 3} 处</strong></span></div></div><div className="overview-interest"><span>你的偏好</span><p>{route.interest}<span>轻松节奏</span></p></div><div className="overview-note"><Sparkles size={17} /><p>好行程不只是到达。<br />也有沿途的故事和发现。</p></div><a className="overview-link" href="#planner"><Route size={15} /> 调整我的旅行路线</a></aside>
    </div>
  </section>;
}
