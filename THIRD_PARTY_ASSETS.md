# InfiniteSpiral 与风景图片来源

## 组件

React Bits，InfiniteSpiral（JS-CSS）。通过官方 registry 安装，InfiniteSpiral.jsx 已增加离屏暂停、按需绘制及图片延迟加载；CSS 保留原始内容。

- 文档：https://reactbits.dev/components/infinite-spiral
- registry：https://reactbits.dev/r/InfiniteSpiral-JS-CSS.json
- 项目：https://github.com/DavidHDev/react-bits

Beams（JS-CSS）也来自同一项目的官方 registry，Beams.jsx 与 Beams.css 保留原始内容。额外运行依赖为 Three.js、React Three Fiber 和 Drei。

- 文档：https://reactbits.dev/backgrounds/beams
- registry：https://reactbits.dev/r/Beams-JS-CSS.json

Galaxy（JS-CSS）为当前头图下方背景，同样通过 React Bits 官方 registry 安装，Galaxy.jsx 已增加稳定参数、降采样、帧率限制及可见性控制；CSS 保留原始内容。运行依赖为 OGL。

- 文档：https://reactbits.dev/backgrounds/galaxy
- registry：https://reactbits.dev/r/Galaxy-JS-CSS.json

ParticleText（JS-CSS）用于首屏中文标题，通过官方 registry 安装，ParticleText.jsx 已增加帧率限制与页面隐藏暂停；CSS 保留原始内容，没有额外运行依赖。

- 文档：https://reactbits.dev/text-animations/particle-text
- registry：https://reactbits.dev/r/ParticleText-JS-CSS.json

SpecularButton（JS-CSS）用于首屏「开始我的旅程」，源码来自官方 registry，SpecularButton.jsx 已增加按需绘制、隐藏页面暂停及 DPR 上限；CSS 保留原始内容。运行依赖 OGL 沿用 Galaxy 已安装版本。

- 文档：https://reactbits.dev/components/specular-button
- registry：https://reactbits.dev/r/SpecularButton-JS-CSS.json

## 本地风景示例

六张图片来自 Unsplash 图片 CDN，保存为 480×480 JPEG，仅作为旅行灵感展示，不标称为行程中的具体景点。Unsplash 许可：https://unsplash.com/license 。以下记录下载来源；项目未声称拥有图片版权。

| 本地文件 | 展示说明 | 来源 |
| --- | --- | --- |
| public/images/landscape-1.jpg | Mountain lake | https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=480&h=480&q=85&fm=jpg |
| public/images/landscape-2.jpg | Forest path | https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=480&h=480&q=85&fm=jpg |
| public/images/landscape-3.jpg | Rocky summit | https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=480&h=480&q=85&fm=jpg |
| public/images/landscape-4.jpg | Ocean shore | https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=480&h=480&q=85&fm=jpg |
| public/images/landscape-5.jpg | Green meadow | https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=480&h=480&q=85&fm=jpg |
| public/images/landscape-6.jpg | Desert light | https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=480&h=480&q=85&fm=jpg |

原始 JPEG 保留，当前网页展示同名 240×240 WebP 衍生图（quality 80），原图片来源与许可不变。这些文件已包含在项目中，运行 Demo 无需访问图片服务。原有重庆夜景和视频来源见 README。

## 性能维护版本说明

本次按项目负责人要求优化上述四个组件，不再声称 JSX 与 registry 逐字一致。保留官方来源链接；原始 JSX 备份在工作区 work/qa/performance-originals/。本地修改说明及测试结果见 PERFORMANCE_REPORT.md。


## 景点讲解资料（2026-10-07 扩充）

新增 24 处景点并统一既有资料，共 54 处。简介与故事为自行编写的简短 Demo 讲解，未转载长文、下载图片或填写实时门票/开放时间；时长为展示估计。具体来源链接集中维护于 `src/attractions.js` 的 `sources`，有对应资料的讲解卡显示「景点资料来源」。以下为扩充时查阅的官方资料示例：

