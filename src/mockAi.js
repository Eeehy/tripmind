// All responses are local examples. No model, geolocation, or image API is called.
import { WEATHER_SIGHTS, getWeatherDates, createMockWeather } from './mockWeather.js';
import { ATTRACTION_CITIES, ATTRACTIONS_BY_CITY, findAttractions } from './attractions.js';
import { HOTSPOTS_BY_CITY } from './hotspots.js';
export const CITIES = ATTRACTION_CITIES;
export const INTERESTS = ['历史文化', '城市漫步', '美食探索', '自然风光'];
export const TRAVEL_DAYS = [1, 2, 3, 4, 5, 6, 7];
const stop = (time, name, description, duration) => ({ time, name, description, duration });
const catalog = {
  重庆: {
    title: '山城慢游，走进重庆的故事',
    historical: [
      [stop('09:00', '磁器口古镇', '沿老街感受山城民居与码头文化，早一点出发更适合慢慢逛。', '2 小时'), stop('13:00', '白公馆', '了解近现代历史，参观前确认预约安排与开放时间。', '1.5 小时'), stop('16:00', '鹅岭二厂', '在老厂房与创意空间之间漫步，感受城市的另一面。', '2 小时')],
      [stop('09:30', '重庆中国三峡博物馆', '从巴渝文化与三峡主题展览开始，读懂这座城市。', '2 小时'), stop('14:00', '山城步道', '沿阶梯街巷步行，寻找山城生活的日常片段。', '2 小时'), stop('18:30', '洪崖洞', '从江边欣赏吊脚楼建筑群与夜景，错峰拍照更从容。', '1.5 小时')]
    ],
    city: [
      [stop('09:30', '山城步道', '穿行坡道和老街，慢慢发现山城的空间层次。', '2 小时'), stop('14:00', '鹅岭二厂', '逛创意商店，在旧厂房里找一处咖啡空间休息。', '2 小时'), stop('18:30', '洪崖洞', '以江岸夜景作为第一天的收尾。', '1.5 小时')],
      [stop('09:00', '磁器口古镇', '上午逛老街，避开下午较拥挤的时段。', '2 小时'), stop('14:00', '重庆中国三峡博物馆', '留一段室内时间，感受巴渝文化。', '2 小时'), stop('17:00', '南滨路', '沿江散步，欣赏对岸的城市天际线。', '2 小时')]
    ],
    food: '可在磁器口尝试陈麻花，正餐选择小面或火锅；口味与辣度可提前沟通。',
    nature: '偏好自然风光时，优先安排鹅岭公园与南滨路，保留休息时间。',
    tip: '重庆坡道较多，建议穿舒适的鞋；博物馆与历史场馆需提前核实预约，跨区移动预留时间。'
  },
  成都: {
    title: '在成都，把节奏慢下来',
    historical: [[stop('09:00', '武侯祠', '从三国文化与历史人物的故事开始城市之旅。', '2 小时'), stop('13:00', '锦里', '沿街漫步，感受传统街区的市井气息。', '1.5 小时'), stop('16:00', '人民公园', '体验茶馆文化，留一点时间观察当地生活。', '2 小时')], [stop('09:30', '杜甫草堂', '在诗歌与园林之间，了解杜甫在成都的生活。', '2 小时'), stop('14:00', '成都博物馆', '通过展览了解城市历史与文化。', '2 小时'), stop('17:00', '宽窄巷子', '在传统院落与当代商店之间散步。', '1.5 小时')]],
    city: [[stop('09:30', '人民公园', '从一杯盖碗茶开始，体验悠闲的成都日常。', '2 小时'), stop('13:00', '宽窄巷子', '沿街找小店，给午餐留足时间。', '2 小时'), stop('17:00', '春熙路', '步行探索城市商业街与公共空间。', '2 小时')], [stop('09:30', '杜甫草堂', '在绿荫与园林中漫步。', '2 小时'), stop('14:00', '成都博物馆', '用半天了解城市故事。', '2 小时'), stop('17:00', '锦里', '夜幕前在传统街区停留。', '1.5 小时')]],
    food: '可以体验担担面、钟水饺和川菜；品尝火锅前说明自己的辣度偏好。', nature: '喜欢自然风光时，可将人民公园和杜甫草堂作为慢游重点。', tip: '步行结合公共交通更适合中心城区；场馆开放与预约信息请在出发前确认。'
  },
  西安: {
    title: '循着古都的时间，遇见西安',
    historical: [[stop('09:00', '西安城墙', '沿城墙步行，观察古都的城市格局。', '2 小时'), stop('13:00', '西安博物院', '从文物与展览了解城市的历史。', '2 小时'), stop('18:00', '大雁塔周边', '在夜色中感受古迹与城市公共空间。', '2 小时')], [stop('09:00', '陕西历史博物馆', '预约成功后前往，留足参观时间。', '3 小时'), stop('14:00', '书院门', '感受书画与传统文化街区。', '1.5 小时'), stop('18:00', '大唐不夜城', '步行欣赏夜间街景，注意错峰。', '2 小时')]],
    city: [[stop('09:30', '西安城墙', '步行欣赏城市景观，注意补水与防晒。', '2 小时'), stop('14:00', '书院门', '漫步街巷，看看书画与文创小店。', '2 小时'), stop('18:00', '大唐不夜城', '预留充裕时间逛夜间步行街。', '2 小时')], [stop('09:30', '西安博物院', '在室内展览与园林之间慢游。', '2 小时'), stop('14:00', '大雁塔周边', '感受历史建筑与城市生活。', '2 小时'), stop('17:00', '永兴坊', '品尝当地小吃。', '1.5 小时')]],
    food: '可以尝试肉夹馍、凉皮与羊肉泡馍；按自己的口味和食量选择。', nature: '优先保留西安博物院园林及大雁塔周边的户外散步时间。', tip: '陕西历史博物馆等热门场馆需提前预约；未预约成功时可改为城市街区漫步。'
  },
  杭州: {
    title: '在湖山之间，读一读杭州',
    historical: [[stop('09:00', '西湖苏堤', '沿堤慢行，感受湖景与园林空间。', '2 小时'), stop('13:00', '浙江省博物馆孤山馆区', '出发前核实馆区开放情况，了解浙江文化。', '2 小时'), stop('17:00', '河坊街', '沿传统街区散步，体验城市生活。', '1.5 小时')], [stop('09:00', '灵隐景区', '欣赏山林与历史建筑，提前核实预约与门票。', '3 小时'), stop('14:00', '龙井村', '感受茶园与茶文化，适合慢游。', '2 小时'), stop('17:00', '钱塘江沿岸', '以江边散步结束行程。', '1.5 小时')]],
    city: [[stop('09:00', '西湖苏堤', '沿湖步行，给拍照和休息留足时间。', '2 小时'), stop('13:00', '南山路', '探索街边小店与咖啡空间。', '2 小时'), stop('17:00', '河坊街', '在街区里吃晚餐，感受杭州日常。', '2 小时')], [stop('09:00', '龙井村', '在茶园周边散步，注意天气变化。', '2 小时'), stop('14:00', '西湖曲院风荷', '欣赏园林与湖景。', '2 小时'), stop('17:00', '钱塘江沿岸', '沿江慢行，欣赏城市景观。', '1.5 小时')]],
    food: '可以尝试杭帮菜与片儿川；茶村休息时可了解当地茶文化。', nature: '以西湖、龙井村和钱塘江沿岸为重点，保留弹性停留时间。', tip: '湖边步行距离较长，建议根据天气与体力调整；场馆、景区信息需提前核实。'
  }
};

