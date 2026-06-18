export const categories = [
  { id: "product", name: "产品营销", tone: "商业转化" },
  { id: "ecommerce", name: "电商主图", tone: "高点击" },
  { id: "social", name: "社媒广告", tone: "强钩子" },
  { id: "infographic", name: "信息图", tone: "可读可信" },
  { id: "portrait", name: "头像人像", tone: "质感统一" },
  { id: "ui", name: "App / 网页", tone: "产品演示" },
  { id: "game", name: "游戏素材", tone: "风格资产" },
  { id: "edit", name: "图像编辑", tone: "保真改图" }
];

export const prompts = [
  {
    id: "premium-product-hero",
    title: "高端产品海报主视觉",
    category: "product",
    badge: "Hero",
    aspectRatio: "16:9",
    model: "gpt-image-2",
    apiUseCase: "适合 SaaS 首页、众筹页、投放落地页头图。",
    description: "把一个产品包装成高级商业广告主视觉，强调材质、卖点和品牌记忆点。",
    variables: ["产品名称", "品牌调性", "核心卖点", "主色"],
    prompt:
      "为 {{产品名称}} 生成一张高端商业广告主视觉。品牌调性是 {{品牌调性}}，核心卖点是 {{核心卖点}}。画面中央展示产品本体，保持真实比例和清晰边缘，表面材质可被放大检查。背景使用 {{主色}} 作为主视觉线索，加入与卖点相关的轻量场景元素，但不要遮挡产品。构图采用 16:9 横版，产品占画面 42%，右侧保留干净留白给营销文案。灯光为大型柔光箱加一束轮廓光，细节锐利，高端电商摄影，真实阴影，8k，禁止水印、乱码文字、虚假 logo。"
  },
  {
    id: "marketplace-main-image",
    title: "白底电商主图升级",
    category: "ecommerce",
    badge: "Amazon",
    aspectRatio: "1:1",
    model: "gpt-image-2",
    apiUseCase: "适合批量生成 marketplace 主图方案。",
    description: "生成干净合规的白底主图，突出产品轮廓和材质，不抢平台规则。",
    variables: ["产品", "材质", "关键配件"],
    prompt:
      "生成 {{产品}} 的电商平台主图，纯白背景，正面 3/4 角度，产品占画面 82%-88%。准确表现 {{材质}} 材质、边缘结构和真实比例。若包含 {{关键配件}}，将配件整齐放在产品右下角，主产品仍是绝对视觉中心。光线均匀，软阴影极淡，高清商业摄影，无场景道具、无人物、无文字、无边框、无水印。输出 1:1 方图，适合 Amazon / Shopify / TikTok Shop 列表页。"
  },
  {
    id: "ugc-ad-still",
    title: "UGC 广告封面帧",
    category: "social",
    badge: "Ads",
    aspectRatio: "9:16",
    model: "gpt-image-2",
    apiUseCase: "适合短视频封面、Meta/TikTok 广告首帧。",
    description: "生成真人感强的竖版广告封面，方便测试不同人群和痛点。",
    variables: ["产品", "目标人群", "痛点", "场景"],
    prompt:
      "生成一张 9:16 竖版 UGC 广告封面帧。画面中 {{目标人群}} 在 {{场景}} 中自然使用 {{产品}}，表情显示刚解决 {{痛点}} 后的轻松感。构图像手机实拍但画质专业，手部动作真实，产品清晰可见，环境有生活细节。顶部留出 18% 安全文案区域，不直接生成文字。色彩明亮但不过度滤镜，真实皮肤质感，轻微景深，适合 TikTok / Reels 首帧。禁止塑料感、过度磨皮、乱码文字和多余品牌 logo。"
  },
  {
    id: "liquid-glass-infographic",
    title: "液态玻璃 Bento 信息图",
    category: "infographic",
    badge: "Bento",
    aspectRatio: "16:9",
    model: "gpt-image-2",
    apiUseCase: "适合用 API 批量生成知识卡、对比卡、产品说明图。",
    description: "采用热门 bento grid 结构，把复杂卖点变成可读的信息图。",
    variables: ["主题", "语言", "主色", "数据点"],
    prompt:
      "创建 {{主题}} 的 16:9 横版 Bento 信息图，语言使用 {{语言}}。整体风格为高级液态玻璃界面，背景使用 {{主色}} 的柔和抽象纹理并强模糊，前景 8 个模块采用半透明玻璃卡片、细边框和真实阴影。M1 展示主题主视觉，M2 核心优势 4 点，M3 使用步骤 4 步，M4 展示 {{数据点}} 等关键数据，M5 适合人群，M6 注意事项，M7 速查信息，M8 冷知识。文本必须清晰、排版规整、不要乱码。图标统一线性风格，留白充足，适合网页文章封面和产品教育页。"
  },
  {
    id: "founder-quote-card",
    title: "创始人金句卡",
    category: "social",
    badge: "Quote",
    aspectRatio: "4:5",
    model: "gpt-image-2",
    apiUseCase: "适合生成 LinkedIn、小红书、公众号封面金句图。",
    description: "把一句话做成有头像、有品牌质感的社媒传播卡。",
    variables: ["人物", "金句", "品牌色", "行业"],
    prompt:
      "生成一张 4:5 社媒金句卡。左侧是 {{人物}} 的写实半身肖像，右侧排版显示金句：“{{金句}}”。行业背景暗示为 {{行业}}，但不要堆叠复杂符号。背景使用 {{品牌色}} 的深浅层次，文字为高对比衬线字体，引用符号大而克制。人物边缘和文字区域用柔和渐变过渡，整体像高端商业杂志版式。确保文字清晰可读，人物真实自然，不生成水印、二维码或无关 logo。"
  },
  {
    id: "avatar-pack",
    title: "统一风格头像组",
    category: "portrait",
    badge: "Avatar",
    aspectRatio: "1:1",
    model: "gpt-image-2",
    apiUseCase: "适合为用户生成社媒头像、客服头像、社区身份图。",
    description: "同一人物或角色的多风格头像模板，强调一致性和可替换变量。",
    variables: ["角色", "职业", "风格", "背景元素"],
    prompt:
      "为 {{角色}} 生成 1:1 高级头像。角色职业是 {{职业}}，视觉风格为 {{风格}}。面部自然、眼神清晰、肩颈比例真实，背景加入少量 {{背景元素}} 作为身份线索。构图为胸像，头部居中，背景不过度复杂。灯光柔和，有清晰轮廓光，适合作为产品社区、客服、创作者账号头像。输出高分辨率，避免夸张表情、畸形五官、文字、水印和多余装饰。"
  },
  {
    id: "app-store-screenshot",
    title: "App Store 截图海报",
    category: "ui",
    badge: "UI",
    aspectRatio: "9:16",
    model: "gpt-image-2",
    apiUseCase: "适合移动应用上架图、官网功能图、广告素材。",
    description: "把 App 功能做成竖版展示图，包含真实界面层级和卖点空间。",
    variables: ["App 名称", "核心功能", "界面类型", "品牌色"],
    prompt:
      "为 {{App 名称}} 生成 9:16 App Store 截图海报。核心功能是 {{核心功能}}，界面类型是 {{界面类型}}。画面放置一台真实手机，屏幕展示清晰可信的产品 UI：顶部导航、关键数据区域、主操作按钮和列表/卡片内容。背景使用 {{品牌色}} 的干净渐变和轻量产品符号，手机周围保留标题与卖点文案空间，但不要直接生成长段文字。UI 必须像真实产品，不要乱码、不要不可读的小字、不要浮夸 3D 卡片。"
  },
  {
    id: "youtube-thumbnail",
    title: "YouTube 封面缩略图",
    category: "social",
    badge: "CTR",
    aspectRatio: "16:9",
    model: "gpt-image-2",
    apiUseCase: "适合创作者批量测封面方向。",
    description: "强调强对比、人物情绪和主题物件，适合 A/B 测试。",
    variables: ["主题", "情绪", "关键物件", "色彩对比"],
    prompt:
      "生成一张 16:9 YouTube 缩略图，主题是 {{主题}}。画面左侧是表现 {{情绪}} 的人物近景，右侧是放大的 {{关键物件}}。使用 {{色彩对比}} 的强对比配色，边缘光明显，主体分离清楚。预留 30% 区域给标题文字，但不要直接生成文字。构图简单、远距离也能看懂，细节锐利，适合科技、商业或 AI 教程频道。禁止水印、乱码文字、过多元素和恐怖夸张表情。"
  },
  {
    id: "poster-event",
    title: "活动海报主KV",
    category: "product",
    badge: "Poster",
    aspectRatio: "3:4",
    model: "gpt-image-2",
    apiUseCase: "适合发布会、直播课、训练营活动图。",
    description: "生成一张有活动氛围的主海报，保留后期排字空间。",
    variables: ["活动主题", "目标用户", "视觉隐喻", "氛围"],
    prompt:
      "为 {{活动主题}} 生成 3:4 活动海报主视觉。目标用户是 {{目标用户}}，核心视觉隐喻是 {{视觉隐喻}}。整体氛围为 {{氛围}}，画面有明确主物体、前景层次和背景空间。顶部保留标题区，中部放主视觉，底部保留时间/嘉宾/报名信息区，但不要直接生成具体文字。风格现代、商业、可用于公众号封面和线下易拉宝。光影有戏剧性但不脏，禁止乱码文字、水印、二维码。"
  },
  {
    id: "game-prop-sheet",
    title: "游戏道具设定图",
    category: "game",
    badge: "Asset",
    aspectRatio: "4:3",
    model: "gpt-image-2",
    apiUseCase: "适合小游戏、美术外包 brief、资产概念探索。",
    description: "输出一组同风格道具设定，便于进入建模或像素化流程。",
    variables: ["道具类型", "世界观", "材质", "稀有度"],
    prompt:
      "生成 {{道具类型}} 的游戏道具设定图，世界观是 {{世界观}}，材质以 {{材质}} 为主，稀有度表现为 {{稀有度}}。画面包含 6 个变体，排列在干净设定稿画布上，每个道具角度一致、轮廓清晰、可被单独裁切。底部可有极短标签区但不要生成不可读小字。风格统一，光源一致，细节适合 3D 建模或 2D sprite 后续制作。禁止重复粘连、透视混乱、背景过重和水印。"
  },
  {
    id: "image-edit-background",
    title: "保留主体换背景",
    category: "edit",
    badge: "Edit",
    aspectRatio: "source",
    model: "gpt-image-2",
    apiUseCase: "适合图生图编辑、批量更换商品场景。",
    description: "用于上传图片后改背景，要求主体结构、logo、颜色保持不变。",
    variables: ["主体", "新场景", "光线", "保留细节"],
    prompt:
      "基于上传图片进行编辑：严格保留 {{主体}} 的形状、颜色、比例、材质、logo 和 {{保留细节}}，只将背景替换为 {{新场景}}。新背景光线为 {{光线}}，阴影方向必须与主体一致，让主体自然落在场景中。不要改变主体结构，不要新增文字，不要擦除品牌细节。输出真实商业摄影效果，边缘干净，接触阴影可信，适合产品落地页和广告素材。"
  },
  {
    id: "fashion-lookbook",
    title: "服装 Lookbook 拼贴",
    category: "ecommerce",
    badge: "Fashion",
    aspectRatio: "4:5",
    model: "gpt-image-2",
    apiUseCase: "适合服装品牌详情页、社媒穿搭图。",
    description: "把单品做成多姿势、多细节的高级画报式拼贴。",
    variables: ["服装单品", "模特气质", "场景", "品牌灵感"],
    prompt:
      "生成 {{服装单品}} 的 4:5 高级 Lookbook 拼贴海报。模特气质为 {{模特气质}}，场景是 {{场景}}，品牌灵感接近 {{品牌灵感}}。同一位模特出现 3 个姿势：全身、半身、细节特写，层叠排版但不拥挤。服装材质、版型、褶皱、配饰清晰可见，背景有编辑杂志感。预留少量文案空间但不要生成具体文字。禁止畸形手指、错误肢体、乱码和多余 logo。"
  }
];
