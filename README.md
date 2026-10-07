# 途知 TripMind · AI 文旅智能导览 Demo

校园 AI 创新创业项目的第一阶段 MVP。基于 React + Vite，实现一个可交互、可预览的暗色产品 Demo。

## 本地运行

需要 Node.js 20.19+ 或 22.12+。在本目录打开终端：

```powershell
npm install
npm run dev
```

浏览器打开 http://127.0.0.1:5173/ 。开发服务默认仅绑定本机；端口被占用时会提示错误，不会切换到其他端口。

构建与预览：

```powershell
npm run build
npm run preview
```

构建预览地址为 http://127.0.0.1:4173/ 。`dist` 需要通过 HTTP 服务访问，不能直接双击 HTML 文件运行。

## 已实现

- 首页 Hero、产品定位、体验入口、产品功能与页尾联系区域。
- 首屏中文标题：React Bits ParticleText，白紫色发光粒子、初始聚合及悬停重新聚合、指针排斥；保留两行中文与 h1 语义，减少动画或不支持 Canvas 时显示静态标题，离开视口后卸载粒子组件。
- 首屏「开始我的旅程」：React Bits SpecularButton，透明底色、鼠标方向高光描边及距离响应；点击或键盘操作进入 AI 助手并聚焦输入框，减少动画或无 WebGL 2 时使用静态按钮。
- 首屏使用项目负责人提供的视频：静音自动播放、循环、行内播放；可暂停，离开首屏或切换到后台后暂停，加载失败时显示同视频封面。系统开启减少动画时默认显示封面，可手动播放。
- AI 助手：输入发送、模拟等待、连续追问、新对话、示例恢复和行程卡片；共享景点库共 54 处（重庆 14、成都 13、西安 13、杭州 14），支持名称/别名问答、景点列表、故事与玩法以及所属城市推断；单一重点景点可加入路线，多城市混合请求会提示拆分。
- 聊天快捷提问：每城 3 处「人气打卡」精选，随当前行程城市切换；点击发送具名问题，返回拍照与游玩建议。2026-10-08 核对公开文旅报道，非实时热榜；加载时禁用，支持键盘与手机操作。
- 景点探索：选择/拖拽图片、本地预览、类型与大小校验及固定洪崖洞模拟识别；独立的城市/景点选择支持 54 处文字与语音讲解，明确标注与图片无关联，重新识别恢复洪崖洞示例。
- 语音讲解：使用浏览器 speechSynthesis，不调用外部 AI 接口；播放效果取决于浏览器是否具备中文语音。
- 路线规划：重庆、成都、西安、杭州；1–7 日；四种兴趣；100–20000 元预算；日期切换，七天标签可横向滚动。3–6 日补充具名景点与弹性休息，第 7 日保留返程留白；西安临潼点位安排在同一天，低预算整体换为城区慢游，仍不调用地图或真实 AI 接口。
- 景点天气预判：路线规划下方的新模块，支持四个城市、共 54 处景点、今天起七天内日期；七日趋势、分时天气、温度/降雨概率/风速/紫外线指数、游览节奏、随身准备及室内备选。全部为明确标注的模拟天气，不调用实时天气接口或 AI 预测模型。
- 旅行灵感：路线规划后的 InfiniteSpiral 螺旋图片展示，六张本地风景图；自动旋转、滚动/拖动探索、悬停暂停和手动暂停。减少动画偏好下关闭自动旋转。
- 头图下方背景：React Bits Galaxy 动态星空，覆盖首屏之后的内容区域，随滚动显示并响应鼠标排斥；独立背景暂停按钮，减少动画或无 WebGL 支持时使用静态星空。
- PC 版心最大 1536px；平板与手机窄屏布局、键盘焦点、减少动画偏好。

## 三分钟演示建议

1. 从首页点击「开始探索」，展示预置重庆两日文化路线，切换第二天。
2. 输入「成都一天，喜欢美食探索」，观察生成状态与行程更新。
3. 追问「洪崖洞有什么历史故事？」；也可新建对话重新输入。
4. 进入景点识别，上传图片或使用内置图片，点击「体验 AI 识别」。
5. 在路线规划中切换杭州、一天、自然风光和预算，再生成新行程。
6. 点击「出游前，看看目的地天气」，自动带入城市；选择景点与日期，生成模拟预判，切换七日日期查看晴天/雨天建议。也可在助手中问「洪崖洞明天天气怎么样」。

## 数据与边界

所有 AI 输出均为本地模拟，未接入真实模型。图片识别始终展示洪崖洞固定示例，不会根据上传图片分类或推断景点，也不提供识别置信度。用户图片仅使用浏览器临时 URL 预览，不发送到服务器、不写入存储。

路线不是实时地图导航，不读取天气、路况、门票、开放时间或预约。预算仅用于示例偏好选择，不构成实时价格计算；不包含住宿及往返交通。示例内容需要在实际出行前核实。