// Curated longer examples; no live reservations or map-based optimization.
function extendedDays(data, city) {
  const groups = {
    重庆: [['李子坝观景平台', '鹅岭公园', '鹅岭二厂'], ['湖广会馆', '朝天门', '十八梯'], ['重庆动物园', '午餐与休息', '住处周边慢游'], ['弹子石老街', '南滨路', '江岸晚餐与休息']],
    成都: [['文殊院', '街区午餐与休息', '东郊记忆'], ['四川博物院', '浣花溪公园', '杜甫草堂'], ['成都大熊猫繁育研究基地', '午餐与休息', '住处周边慢游'], ['望江楼公园', '锦江沿岸慢游', '春熙路']],
    西安: [['西安钟楼', '西安鼓楼', '永兴坊'], ['秦始皇帝陵博物院', '华清宫', '临潼休息与返城'], ['大明宫国家遗址公园', '午餐与休息', '住处周边慢游'], ['青龙寺', '大雁塔周边', '书院门']],
    杭州: [['雷峰塔', '南山路', '河坊街'], ['岳王庙', '西湖曲院风荷', '拱宸桥'], ['西溪湿地', '午餐与休息', '住处周边慢游'], ['九溪烟树', '中国茶叶博物馆', '龙井村']]
  };
  const times = ['09:00', '14:00', '17:00'];
  const result = groups[city].map(names => names.map((name, i) => {
    const sight = ATTRACTIONS_BY_CITY[city].find(item => item.name === name);
    return stop(times[i], name, sight ? `${sight.intro} ${sight.play}` : /午餐|晚餐/.test(name) ? `${data.food} 留足休息时间，再继续慢游。` : '预留弹性时间，按体力与返程交通调整，不必赶路。', sight?.duration || '弹性安排');
  }));
  result.push([stop('09:30', '返程前的城市早餐', '轻松用餐、整理行李，按退房与返程时间调整安排。', '1 小时'), stop('11:00', '伴手礼与旅途回顾', '按预算选择伴手礼，或在住处附近回顾这趟旅程。', '1 小时'), stop('14:00', '自由活动与返程留白', '为前往车站或机场留出充裕时间。', '弹性安排')]);
  return result;
}

