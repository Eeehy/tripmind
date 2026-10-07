// Editorial picks checked 2026-10-08, not a live popularity ranking.
const cqSource = 'https://wap.cq.gov.cn/ywdt/bmts/202604/t20260427_15639493.html';
const cdSource = 'https://sc.people.com.cn/n2/2026/1004/c345167-41714136.html';
const xaSource = 'https://www.xa.gov.cn/xw/zwzx/msyw/2052218564023271425.html';
const hzSource = 'https://hznews.hangzhou.com.cn/chengshi/content/2026-10/03/content_9327652.htm';
export const HOTSPOTS_UPDATED = '2026-10-08';
export const HOTSPOTS_BY_CITY = {
  重庆: [
    { name: '李子坝观景平台', label: '李子坝', tag: '轻轨穿楼', source: cqSource, tip: '在指定观景平台找列车与楼体同框的视角，等列车经过再拍。不要站到车道上；拍完给后方游客让出空间。' },
    { name: '洪崖洞', label: '洪崖洞', tag: '江岸夜景', source: cqSource, tip: '先在江岸公共区域观察建筑全景，傍晚与入夜各拍一组，比较天空和灯光的变化。人多时避免在通道中央架三脚架，亮灯与通行情况以现场为准。' },
    { name: '磁器口古镇', label: '磁器口', tag: '老街烟火', source: cqSource, tip: '沿允许通行的老街寻找门面、石阶与街巷的层次，早些出发更适合从容逛。拍摄商户和路人前征得同意，不堵塞入口。' }
  ],
  成都: [
    { name: '东郊记忆', label: '东郊记忆', tag: '工业文创', source: cdSource, tip: '用老厂房、管道与园区创意空间做背景，尝试人物和建筑比例的对照。活动与装置会更换，先看现场导览；不要进入封闭厂房或攀爬工业设施。' },
    { name: '春熙路', label: '春熙路', tag: '城市街拍', source: cdSource, tip: '沿商业街公共空间观察建筑线条、街景与人流，给街拍留一段自由时间。拍摄装置先看现场规定，不在车道、扶梯口或商铺入口停留。' },
    { name: '成都大熊猫繁育研究基地', label: '熊猫基地', tag: '自然观察', source: 'https://m.panda.org.cn/cn/news/notice/2026-09-16/8890.html', tip: '先核实实名预约和入园安排，给游览留出半天。用长焦在允许区域安静观察，能否看见活跃的熊猫取决于现场状态；不闪光、不投喂、不拍打护栏。' }
  ],
  西安: [
    { name: '大唐不夜城', label: '大唐不夜城', tag: '唐风夜游', source: 'https://qjxq.xa.gov.cn/xwzx/xwdt/2090369656621707266.html', tip: '入夜后沿步行街寻找灯光与建筑同框的视角，留出停步与休息时间。表演与活动场次先核实，拍照不要占用表演区或通道。' },
    { name: '西安钟楼', label: '钟楼', tag: '古都街景', source: xaSource, tip: '在允许停留的公共区域拍建筑全景，对比白天与夜间的城市光线。拍外观无需假设能登楼，楼内展厅与回廊开放需另行核实；不要站到行车道取景。' },
    { name: '西安鼓楼', label: '鼓楼', tag: '建筑光影', source: xaSource, tip: '结合广场与建筑轮廓寻找视角，按自己的体力与钟楼周边慢游搭配。参观与表演信息先查最新公告，人多时给过路行人留空间。' }
  ],
  杭州: [
    { name: '西湖苏堤', label: '西湖', tag: '湖畔出片', source: hzSource, tip: '沿苏堤公共步道寻找湖面、桥梁与树影的组合，不必挤在同一个机位。晴天和阴天光线各有变化，按天气调整；不要翻越护栏或进入封闭区域。' },
    { name: '雷峰塔', label: '雷峰塔', tag: '湖山同框', source: hzSource, tip: '先从湖畔允许通行的公共区域观察塔与水面的关系，再决定是否入内观景。遗址参观、登塔与购票安排需提前核实；给周边步行和休息留足时间。' },
    { name: '西溪湿地', label: '西溪湿地', tag: '水乡慢游', source: 'https://app.xinhuanet.com/news/article.html?articleId=20260930d73e41d07ce4499e87513235a4d430da', tip: '沿开放步道找水道、绿荫与村落的层次，适合留半天慢游。乘船与季节活动以现场安排为准，不踩入植被或涉水；雨天留意湿滑。' }
  ]
};
