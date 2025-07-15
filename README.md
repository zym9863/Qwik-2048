
[English](README_EN.md)

# Qwik 2048 游戏

基于 Qwik 框架开发的经典 2048 数字游戏。

## 项目特点

- 使用 Qwik 框架的 CSR (Client Side Rendering) 模式
- 完整的 2048 游戏逻辑实现
- 支持键盘操作（方向键）
- 中文界面
- 响应式设计

## 游戏规则

1. 使用方向键移动数字块
2. 当两个相同的数字块碰撞时，它们会合并成一个
3. 目标：创造出数字 2048！

## 技术栈

- **框架**: Qwik 1.14.1
- **构建工具**: Vite 7.0.4
- **类型检查**: TypeScript 5.8.3
- **开发模式**: CSR (Client Side Rendering)

## 项目结构

```
src/
├── app.tsx          # 主应用组件，包含2048游戏逻辑
├── app.css          # 样式文件
├── main.tsx         # 应用入口
├── index.css        # 全局样式
├── vite-env.d.ts    # Vite类型声明
└── assets/          # 静态资源
    └── qwik.svg     # Qwik图标
```

## 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 更多信息

了解更多关于 Qwik 的信息：[Qwik 官网](https://qwik.dev)
加入社区：[Discord](https://qwik.dev/chat)