export function createRoute({ city = '重庆', days = 2, interest = '历史文化', budget = 800 } = {}) {
  if (!CITIES.includes(city)) throw new Error('当前示例支持重庆、成都、西安和杭州，请选择其中一个城市。');
  const tripLength = Number(days);
  if (!TRAVEL_DAYS.includes(tripLength)) throw new Error('当前示例支持 1–7 日行程，请选择整数天数。');
  if (!INTERESTS.includes(interest)) throw new Error('请选择一个支持的兴趣。');
  const totalBudget = Number(budget);
  if (!Number.isFinite(totalBudget) || totalBudget < 100 || totalBudget > 20000) throw new Error('请输入 100–20000 元之间的行程预算。');
  const data = catalog[city];
  let routeDays = structuredClone([
    ...(interest === '历史文化' ? data.historical : data.city),
    ...extendedDays(data, city)
  ].slice(0, tripLength));
  if (interest === '美食探索') routeDays.forEach(day => { day[1].description += ' ' + data.food; });
  if (interest === '自然风光') {
    const naturalStops = { 重庆: [['鹅岭公园', '在山顶公园慢行，欣赏山城景观。'], ['南滨路', '沿江步行，欣赏城市与江岸风光。']], 成都: [['人民公园', '在园林与茶馆间慢游。'], ['杜甫草堂', '欣赏园林绿荫与诗歌文化。']], 西安: [['西安博物院', '在园林与历史建筑之间漫步。'], ['大雁塔周边', '在开放空间里慢行与休息。']], 杭州: [['西湖苏堤', '湖边慢行，感受西湖风光。'], ['龙井村', '茶园周边散步，感受茶乡。']] };
    routeDays.slice(0, 2).forEach((day, i) => { day[0] = stop('09:30', ...naturalStops[city][i], '2 小时'); });
  }
  if (totalBudget / Number(days) < 200) routeDays.forEach((day, index) => {
    // A city-center fallback must replace the whole excursion, not one stop in it.
    if (city === '西安' && index === 3) {
      routeDays[index] = [stop('09:30', '西安钟楼', '从公共区域欣赏钟楼外观，以街区步行为主。', '1 小时'), stop('13:00', '书院门', '沿开放式文化街区漫步，餐饮按预算安排。', '2 小时'), stop('17:00', '大唐不夜城', '以公共街区漫步为主，不安排额外消费。', '2 小时')];
      return;
    }
    const free = { 重庆: ['山城步道', '沿街步行，优先开放式公共空间。'], 成都: ['人民公园', '选择公园慢游，餐饮与茶馆按预算决定。'], 西安: ['书院门', '用开放式街区漫步替代需购票景点。'], 杭州: ['西湖苏堤', '沿湖步行，优先免费开放空间。'] };
    day[1] = stop('13:00', ...free[city], '2 小时');
  });
  const freeAlternatives = {
    重庆: [stop('13:00', '鹅岭公园', '在公园散步，欣赏山城景观，按体力安排停留。', '2 小时'), stop('13:00', '南滨路', '沿江步行，给拍照和休息留足时间。', '2 小时'), stop('13:00', '山城步道', '沿坡道与街巷漫步，发现山城日常。', '2 小时')],
    成都: [stop('13:00', '人民公园', '在绿荫与公共空间中慢游。', '2 小时'), stop('13:00', '宽窄巷子', '街区步行，不安排额外购物。', '2 小时'), stop('13:00', '锦里', '感受传统街区，餐饮按预算安排。', '2 小时')],
    西安: [stop('13:00', '书院门', '在开放式文化街区漫步。', '2 小时'), stop('13:00', '大雁塔周边', '在城市开放空间散步和休息。', '2 小时'), stop('13:00', '大唐不夜城', '以街区漫步为主，不安排额外消费。', '2 小时')],
    杭州: [stop('13:00', '西湖苏堤', '在湖边慢行，欣赏湖山风光。', '2 小时'), stop('13:00', '钱塘江沿岸', '在江边步行，欣赏城市景观。', '2 小时'), stop('13:00', '河坊街', '沿传统街区散步，按预算安排消费。', '2 小时')]
  };
  routeDays = routeDays.map(day => {
    const seen = new Set();
    return day.map(item => {
      if (seen.has(item.name)) {
        const replacement = freeAlternatives[city].find(candidate => !seen.has(candidate.name) && !day.some(original => original.name === candidate.name));
        if (replacement) item = { ...replacement, time: item.time };
      }
      seen.add(item.name);
      return item;
    });
  });
  return { city, days: Number(days), interest, budget: totalBudget, title: data.title, itinerary: routeDays, tip: data.tip, food: data.food, budgetAdvice: totalBudget / Number(days) < 200 ? '预算较紧，优先公共交通、街区漫步和简餐；未计住宿与往返交通，门票请单独核实。' : '按设定预算预留市内交通、餐饮与门票空间；不含住宿及往返交通，具体花费以实际为准。' };
}