产品名称「途知 TripMind」为本阶段暂定名称。页尾联系方式待项目负责人提供；没有编造邮箱、电话、学校标识、获奖信息、用户数据或技术指标。

## 项目结构

```text
src/
  App.jsx                    页面、导航、Hero、功能与页尾
  mockAi.js                  城市资料、路线规则、模拟回复
  styles.css                 主题与响应式样式
  hero.css                   沉浸式首屏与磨砂玻璃导航
  theme.css                  标题同色系主色与按钮悬浮反馈
  components/
    Assistant.jsx            聊天交互与行程概览
    RouteCard.jsx            可复用日期/路线卡片
    Recognition.jsx          图片预览与示例讲解
    Planner.jsx              偏好表单与路线结果
    HeroBackground.jsx       背景视频与播放状态
    ParticleText.jsx/.css     React Bits 官方粒子文字源码
    HeroParticleTitle.jsx/.css 中文双行标题、排版与静态回退
    SpecularButton.jsx/.css   React Bits 官方高光按钮源码
    HeroStartButton.jsx/.css  首屏入口、响应式尺寸与静态回退
    InfiniteSpiral.jsx/.css   React Bits 官方 JS-CSS 组件原始源码
    TravelInspiration.jsx/.css 旅行灵感模块、配置与播放控制
    Galaxy.jsx/.css           React Bits 官方星空背景源码
    GalaxyBackdrop.jsx        懒加载、鼠标转发、可见性与静态回退
    PostHeroContent.jsx/.css   首屏下方内容与全宽 Galaxy 背景层
    Beams.jsx/.css            先前光束源码（当前未启用）
    BeamsBackdrop.jsx         先前光束控制组件（当前未启用）
public/
  favicon.svg
  images/chongqing-night.jpg
  images/hero-video-poster-v2.jpg
  images/landscape-1.jpg ... landscape-6.jpg
  videos/hero-background-v2.mp4
```

## React Bits 组件

SpecularButton 接入首屏「开始我的旅程」，官方 JS-CSS 原始文件逐字保留。指定安装命令访问 registry 超时，使用已成功读取的同一份官方 JSON 写入源码；依赖 `ogl@^1.0.11` 已由 Galaxy 安装，无新增依赖包。

- 文档：https://reactbits.dev/components/specular-button
- registry：https://reactbits.dev/r/SpecularButton-JS-CSS.json
- 配置完整沿用示例：size lg、radius 18、白色 tint 且 tintOpacity 0、blur 0、textColor #f5f5f5、lineColor #ffffff、baseColor #525252、intensity 1、shineSize 10、shineFade 40、thickness 1、speed 0.35、followMouse、proximity 250、autoAnimate false。
- 示例英文替换为现有中文入口；onClick 进入 #assistant 并聚焦聊天输入。窄屏以 CSS 缩小字号与内边距，保持和景点识别入口并排。
- HeroStartButton 管理 WebGL 2 探测、离开视口/页面后台卸载、减少动画与错误静态回退；高光层不拦截点击，保留键盘焦点与原生按钮操作。

ParticleText 使用官方 JS-CSS registry 原始源码，安装命令为 `npx shadcn@latest add @react-bits/ParticleText-JS-CSS --yes --path src/components`，没有新增依赖。入口为 HeroParticleTitle，保留「让每一次出发，」「都有 AI 相伴。」两行中文。组件仅支持单行绘制，因此每行独立实例；保留原 h1 的占位尺寸、响应式字号和可访问语义，粒子层透明叠在视频上。

- 文档：https://reactbits.dev/text-animations/particle-text
- registry：https://reactbits.dev/r/ParticleText-JS-CSS.json
- 参数沿用用户示例：particleSize 2、density 4、白色/紫色 #8b5cf6、scatter 180、gatherDuration 1600、stagger 420、pointerRepel 40、repelRadius 120、idleDrift 0.7、hover 触发、fontSize clamp(3rem,12vw,8rem)、fontWeight 800、inherit 字体、glow。
- 示例中的英文文案、360px 深色块替换为现有中文和标题占位；真实字号由组件按行宽自动适配。粒子图层仅用于视觉，屏幕阅读器读取原 h1；手机标题区域允许垂直滑动。
- 减少动画偏好或不支持 Canvas 2D 时显示原静态标题，离开视口时卸载绘制；未修改 ParticleText 本体。

InfiniteSpiral 使用官方 JS-CSS registry 的原始源码，未修改组件本体。registry 的 dependencies 和 registryDependencies 均为空，无新增运行依赖。为 shadcn 安装新增 components.json 与 jsconfig.json，沿用 React + Vite 和普通 CSS。