- 重庆：[湖广会馆](https://dfz.cq.gov.cn/zqlswh/fjms_417821/202311/t20231102_12510896.html)、[弹子石老街](https://whlyw.cq.gov.cn/zjwl/yzq/cqwlzy/zqlswhmjmz/202203/t20220304_10463228.html)、[重庆动物园](https://cgj.cq.gov.cn/cgyw/zqgy/sssdgyjs/elgy/202506/t20250617_14719846.html)。
- 成都：[熊猫基地](https://www.panda.org.cn/cn/about/)、[四川博物院展览](https://www.scmuseum.cn/sccms/node/115?subnode=291)、[望江楼公园](https://www.wangjianglou.com/)。
- 西安：[秦始皇帝陵博物院](https://www.bmy.com.cn/index.htm)、[华清宫](https://www.hqc.cn/about/)、[大明宫遗址公园](https://qjxq.xa.gov.cn/zjqj/gyqj/tsqj/5df21c62fd8508098d284f14.html)。
- 杭州：[雷峰塔](https://wgly.hangzhou.gov.cn/art/2022/12/1/art_1229696389_58943150.html)、[西溪湿地](https://cxkc.hangzhou.gov.cn/art/2019/11/8/art_1228936433_39935506.html)、[茶文化展示](https://wgly.hangzhou.gov.cn/art/2023/12/8/art_1229734049_58951428.html)、[运河城市漫步](https://wgly.hangzhou.gov.cn/cw/cn/index.html)。

未提供来源链接的条目仅保留通用游览与文化观察描述，不宣称逐条历史考证；演示素材仍需在真实出游前核实。天气仍是模拟场景，资料扩充不引入真实图像识别或预测接口。


## 聊天区人气打卡精选（2026-10-08）

在原有景点库选择每城 3 处，共 12 处，不增加图片或景点总量。`src/hotspots.js` 为人工精选与自行编写的拍照建议；并非平台实时榜单，无热度分数、实时人流或可靠机位保证。每项保存推荐依据 source，数据日期 HOTSPOTS_UPDATED，界面称「近期精选」。

- 重庆：李子坝、洪崖洞、磁器口。依据[2026-04-27 重庆市政府热门景点服务报道](https://wap.cq.gov.cn/ywdt/bmts/202604/t20260427_15639493.html)，交叉查看[渝中热门打卡目录](https://www.cqyz.gov.cn/zjyz/lyyz/rmdkd/)。
- 成都：东郊记忆、春熙路、熊猫基地。依据[2026-10-04 人民网国庆商业地标人气报道](https://sc.people.com.cn/n2/2026/1004/c345167-41714136.html)、[2026-09-16 熊猫基地官方假期公告](https://m.panda.org.cn/cn/news/notice/2026-09-16/8890.html)。
- 西安：大唐不夜城、钟楼、鼓楼。依据[2026-09 曲江新区不夜城报道](https://qjxq.xa.gov.cn/xwzx/xwdt/2090369656621707266.html)、[2026 五一西安市政府文旅市场报道](https://www.xa.gov.cn/xw/zwzx/msyw/2052218564023271425.html)。同时查阅[钟鼓楼2026-09-30开放调整公告](https://wwj.xa.gov.cn/xwzx/tzgg/2105187558014095361.html)，拍摄建议以公共区域外观为主，不承诺回廊/展厅可进入。
- 杭州：西湖（落到既有苏堤景点）、雷峰塔、西溪湿地。依据[2026-10-03 杭州网假期景区客流报道](https://hznews.hangzhou.com.cn/chengshi/content/2026-10/03/content_9327652.htm)、[2026-09-30 新华网西湖区假期活动报道](https://app.xinhuanet.com/news/article.html?articleId=20260930d73e41d07ce4499e87513235a4d430da)。西湖苏堤为湖畔漫步精选，未宣称来源报告提供苏堤单点排名。

上述报道只用于判断选点相关性，未沿用其中人流数字、价格或演出时间；后续需手动重新核对推荐日期。
