# 性能审查与优化记录

日期：2026-10-07。范围：媒体、WebGL、滚动监听、GSAP、首屏加载。

## 项目理解与架构决策

这是 React 19 + Vite 的单页文旅 Demo，使用 hash 导航、本地模拟 AI/天气数据、GSAP + ScrollTrigger 编排。App 组合 Hero、助手、识别、规划、天气、图库和产品功能；HeroBackground 管理视频，GalaxyBackdrop 管理头图下方背景，HeroParticleTitle 与 HeroStartButton 管理首屏效果。表单状态和模拟数据仍由各产品组件处理，本次没有改动数据流或增加依赖。

Coding 审查后，独立 Architect 评估认为现有结构可保留。最高优先级是不可见或静止时的持续绘制，以及提前请求大媒体；GSAP 的 context、一次入场、原生滚动与两处桌面视差合理。采用局部优化，保留 opening、stagger、背景位置、交互和静态回退。

## 媒体实测

| 媒体 | 原体积 | 当前展示文件 | 当前体积 | 减少 |
| --- | ---: | --- | ---: | ---: |
| 桌面视频 | 3,089,893 B | hero-background-desktop.mp4 | 2,485,221 B | 19.6% |
| 移动视频 | 3,089,893 B | hero-background-mobile.mp4 | 1,417,009 B | 54.1% |
| 识别示例图 | 3,173,830 B | chongqing-night-1200.webp | 236,746 B | 92.5% |
| 侧栏示例图 | 3,173,830 B | chongqing-night-640.webp | 76,172 B | 97.6% |
| 六张风景图合计 | 339,055 B | landscape-1..6.webp | 54,156 B | 84.0% |

桌面视频保留 1280×720，移动为 960×540；两版均保留 19.9 秒、30fps、H.264/yuv420p、无音轨与 faststart。原视频和 JPEG 文件保留，无删除。WebP 调整尺寸与压缩，保留第三方图片作者、来源和原许可，见 THIRD_PARTY_ASSETS.md。

## 具体修改

- 首屏封面仅 42,455 B，保留并在 HTML 预加载；图片补充尺寸与异步解码。视频初始不绑定 src，首屏至少 20% 可见且开场结束后才加载。直接访问天气等深层锚点不请求视频。减少动画、Save-Data、2G 下不自动播放，用户可手动播放；离开首屏、页面隐藏或暂停后停止解码播放。
- Recognition 示例图 lazy/async，Assistant 根据展示尺寸选择 640/1200 WebP，图库改用 240px WebP 并全部 lazy/async。
- Galaxy 内部绘制为 CSS 尺寸的约 70%，大屏限制约 75 万像素，画布仍覆盖原背景范围。最多约 30 FPS，时间与鼠标缓动按 elapsed time 计算。稳定默认数组避免普通更新重建 WebGL；隐藏页面暂停，尺寸变化使用 ResizeObserver。静态模式仅在交互、尺寸或恢复时绘制。
- InfiniteSpiral 离屏与页面隐藏时停止 RAF 并移除局部 scroll 监听。悬停、暂停、拖动结束且位置收敛后停止，交互时唤醒；释放空闲 will-change。
- SpecularButton 作为动态模块在开场后加载，OGL 从初始主包拆出；空闲时保留最后一帧并停止 RAF，靠近鼠标或尺寸/参数变化时恢复，高光平滑收敛，DPR 上限 2。聚焦中的静态按钮不被加载后的按钮替换，确保早期键盘操作不丢焦点。
- ParticleText 保留原绘制与光晕，聚合/鼠标交互最多约 30 FPS，细微闲置漂移约 15 FPS，按时间修正缓动。隐藏页面停止计时与绘制，首屏之外卸载粒子图层。
- Header 仅在跨越滚动阈值时更新状态。GSAP 开场的临时 scroll 监听在开场完成即移除；保留 once 入场、context 清理和桌面视差。修复退出 reduced motion 后 ScrollTrigger 重建导致滚动复位的问题，切换前后恢复当前位置。