- 文档：https://reactbits.dev/components/infinite-spiral
- 源码 registry：https://reactbits.dev/r/InfiniteSpiral-JS-CSS.json
- 安装命令：`npx shadcn@latest add @react-bits/InfiniteSpiral-JS-CSS --yes --path src/components`
- 集成入口：src/components/TravelInspiration.jsx；原始配置为 600px 容器、all 模式、speed 0.55、radius 170、100×100 卡片、间距 60、perspective 1000、圆角 10、centerScale 1.2、edgeBlur 6、每圈 7 张、悬停暂停。点击暂停将 speed 临时设为 0，仍可手动拖动。
- 手机端允许在画廊上垂直滚动页面；桌面端可以上下拖动卡片。源码及图片来源详见 THIRD_PARTY_ASSETS.md。

Galaxy 使用官方 JS-CSS registry 原始源码，替换头图下方全部内容的背景。通过指定的 shadcn 命令安装，新增依赖 `ogl@1.0.11`，依赖及锁文件已更新。组件采用动态导入，背景可见时加载并渲染。先前 Beams 源码与依赖保留为历史实现，但已无页面引用，不进入当前生产包。

- 文档：https://reactbits.dev/backgrounds/galaxy
- registry：https://reactbits.dev/r/Galaxy-JS-CSS.json
- 安装：`npx shadcn@latest add @react-bits/Galaxy-JS-CSS --yes --path src/components`
- 配置：mouseRepulsion true、mouseInteraction true、density 1.5、glowIntensity 0.5、saturation 0.8、hueShift 240。背景铺满屏幕宽度，高度适配视口且至少 600px，以 sticky 背景层覆盖首屏后的内容，保留透明度与上下淡出。
- 背景不阻挡前景点击，通过头图下方内容区域转发鼠标移动到 Galaxy，使原组件的鼠标排斥交互有效；本地维护版本增加绘制节流与可见性控制，详见 PERFORMANCE_REPORT.md。
- 背景暂停按钮位于头图下方右侧，与画廊暂停独立。背景离开视口、页面进入后台、减少动画偏好开启时停止 WebGL 渲染。无 WebGL 支持时静态背景和产品功能仍可使用。

未来接入真实模型时，应通过服务端处理模型密钥与请求，将本地模拟层替换为服务调用，不把 API Key 放进前端。

## 图片与景点资料来源

洪崖洞夜景照片：GeoffLeng，Wikimedia Commons，CC BY-SA 4.0。原始照片保留；网页使用调整尺寸和压缩后的 WebP 衍生图，仍按 CC BY-SA 4.0 许可并用 CSS 展示裁切。

- 原图及作者：https://commons.wikimedia.org/wiki/File:%E9%87%8D%E5%BA%86%E6%B4%AA%E5%B4%96%E6%B4%9E.jpg
- 许可：https://creativecommons.org/licenses/by-sa/4.0/
- 洪崖洞景点介绍参考：重庆市文化和旅游发展委员会 https://whlyw.cq.gov.cn/zjwl/yzq/jqjd_1/202203/t20220304_10463056.html

照片的许可独立于项目代码，请在继续展示或分发时保留署名、来源与许可信息。

首屏视频来自项目负责人最新提供的 MP4，保留完整约 19.9 秒画面，转换为 H.264/yuv420p，并移除背景视频的音轨、启用 faststart 方便浏览器加载。封面从同一视频提取。原文件未修改。

## 创意机构风格动效

新增 GSAP + ScrollTrigger 编排。刷新首页可看到约 4 秒的完整开场：双向幕布揭开、中文标题分行遮罩进场与压缩归位、说明和探索卡片错峰展开，随后接上原有粒子标题交互。

下方七个模块加入英文大标题，按「标题 → 内容卡片 → 图片」展开。景点图片有横向 reveal 和桌面端轻微滚动视差；小屏关闭视差，减少动态效果时直接显示静态内容。锚点与键盘焦点能补全动画，已展示模块在切换屏幕尺寸时不会重新遮住。

动效入口为 src/hooks/useSiteMotion.js，样式为 src/motion.css，英文标题组件为 src/components/MotionTitle.jsx。React Bits 组件沿用官方来源，本地性能维护差异记录于 PERFORMANCE_REPORT.md。时间、性能边界与验证记录见 MOTION_DESIGN.md。

详细开发决策与验证范围见 PROJECT_CONTEXT.md。

## 性能优化

视频分为桌面/移动两版，首屏先显示预加载封面，开场完成且首屏可见后再加载视频；进入下方模块后按可见性暂停首屏视频。景点与图库使用本地WebP，图片延迟加载。WebGL降低内部绘制分辨率并控制帧率，离屏/后台停止，静止按钮按需绘制。保持原开场、模块stagger和交互，减少动画时回退静态展示。

性能优化阶段测量：首页观察期下载约6.83→2.72MB，天气独立入口约6.83→0.60MB（这是启动策略统一回首页之前的历史数据）。比较条件、具体修改、本地ReactBits维护差异与限制见 PERFORMANCE_REPORT.md；软件WebGL验证不是实际GPU帧率保证。

每次首次打开或重新加载页面，均从首页开始并播放开场动画，地址中遗留的模块锚点会被初始化为 #home。进入页面后可通过正常导航前往各模块；减少动态效果时显示静态首页。
