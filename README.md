# AI Dashboard

基于 Ant Design 6.x 的前端展示项目，采用与参考图相似的整体布局结构。

## 技术栈

- React 18
- Vite 5
- Ant Design 6
- React Router 6
- TypeScript

## 项目结构

```
src/
├── layouts/
│   └── MainLayout.tsx    # 主布局（顶部提示条、侧边栏、头部、内容区）
├── pages/
│   ├── Dashboard.tsx     # 模型广场页（精选/全部、促销横幅、卡片分组）
│   ├── Models.tsx        # 文本模型列表页
│   └── Workbench.tsx     # 工作台页
├── App.tsx
├── main.tsx
└── index.css
```

## 布局说明

- **顶部提示条**：Alert 组件，可关闭
- **左侧边栏**：可折叠 Menu，分组导航
- **头部**：主导航链接、用户信息、主操作按钮
- **主内容区**：各页面内容
- **右侧浮动**：FloatButton 快捷入口

## 启动

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 构建

```bash
npm run build
```
