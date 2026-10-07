import { Camera, Flame } from 'lucide-react';
import { HOTSPOTS_BY_CITY, HOTSPOTS_UPDATED } from '../hotspots';
import './HotspotSuggestions.css';

export default function HotspotSuggestions({ city, busy, onAsk }) {
  const items = HOTSPOTS_BY_CITY[city] || [];
  return <div className="hotspot-suggestions" role="group" aria-label={`${city}人气打卡快捷提问`}>
    <div className="hotspot-heading"><span><Flame size={13} aria-hidden="true" /> 人气打卡 <span className="hotspot-city">{city}</span></span><span className="hotspot-curated" title={`公开文旅资料精选 · ${HOTSPOTS_UPDATED} 更新`}>近期精选</span></div>
    <div className="hotspot-chips">{items.map(item => <button key={item.name} type="button" disabled={busy} onClick={() => onAsk(`${city}${item.name}怎么打卡拍照？`)} aria-label={`了解${item.label}的打卡拍照建议`}><Camera size={14} aria-hidden="true" /><span className="hotspot-name">{item.label}</span><span className="hotspot-tag">{item.tag}</span></button>)}</div>
  </div>;
}
