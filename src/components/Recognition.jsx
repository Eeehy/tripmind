import MotionTitle from './MotionTitle';
import { useEffect, useRef, useState } from 'react';
import { ScanLine, Upload, ImagePlus, Sparkles, MapPin, BookOpen, Footprints, Volume2, Square, X, LoaderCircle } from 'lucide-react';
import { ATTRACTION_CITIES, ATTRACTIONS, ATTRACTIONS_BY_CITY } from '../attractions';
import './AttractionGuide.css';

export default function Recognition() {
  const [preview, setPreview] = useState('/images/chongqing-night-1200.webp');
  const [filename, setFilename] = useState('重庆夜景 · 内置示例');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [guide, setGuide] = useState({ city: '重庆', name: '洪崖洞', library: false });
  const landmark = ATTRACTIONS_BY_CITY[guide.city].find(item => item.name === guide.name);
  const fileRef = useRef(null);
  const urlRef = useRef(null);
  const requestRef = useRef(0);
  useEffect(() => () => { requestRef.current += 1; if (urlRef.current) URL.revokeObjectURL(urlRef.current); window.speechSynthesis?.cancel(); }, []);
  const cancelSpeech = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };
  const chooseGuide = (key, value) => {
    cancelSpeech();
    setGuide(previous => ({ ...previous, [key]: value, ...(key === 'city' ? { name: ATTRACTIONS_BY_CITY[value][0].name } : {}), library: true }));
  };
  const upload = async file => {
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('请选择 JPG、PNG 或 WebP 图片。'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('图片不能超过 10 MB，请选择较小的图片。'); return; }
    const id = ++requestRef.current;
    setBusy(false); cancelSpeech();
    const url = URL.createObjectURL(file);
    try {
      const image = new Image(); image.src = url; await image.decode();
      if (id !== requestRef.current) { URL.revokeObjectURL(url); return; }
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = url; setPreview(url); setFilename(file.name); setAnalyzed(false); setGuide({ city: '重庆', name: '洪崖洞', library: false });
    } catch { URL.revokeObjectURL(url); if (id === requestRef.current) setError('这张图片无法读取，请重新选择一张有效图片。'); }
    if (fileRef.current) fileRef.current.value = '';
  };
  const example = () => { requestRef.current += 1; setBusy(false); cancelSpeech(); if (urlRef.current) URL.revokeObjectURL(urlRef.current); urlRef.current = null; setPreview('/images/chongqing-night-1200.webp'); setFilename('重庆夜景 · 内置示例'); setError(''); setAnalyzed(false); setGuide({ city: '重庆', name: '洪崖洞', library: false }); };
  const recognize = async () => { if (busy) return; const id = ++requestRef.current; setBusy(true); setAnalyzed(false); cancelSpeech(); setGuide({ city: '重庆', name: '洪崖洞', library: false }); await new Promise(resolve => setTimeout(resolve, 1200)); if (id !== requestRef.current) return; setBusy(false); setAnalyzed(true); };
  const speak = () => {
    if (!('speechSynthesis' in window)) { setError('当前浏览器不支持语音播放，可以直接阅读右侧讲解。'); return; }
    if (speaking) { cancelSpeech(); return; }
    const utterance = new SpeechSynthesisUtterance(`${landmark.name}。${landmark.intro}${landmark.story}${landmark.play}`);
    utterance.lang = 'zh-CN'; utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = event => { setSpeaking(false); if (!['canceled', 'interrupted'].includes(event.error)) setError('语音播放未成功，请阅读文字讲解，或更换浏览器后重试。'); };
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); setSpeaking(true);
  };
  return <section className="section" id="recognition"><MotionTitle words={["READ THE", "WORLD."]} /><div className="section-heading"><div><div className="eyebrow"><span className="section-dash cyan" /> 用一张照片，打开一段故事</div><h2>看见风景，也读懂风景。</h2></div><p>景点识别与讲解，让眼前的风景更有意义。</p></div><div className="recognition-grid">
    <div className={`upload-card ${dragging ? 'dragging' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files[0]); }}><div className="panel-heading"><span><ImagePlus size={18} /> 上传景点图片</span><span className="muted">JPG / PNG / WebP</span></div><div className="photo-upload"><img src={preview} loading="lazy" decoding="async" width={1200} height={900} alt="待体验识别的景点图片预览" /><span className="photo-caption"><MapPin size={14} /> {filename}</span><button type="button" className="photo-change" onClick={() => fileRef.current?.click()}><Upload size={15} /> 更换图片</button>{busy && <div className="scan-overlay"><span className="scan-beam" /><p><ScanLine size={22} /> 正在展示识别流程…</p></div>}</div><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" aria-label="上传景点照片" className="sr-only" onChange={e => upload(e.target.files[0])} /><div className="upload-footer"><button type="button" className="text-button" onClick={example}>使用示例图片</button><span>可拖拽图片 · 最大 10 MB</span></div><button className="button primary full-width" type="button" disabled={busy} onClick={recognize}>{busy ? <LoaderCircle size={17} className="spin" /> : <ScanLine size={17} />}{busy ? '正在生成示例讲解' : '体验 AI 识别'}</button>{error && <p className="field-error" role="alert">{error}</p>}<p className="upload-privacy">图片仅在本地预览，不会上传至服务器。</p></div>
    <div className="recognition-result" aria-live="polite" aria-busy={busy}><div className="panel-heading"><span><Sparkles size={18} /> 景点探索</span><span className="sample-tag">{busy ? '处理中' : guide.library ? '手动讲解示例' : analyzed ? '模拟识别完成' : '示例预览'}</span></div><div className="guide-library"><div className="guide-library-heading"><span>探索更多景点</span><small>{ATTRACTIONS.length} 处 · 4 座城市</small></div><div className="guide-library-fields"><label htmlFor="guide-city">城市<select id="guide-city" value={guide.city} disabled={busy} onChange={event => chooseGuide('city', event.target.value)}>{ATTRACTION_CITIES.map(city => <option key={city} value={city}>{city}</option>)}</select></label><label htmlFor="guide-sight">讲解景点<select id="guide-sight" value={guide.name} disabled={busy} onChange={event => chooseGuide('name', event.target.value)}>{ATTRACTIONS_BY_CITY[guide.city].map(item => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label></div><p>手动选择景点体验文字与语音讲解，不根据上传图片匹配。</p></div><div className="landmark-heading"><div><span className="small-label"><MapPin size={13} /> {landmark.city}</span><h3>{landmark.name}</h3><p>{landmark.category}</p></div><span className="landmark-icon"><ScanLine size={32} /></span></div><p className="landmark-intro">{landmark.intro}</p><div className="story-block"><h4><BookOpen size={16} /> 风景里的故事</h4><p>{landmark.story}</p></div><div className="story-block"><h4><Footprints size={16} /> 换个角度游玩</h4><p>{landmark.play}</p></div><div className="result-bottom"><button type="button" className="button secondary" onClick={speak}>{speaking ? <Square size={15} /> : <Volume2 size={16} />}{speaking ? '停止讲解' : '聆听示例讲解'}</button>{landmark.source && <a href={landmark.source} target="_blank" rel="noreferrer" className="source-link">景点资料来源</a>}</div><p className="recognition-disclaimer">{guide.library ? '当前为手动选择的景点讲解，与左侧图片无关联；体验识别将恢复洪崖洞模拟结果。' : analyzed ? '此结果为固定洪崖洞示例，不基于上传图片分析。' : '上传任意图片均展示洪崖洞示例，供体验交互流程。'}</p></div>
  </div></section>;
}
