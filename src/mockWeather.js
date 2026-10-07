// Display-only weather scenarios. No forecast service or prediction model.
import { ATTRACTION_CITIES, ATTRACTIONS_BY_CITY } from './attractions.js';
const defaultSights = { 重庆: '洪崖洞', 成都: '武侯祠', 西安: '西安城墙', 杭州: '西湖苏堤' };
export const WEATHER_SIGHTS = Object.fromEntries(ATTRACTION_CITIES.map(city => [city,
  [defaultSights[city], ...ATTRACTIONS_BY_CITY[city].map(item => item.name).filter(name => name !== defaultSights[city])]
]));

const indoorAlternatives = { 重庆: '重庆中国三峡博物馆', 成都: '成都博物馆', 西安: '西安博物院', 杭州: '博物馆或室内文化空间' };
const scenarios = [
  { code: 'sunny', condition: '晴', rainChance: 10, uv: 6 },
  { code: 'cloudy', condition: '多云', rainChance: 25, uv: 3 },
  { code: 'rain', condition: '小雨', rainChance: 70, uv: 1 },
  { code: 'showers', condition: '阵雨', rainChance: 50, uv: 2 }
];

export function getWeatherDates(now = new Date()) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error('日期不可用，请重新选择。');
  return Array.from({ length: 7 }, (_, index) => {
    // Local noon avoids UTC date shifts and daylight-saving midnight boundaries.
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + index, 12);
    return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
  });
}

export function createMockWeather({ city = '重庆', sight = WEATHER_SIGHTS[city]?.[0], date } = {}, now = new Date()) {
  if (!Object.hasOwn(WEATHER_SIGHTS, city)) throw new Error('请选择支持的城市：重庆、成都、西安或杭州。');
  if (!WEATHER_SIGHTS[city].includes(sight)) throw new Error('请选择当前城市中的景点。');
  const dates = getWeatherDates(now);
  const selectedDate = date ?? dates[1];
  if (!dates.includes(selectedDate)) throw new Error('请选择今天起 7 天内的出游日期。');
  const seed = Array.from(`${city}${sight}`).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const outlook = dates.map(key => {
    const [year, month, day] = key.split('-').map(Number);
    const ordinal = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
    const variant = seed + ordinal;
    const scenario = scenarios[((variant % 4) + 4) % 4];
    const low = 15 + variant % 5;
    const high = low + 5 + variant % 3;
    return {
      date: key, dateLabel: `${month}月${day}日`,
      weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date(year, month - 1, day, 12).getDay()],
      ...scenario, low, high, rainChance: scenario.rainChance + variant % 6,
      wind: 7 + variant % 12
    };
  });
  const selected = outlook.find(day => day.date === selectedDate);
  const rainy = selected.rainChance >= 60;
  const showery = selected.rainChance >= 40;
  const hourly = [8, 12, 16, 20].map((hour, index) => ({
    time: `${hour}:00`, temperature: [selected.low + 2, selected.high, selected.high - 1, selected.low + 1][index],
    code: selected.code, condition: selected.condition,
    rainChance: Math.max(0, Math.min(100, selected.rainChance + [-5, 5, 0, -10][index]))
  }));
  return {
    city, sight, date: selectedDate, simulated: true, outlook, selected, hourly,
    suitability: rainy ? '预留室内备选' : showery ? '留意阵雨时段' : '适合户外慢游',
    visitWindow: rainy ? '弹性安排，以室内为主' : showery ? '上午游览，午后留白' : '上午或傍晚，从容出发',
    packing: showery ? '雨伞、防滑鞋，随身轻便外套' : '舒适步行鞋、遮阳用品与饮水',
    advice: rainy ? `这个模拟场景中降雨可能较高，可缩短${sight}的户外停留，预留室内参观和交通时间。` : showery ? `这个模拟场景可能出现阵雨，可把${sight}的步行时段安排得灵活一些，途中保留休息空间。` : `这个模拟场景适合在${sight}慢游，强光时段留出遮阴和休息时间，不必把行程排得过满。`,
    alternative: indoorAlternatives[city],
    alternativeNote: '可作为室内备选方向，出发前另行确认开放与预约。'
  };
}
