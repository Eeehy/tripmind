import { useEffect, useRef, useState } from 'react';
import { CalendarDays, CloudSun, Cloud, CloudRain, Sun, MapPin, Sparkles, LoaderCircle, Droplets, Wind, Umbrella, Clock3, Backpack, Landmark, ArrowUpRight } from 'lucide-react';
import { WEATHER_SIGHTS, getWeatherDates, createMockWeather } from '../mockWeather';
import MotionTitle from './MotionTitle';
import './WeatherForecast.css';

const icons = { sunny: Sun, cloudy: CloudSun, rain: CloudRain, showers: CloudRain };
function WeatherIcon({ code, size = 24 }) {
  const Icon = icons[code] || Cloud;
  return <Icon size={size} strokeWidth={1.4} aria-hidden="true" />;
}
const initialForm = () => ({ city: '重庆', sight: '洪崖洞', date: getWeatherDates()[1] });

export default function WeatherForecast() {
  const [form, setForm] = useState(initialForm);
  const [report, setReport] = useState(() => createMockWeather(initialForm()));
  const [busy, setBusy] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState('');
  const requestRef = useRef(0);
  const dates = getWeatherDates();
  const changed = form.city !== report.city || form.sight !== report.sight || form.date !== report.date;
  const { selected } = report;

  useEffect(() => {
    const selectCity = event => {
      const city = event.detail;
      if (!Object.hasOwn(WEATHER_SIGHTS, city)) return;
      requestRef.current += 1;
      const next = { city, sight: WEATHER_SIGHTS[city][0], date: getWeatherDates()[1] };
      setForm(next); setReport(createMockWeather(next));
      setBusy(false); setUpdated(false); setError('');
    };
    window.addEventListener('tripmind:weather-city', selectCity);
    return () => { requestRef.current += 1; window.removeEventListener('tripmind:weather-city', selectCity); };
  }, []);

  const update = (key, value) => {
    setForm(previous => ({ ...previous, [key]: value, ...(key === 'city' ? { sight: WEATHER_SIGHTS[value][0] } : {}) }));
    setUpdated(false); setError('');
  };
  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    let next;
    try { next = createMockWeather(form); }
    catch (issue) { setError(issue.message); return; }
    const request = ++requestRef.current;
    setBusy(true); setError('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (request !== requestRef.current) return;
    setReport(next); setBusy(false); setUpdated(true);
  };
  const chooseDay = date => {
    if (busy) return;
    const next = { city: report.city, sight: report.sight, date };
    try { setReport(createMockWeather(next)); setForm(next); setUpdated(true); setError(''); }
    catch (issue) { setError(issue.message); }
  };

  return <section className="section weather-section" id="weather" aria-labelledby="weather-title">
    <MotionTitle words={['READ THE', 'SKY.']} />
    <div className="section-heading"><div><div className="eyebrow"><span className="section-dash" /> 让天气，也成为行程的一部分</div><h2 id="weather-title">景点天气预判</h2></div><p>看一看天空，再决定怎样出发。</p></div>
    <div className="weather-layout">
      <form className="weather-form" onSubmit={submit}>
        <div className="panel-heading"><span><CloudSun size={18} aria-hidden="true" /> 出游前的准备</span><span className="sample-tag">模拟天气</span></div>
        <label className="form-label" htmlFor="weather-city"><MapPin size={16} aria-hidden="true" /> 目的地城市</label>
        <select id="weather-city" value={form.city} disabled={busy} onChange={event => update('city', event.target.value)}>{Object.keys(WEATHER_SIGHTS).map(city => <option key={city}>{city}</option>)}</select>
        <label className="form-label" htmlFor="weather-sight"><Landmark size={16} aria-hidden="true" /> 想去的景点</label>
        <select id="weather-sight" value={form.sight} disabled={busy} onChange={event => update('sight', event.target.value)}>{WEATHER_SIGHTS[form.city].map(sight => <option key={sight}>{sight}</option>)}</select>
        <label className="form-label" htmlFor="weather-date"><CalendarDays size={16} aria-hidden="true" /> 出游日期</label>
        <input id="weather-date" type="date" value={form.date} min={dates[0]} max={dates[6]} required disabled={busy} onChange={event => update('date', event.target.value)} aria-describedby="weather-date-hint" />
        <p className="form-hint" id="weather-date-hint">可体验今天起 7 天内的天气场景。</p>
        <button className="button primary full-width" type="submit" disabled={busy}>{busy ? <LoaderCircle size={17} className="spin" aria-hidden="true" /> : <Sparkles size={17} aria-hidden="true" />}{busy ? '正在整理天气场景…' : '预判景点天气'}</button>
        {error && <p className="field-error" role="alert">{error}</p>}
        <p className="weather-demo-note">天气数值为模拟数据，用于体验预判流程；不代表实际天气预报。</p>
        <a href="#planner" className="weather-return-link">带着天气建议，调整路线 <ArrowUpRight size={15} aria-hidden="true" /></a>
      </form>

      <div className="weather-report" aria-busy={busy}>
        <div className="weather-result-status" role="status">{busy ? '正在生成模拟预判…' : changed ? '偏好已变更，下方为上次结果，请点击预判更新。' : updated ? '模拟预判已更新' : '为你准备的天气场景示例'}</div>
        <div className="weather-report-header"><div className="weather-place"><p><MapPin size={13} aria-hidden="true" /> {report.city}</p><h3>{report.sight}</h3><span>{selected.dateLabel} · {selected.weekday}</span></div><span className="weather-simulation-tag">模拟数据 · 非实时</span></div>
        <div className="weather-current"><div><div className="weather-temperature">{selected.high}<span>°C</span></div><p>{selected.condition}<span>{selected.low}° – {selected.high}°</span></p></div><div className={`weather-current-sky ${selected.code}`}><WeatherIcon code={selected.code} size={78} /><span>{report.suitability}</span></div></div>
        <div className="weather-metrics"><div><span><Droplets size={14} aria-hidden="true" /> 降雨概率</span><strong>{selected.rainChance}<small>%</small></strong></div><div><span><Wind size={14} aria-hidden="true" /> 风速</span><strong>{selected.wind}<small>km/h</small></strong></div><div><span><Sun size={14} aria-hidden="true" /> 紫外线指数</span><strong>{selected.uv}<small>{selected.uv >= 6 ? '偏强' : selected.uv >= 3 ? '中等' : '较弱'}</small></strong></div></div>
        <div className="weather-outlook-heading"><h4>七日天气趋势</h4><span>点击日期，切换出游建议</span></div>
        <div className="weather-week" role="group" aria-label="选择七日模拟天气日期">{report.outlook.map(day => <button type="button" key={day.date} aria-pressed={day.date === report.date} aria-label={`${day.dateLabel} ${day.weekday} ${day.condition}`} disabled={busy} onClick={() => chooseDay(day.date)}><span className="weather-weekday">{day.weekday}</span><small>{day.dateLabel}</small><WeatherIcon code={day.code} size={23} /><span>{day.high}° <small>{day.low}°</small></span><span className="weather-week-rain"><Droplets size={10} aria-hidden="true" /> {day.rainChance}%</span></button>)}</div>
        <div className="weather-hourly-heading"><h4>出游当天的分时示例</h4><span>温度 / 降雨概率</span></div>
        <div className="weather-hourly">{report.hourly.map(hour => <div key={hour.time}><span>{hour.time}</span><WeatherIcon code={hour.code} size={20} /><strong>{hour.temperature}°</strong><small>{hour.rainChance}%</small></div>)}</div>
        <div className="weather-advice"><div className="weather-advice-heading"><Umbrella size={18} aria-hidden="true" /><h4>给这次出发，多一份从容。</h4></div><p>{report.advice}</p><div className="weather-preparation"><div><Clock3 size={15} aria-hidden="true" /><span>游览节奏<strong>{report.visitWindow}</strong></span></div><div><Backpack size={15} aria-hidden="true" /><span>随身准备<strong>{report.packing}</strong></span></div></div><div className="weather-alternative"><Landmark size={17} aria-hidden="true" /><div><span>室内备选</span><strong>{report.alternative}</strong><p>{report.alternativeNote}</p></div></div></div>
        <p className="weather-report-note">以上天气均为模拟示例。实际出游前，请查看官方天气预报与景区通知。</p>
      </div>
    </div>
  </section>;
}
