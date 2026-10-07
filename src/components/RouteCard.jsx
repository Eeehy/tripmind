import { useState } from 'react';
import { MapPin, Clock3, Lightbulb, Footprints, Check } from 'lucide-react';
import './RouteCard.css';

const dayLabels = ['初识这座城', '深入城市故事', '品味当地生活', '文化与慢时光', '亲近自然', '发现更多日常', '留白与返程'];

export default function RouteCard({ route, compact = false, onAsk }) {
  const [day, setDay] = useState(0);
  const activeDay = Math.min(day, route.days - 1);
  return <div className={`route-card ${compact ? 'compact' : ''}`}>
    <div className="route-card-heading"><div><span className="small-label"><MapPin size={13} /> {route.city} · {route.days} 日游</span><h3>{route.title}</h3></div><span className="sample-tag">示例行程</span></div>
    <div className="route-meta"><span>{route.interest}</span><span>预算 ¥{route.budget.toLocaleString()}</span><span><Footprints size={13} /> 轻松探索</span></div>
    <div className="day-tabs" role="tablist" aria-label="选择行程日期">{route.itinerary.map((_, i) => <button key={i} type="button" role="tab" aria-selected={activeDay === i} onClick={() => setDay(i)}>第 {i + 1} 天<span>{dayLabels[i]}</span></button>)}</div>
    <div className="route-timeline" role="tabpanel" aria-label={`第 ${activeDay + 1} 天行程`}>{route.itinerary[activeDay].map((item, i) => <div className="route-stop" key={`${item.time}-${item.name}`}><div className="stop-marker">{i + 1}</div><div className="stop-content"><span className="stop-time">{item.time}<span><Clock3 size={12} /> {item.duration}</span></span><h4>{item.name}</h4><p>{item.description}</p>{onAsk && <button type="button" className="inline-link" onClick={() => onAsk(`${item.name}有什么故事？`)}>了解景点</button>}</div></div>)}</div>
    <div className="route-tip"><Lightbulb size={16} /><p>{route.tip}</p></div>
    {!compact && <p className="budget-note"><Check size={14} /> {route.budgetAdvice}</p>}
  </div>;
}