修改：App.jsx、index.html、HeroBackground、HeroStartButton、HeroParticleTitle、GalaxyBackdrop、Galaxy、InfiniteSpiral、SpecularButton、ParticleText、Assistant、Recognition、TravelInspiration、useSiteMotion 及说明文件。新增：优化媒体和本报告。没有删除文件、改变核心架构或引入运行依赖。四份 React Bits JSX 已成为本地维护版本，原件备份在工作区 work/qa/performance-originals；CSS 与来源声明保留。

## 生产版对比

隔离 Chrome、1440×1000、DPR 1、localhost、关闭缓存。每个入口加载 10 秒后采集 3 秒 idle trace；网络为 CDP loadingFinished 字节总计，含响应头、压缩脚本和实际媒体请求。WebGL 使用 SwiftShader 软件渲染。

| 指标 | 优化前 | 最终优化后 |
| --- | ---: | ---: |
| 首页入口观察期下载 | 6,834,384 B | 2,717,304 B |
| 天气入口观察期下载 | 6,834,384 B | 597,871 B |
| 首屏主 JS，gzip 构建尺寸 | 164.40 KB | 149.49 KB |
| 首页 3 秒 RAF 回调次数 | 1,074 | 376 |
| 天气 3 秒 RAF 回调次数 | 556 | 282 |
| 首页 3 秒 FunctionCall 总时长 | 171 ms | 61 ms |
| 天气 3 秒 FunctionCall 总时长 | 32 ms | 18 ms |

最终首页传输减少约 60%，天气入口减少约 91%。浏览器原生 lazy 加载的预取时机会影响下载总量：早期样本天气约 465 KB，最终样本包含邻近模块小图约 598 KB；采用最终测量值。RAF 次数不是屏幕 FPS，FunctionCall 是诊断样本而非完整 CPU/GPU 负载。最终首页 FCP 样本 428 ms（此前 476 ms），本机单次结果不用于承诺网络环境中的加载时间、LCP 或真实显卡帧率。

## 验证与限制

生产构建通过，无大包体积提示。真实 Chrome 检查：天气入口无视频请求；返回首屏视频播放、手动暂停/继续；粒子 Hover；按钮高光、键盘 Enter 与聊天聚焦；Spiral 离屏/悬停/暂停/拖动/恢复；移动 390/320px 布局与移动视频；减少动画静态回退和恢复。独立 Tester 验证滚动位置 5799→5799→5799，并模拟按钮模块延迟 800ms，早期开场的键盘焦点仍保持。天气功能回归和生产锚点/开场偏好恢复检查通过。生产测量无页面异常，边界检查无页面异常。

风险：WebP 和视频有损压缩可能减少细节，移动视频更柔；Galaxy 降采样、粒子闲置节流在大屏近看有轻微差异。已检查图片/视频对比和桌面截图。软件 WebGL 检查不能替代比赛设备上的真实 GPU 测试；本次未声称得到真实手机 FPS 或完整 Core Web Vitals 成绩。

工作区证据：work/qa/performance-before.json、performance-after.json、performance-audit.cjs、performance-background-check.cjs、performance-edge-validation.json，以及媒体对比/页面截图。

最终完整交互回归再次通过，包括关闭 WebGL 的静态按钮/天气回退、冷启动 reduced motion、运行中偏好恢复、粒子聚合、Spiral 拖动与手机视频，无页面异常或失败 HTTP。测试首次返回首页后立即操作视频时，原生平滑滚动尚未结束，标题仍在视口之外，等待粒子画布超时；测试改为等待滚动到首页后再操作，重跑通过，未据失败样本声称通过。完整证据：work/qa/performance-interaction-validation.json。

## 后续启动规则变更

项目负责人随后要求首次打开和重新加载均从首页开始。现在所有新文档在渲染前初始化为#home；输入的#weather等旧锚点也会归首页，进入页面后正常导航仍可前往模块。本报告的独立天气入口网络数字与直接链接回归记录属于这次规则变更前的性能审查版本，不能作为当前#weather初始入口的下载量。媒体压缩和离屏暂停实现继续保留。
