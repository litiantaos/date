# 日历卡片应用

一款优雅的日历卡片应用，融合了中国传统历法与现代设计美学，不仅提供日历功能，还能为每一天带来诗意与灵感。

<video src="./demo/demo.mp4" controls></video>

## 特性

- 以月份视图展示日历，支持月份切换和快速回到今天
- 显示农历日期和节气信息
- 标记法定节假日和调休安排
- 点击日期格子，流畅展开为精美海报卡片
- 海报卡片展示随机诗词或句子，支持内容切换
- 平滑的过渡动画效果

## 技术栈

- [Vue 3](https://vuejs.org/) - 渐进式JavaScript框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Remix Icon](https://remixicon.com/) - 简洁优雅的开源图标库

## 数据来源

- 日历数据: [Chinese-Days API](https://chinese-days.yaavi.me/)
- 诗词数据: [今日诗词 API](https://www.jinrishici.com/)
- 句子数据: [一言 API](https://hitokoto.cn/)

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 使用指南

- **月份导航：** 使用左右箭头切换月份
- **返回今天：** 点击"今天"按钮回到当前日期
- **查看详情：** 点击任意日期格子，展开为海报卡片
- **切换内容：** 在海报卡片模式下，点击切换按钮在诗词与句子间切换
- **返回日历：** 点击海报卡片上的关闭按钮返回日历视图

## 贡献

欢迎贡献！请随时提交问题或拉取请求。

## 许可

此项目基于MIT许可证开源。