export const INITIAL_ROUTE = createRoute();
export const LANDMARK = ATTRACTIONS_BY_CITY['重庆'].find(item => item.name === '洪崖洞');

export async function mockReply(text, context = INITIAL_ROUTE) {
  await new Promise(resolve => setTimeout(resolve, 900));
  const requestedDuration = text.match(/(\d+|[一二两三四五六七八九十]+)\s*(?:天|日)/)?.[1] ?? (/一周|一个星期/.test(text) ? '7' : undefined);
  const chineseDays = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7 };
  const requestedDays = requestedDuration === undefined ? undefined : /^\d+$/.test(requestedDuration) ? Number(requestedDuration) : chineseDays[requestedDuration];
  if (requestedDuration !== undefined && !TRAVEL_DAYS.includes(requestedDays)) return { text: '目前的演示支持 1–7 日行程。你可以试试“重庆七天，喜欢历史文化”。' };
  const explicitCity = CITIES.find(name => text.includes(name));
  const namedPlaces = findAttractions(text, explicitCity || context.city);
  const namedPlace = namedPlaces[0];
  const commonUnsupported = ['北京', '上海', '广州', '深圳', '南京', '苏州', '长沙', '武汉', '青岛', '厦门', '三亚', '大理', '丽江', '昆明', '天津', '洛阳', '郑州', '哈尔滨', '拉萨', '香港', '澳门', '巴黎', '伦敦', '东京', '大阪', '纽约', '首尔'];
  const candidate = text.replace(/^(?:(?:我想|想要|我计划|计划|请帮我|帮我|想|去|到|在)\s*)+/, '').match(/^([\u4e00-\u9fa5]{2,8}?)(?=\s*(?:[一二两三四五六七八九十\d]+\s*(?:天|日)|旅游|旅行|有什么|的景点|行程|路线))/)?.[1];
  const knownPlace = candidate && namedPlaces.length > 0;
  const unknown = commonUnsupported.some(name => text.includes(name)) || (!explicitCity && candidate && !knownPlace && !/推荐|规划|安排|设计|生成|预算|历史|文化|自然|美食|景点|喜欢|天气|交通|时间|门票/.test(candidate));
  if (unknown) return { text: '这个目的地还未收录到演示资料中。目前可以体验重庆、成都、西安和杭州的示例行程。' };
  const city = explicitCity || namedPlace?.city || context.city;
  const conflictingPlace = namedPlaces.find(item => item.city !== city);
  if (conflictingPlace) return { text: `${conflictingPlace.name}位于${conflictingPlace.city}，与所选${city}不一致。演示版支持单城行程，请使用景点所在城市查询讲解、路线或模拟天气。` };
  if (/天气|下雨|降雨|气温|雨天|晴天|带伞/.test(text)) {
    const dates = getWeatherDates();
    const date = text.match(/\d{4}-\d{2}-\d{2}/)?.[0] || dates[/后天/.test(text) ? 2 : /明天/.test(text) ? 1 : 0];
    try {
      const weather = createMockWeather({ city, sight: namedPlace?.name || WEATHER_SIGHTS[city][0], date });
      const day = weather.selected;
      return { text: `模拟天气预判 · ${weather.city} ${weather.sight} · ${day.dateLabel}\n\n${day.condition}，${day.low}–${day.high}°C，模拟降雨概率 ${day.rainChance}%。\n${weather.advice}\n室内备选：${weather.alternative}。${weather.alternativeNote}\n\n这是本地模拟数据，不代表实际天气预报。可在“景点天气预判”中查看七日趋势与分时示例。` };
    } catch (issue) { return { text: issue.message }; }
  }
  if (namedPlace && requestedDays === undefined && !/路线|安排|行程|交通|地铁|怎么去/.test(text)) {
    const hotspot = HOTSPOTS_BY_CITY[city]?.find(item => item.name === namedPlace.name);
    if (hotspot && /打卡|拍照|出片|机位/.test(text)) return { text: `${city} · ${namedPlace.name}\n${hotspot.tag}\n\n${namedPlace.intro}\n\n打卡建议：${hotspot.tip}\n\n建议预留${namedPlace.duration}（示例时长）。这是本地精选讲解，热度与现场安排可能变化。` };
    return { text: `${namedPlace.city} · ${namedPlace.name}\n${namedPlace.category}\n\n${namedPlace.intro}\n\n${/历史|故事|由来/.test(text) ? namedPlace.story : namedPlace.play}\n\n建议预留${namedPlace.duration}（示例时长）。开放与预约信息请以目的地最新公告为准。` };
  }
  if (/哪些景点|有什么景点|推荐景点|景点推荐|景点有哪些|景点列表|景点库|博物馆/.test(text) && requestedDays === undefined && !/路线|行程/.test(text)) {
    const sights = ATTRACTIONS_BY_CITY[city].filter(item => !/博物馆/.test(text) || /博物馆/.test(item.category));
    return { text: `${city}已收录 ${sights.length} 处${/博物馆/.test(text) ? '博物馆' : '景点'}：\n\n${sights.map(item => `${item.name} · ${item.category}`).join('\n')}\n\n可以直接问“${sights[0].name}有什么故事？”，或选择景点体验模拟天气。` };
  }
  if (/吃|美食|火锅|小面/.test(text) && !/路线|行程|天/.test(text)) return { text: `${city}美食建议：${catalog[city].food}\n\n用餐费用按你的行程预算安排，实际价格请在店内确认。` };
  if (/预算|花费|多少钱/.test(text) && !/路线|行程|天|\d/.test(text)) return { text: `当前${context.days}日行程的预算设定为 ¥${context.budget}。${context.budgetAdvice}\n\n可在“路线规划”里调整预算，查看不同的示例安排。` };
  if (/交通|地铁|怎么去/.test(text)) return { text: '建议步行结合公共交通，跨区移动预留 30–60 分钟的弹性时间。演示版没有实时地图，具体站点、换乘与交通时间请在出发前查询。' };
  if (requestedDays !== undefined || /旅游|旅行|路线|行程|安排|自然|历史|文化|漫步|美食/.test(text)) {
    const days = requestedDays ?? context.days;
    const interest = /历史|文化/.test(text) ? '历史文化' : /美食|吃/.test(text) ? '美食探索' : /自然|风光/.test(text) ? '自然风光' : /漫步|轻松|慢/.test(text) ? '城市漫步' : context.interest;
    const budget = Number(text.match(/(?:预算|¥|￥)\s*(\d+)/)?.[1] || context.budget);
    try {
      const route = createRoute({ city, days, interest, budget });
      if (namedPlace && !route.itinerary.flat().some(item => item.name === namedPlace.name)) {
        if (city === '西安' && ['秦始皇帝陵博物院', '华清宫'].includes(namedPlace.name)) {
          // Both sights are in 临潼: replace a whole day instead of mixing city stops.
          route.itinerary[0] = extendedDays(catalog[city], city)[1];
          route.tip += ' 本次包含临潼游览，请为往返交通留足时间，门票与预算另行核实。';
        } else {
          route.itinerary[0][0] = stop('09:00', namedPlace.name, `${namedPlace.intro} ${namedPlace.play}`, namedPlace.duration);
        }
      }
      const additional = namedPlaces.slice(1).filter(item => !route.itinerary.flat().some(stop => stop.name === item.name));
      return { text: `为你准备了一份${city}${days}日${interest}行程。每天安排 3 个停留点，给用餐、交通和临时发现留出空间。${additional.length ? `\n\n本次示例尚未包含：${additional.map(item => item.name).join('、')}。可分别查询讲解，或缩小到一个重点景点重新规划。` : ''}`, route };
    } catch (error) { return { text: error.message }; }
  }
  return { text: '我是途知，可以演示旅游行程规划、景点问答和美食建议。目前支持重庆、成都、西安、杭州的本地示例。试着说“重庆两天旅游，喜欢历史文化”，或问我“洪崖洞有什么故事？”' };
}
