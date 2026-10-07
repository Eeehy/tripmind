import MotionTitle from './MotionTitle';
import { useEffect, useRef, useState } from 'react';
import { MapPin, CalendarDays, Heart, Wallet, Sparkles, SlidersHorizontal, LoaderCircle, Check, CloudSun } from 'lucide-react';
import { CITIES, INTERESTS, TRAVEL_DAYS, INITIAL_ROUTE, createRoute } from '../mockAi';
import RouteCard from './RouteCard';

const durationDescriptions = ['城市初体验', '深度慢旅行', '三日轻松游', '城市深探索', '悠闲度假游', '从容长旅行', '一周沉浸游'];

export default function Planner() {
  const [form, setForm] = useState({ city: '重庆', days: '2', interest: '历史文化', budget: '800' });
  const [route, setRoute] = useState(INITIAL_ROUTE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState(false);
  const requestRef = useRef(0);
  useEffect(() => () => { requestRef.current += 1; }, []);
  const update = (key, value) => { setForm(prev => ({ ...prev, [key]: value })); setUpdated(false); setError(''); };
  const submit = async e => {
    e.preventDefault(); if (busy) return;
    let next; try { next = createRoute(form); } catch (issue) { setError(issue.message); return; }
    const id = ++requestRef.current; setBusy(true); setError(''); setUpdated(false);
    await new Promise(resolve => setTimeout(resolve, 1100));
    if (id !== requestRef.current) return;
    setRoute(next); setBusy(false); setUpdated(true);
  };
  return <section className="section" id="planner"><MotionTitle words={["MAKE IT", "YOURS."]} /><div className="section-heading"><div><div className="eyebrow"><span className="section-dash" /> 为你的喜好，安排刚好的旅程</div><h2>你的旅行，你来定义。</h2></div><p>从目的地到每一次停留，都更贴近你的节奏。</p></div><div className="planner-grid"><form className="planner-form" onSubmit={submit}><div className="panel-heading"><span><SlidersHorizontal size={18} /> 旅行偏好</span><span className="sample-tag">个性化规划</span></div><label className="form-label" htmlFor="city"><MapPin size={16} /> 目的地城市</label><select id="city" value={form.city} onChange={e => update('city', e.target.value)} disabled={busy}>{CITIES.map(city => <option key={city}>{city}</option>)}</select><label className="form-label" htmlFor="days"><CalendarDays size={16} /> 旅行时间</label><select id="days" value={form.days} onChange={e => update('days', e.target.value)} disabled={busy}>{TRAVEL_DAYS.map(days => <option key={days} value={days}>{days} 天 · {durationDescriptions[days - 1]}</option>)}</select><fieldset disabled={busy}><legend className="form-label"><Heart size={16} /> 兴趣偏好</legend><div className="interest-options">{INTERESTS.map(interest => <label key={interest} className={`interest-option ${form.interest === interest ? 'selected' : ''}`}><input type="radio" name="interest" value={interest} checked={form.interest === interest} onChange={e => update('interest', e.target.value)} /><span>{interest}</span>{form.interest === interest && <Check size={13} />}</label>)}</div></fieldset><label className="form-label" htmlFor="budget"><Wallet size={16} /> 行程预算</label><div className="budget-input"><span>¥</span><input id="budget" type="number" min="100" max="20000" step="1" required value={form.budget} onChange={e => update('budget', e.target.value)} disabled={busy} /><span>/ 人</span></div><p className="form-hint">100–20000 元，不含住宿与往返交通。</p><button type="submit" className="button primary full-width" disabled={busy}>{busy ? <LoaderCircle size={17} className="spin" /> : <Sparkles size={17} />}{busy ? '正在编排你的旅程…' : '生成我的旅行路线'}</button>{error && <p className="field-error" role="alert">{error}</p>}<p className="form-note">按选择展示本地示例，不查询实时门票或交通。</p><a className="weather-planner-link" href="#weather" onClick={() => window.dispatchEvent(new CustomEvent('tripmind:weather-city', { detail: form.city }))}><CloudSun size={16} aria-hidden="true" /> 出游前，看看目的地天气</a></form><div className="planner-result" aria-busy={busy} aria-live="polite"><div className="planner-status"><span><Sparkles size={16} /> {busy ? '正在整理路线…' : updated ? '已为你更新路线' : '为你准备的行程灵感'}</span><span>{route.days * 3} 个停留点</span></div><RouteCard key={`${route.city}-${route.days}-${route.interest}-${route.budget}`} route={route} /></div></div></section>;
}
