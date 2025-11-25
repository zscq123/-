# 勿蹉跎（手机版）iOS风格UI设计规范（第二部分）

## 🧩 组件设计详解

### 1. 按钮（Buttons）

#### 主要按钮（Primary Button）

```css
.btn-primary {
  background: var(--ios-blue);
  color: white;
  height: 50px;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  padding: 0 24px;
  border: none;
  box-shadow: var(--shadow-small);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:active {
  transform: scale(0.96);
  background: var(--ios-blue-dark);
}
```

#### 次要按钮（Secondary Button）

```css
.btn-secondary {
  background: transparent;
  color: var(--ios-blue);
  height: 50px;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  padding: 0 24px;
  border: 1.5px solid var(--ios-blue);
}
```

#### FAB浮动按钮

```css
.fab-button {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: var(--ios-blue);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
  position: fixed;
  bottom: calc(24px + env(safe-area-inset-bottom));
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-button:active {
  transform: scale(0.92);
}
```

---

### 2. 卡片（Cards）

#### 任务卡片

```css
.task-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 16px;
  margin: 0 16px 12px 16px;
  box-shadow: var(--shadow-small);
  transition: all 0.2s ease;
  border: 0.5px solid rgba(0, 0, 0, 0.04);
  position: relative;
}

.task-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-medium);
}

/* 暗色模式 */
.dark .task-card {
  background: var(--bg-secondary-dark);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-dark-small);
}
```

#### 卡片结构

```html
<div class="task-card">
  <div class="task-header">
    <span class="task-category">🔵</span>
    <h3 class="task-title">完成项目文档</h3>
    <button class="task-action">🍅</button>
  </div>
  <div class="task-meta">
    <span class="task-time">今天 15:30</span>
  </div>
  <button class="task-complete">✓</button>
</div>
```

---

### 3. 输入框（Input Fields）

```css
.input-field {
  width: 100%;
  height: 44px;
  background: var(--bg-tertiary);
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 17px;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input-field:focus {
  background: var(--bg-secondary);
  border-color: var(--ios-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.input-field::placeholder {
  color: var(--text-quaternary);
}
```

---

### 4. 分类标签（Category Tags）

```css
.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

/* 工作分类 */
.category-work {
  background: rgba(0, 122, 255, 0.1);
  color: #007AFF;
  border: 1.5px solid rgba(0, 122, 255, 0.3);
}

/* 生活分类 */
.category-life {
  background: rgba(52, 199, 89, 0.1);
  color: #34C759;
  border: 1.5px solid rgba(52, 199, 89, 0.3);
}

/* 学习分类 */
.category-study {
  background: rgba(255, 149, 0, 0.1);
  color: #FF9500;
  border: 1.5px solid rgba(255, 149, 0, 0.3);
}

/* 健康分类 */
.category-health {
  background: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
  border: 1.5px solid rgba(255, 59, 48, 0.3);
}
```

---

### 5. 开关（Toggle Switch）

```css
.toggle-switch {
  width: 51px;
  height: 31px;
  background: var(--text-quaternary);
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-switch.active {
  background: var(--ios-blue);
}

.toggle-switch::after {
  content: '';
  width: 27px;
  height: 27px;
  background: white;
  border-radius: 999px;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active::after {
  transform: translateX(20px);
}
```

---

### 6. 导航栏（Navigation Bar）

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  padding-top: env(safe-area-inset-top);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
}

.navbar-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.navbar-actions {
  display: flex;
  gap: 12px;
}

.navbar-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.navbar-button:active {
  opacity: 0.5;
}
```

---

### 7. 底部状态栏

```css
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 49px;
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(249, 249, 249, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 15px;
  color: var(--text-secondary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-weight: 600;
  color: var(--ios-blue);
}
```

---

### 8. 模态框（Modal）

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  width: 100%;
  box-shadow: var(--shadow-large);
}

.modal-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  text-align: center;
}

.modal-body {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
}
```

---

## 🎬 动画效果

### 标准缓动曲线

```css
/* iOS标准缓动 */
--ease-ios: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in-ios: cubic-bezier(0.4, 0, 1, 1);
--ease-out-ios: cubic-bezier(0, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### 动画时长

```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;
```

### 动画示例

#### 1. 按钮点击

```css
.button-scale {
  transition: transform 0.15s var(--ease-ios);
}

.button-scale:active {
  transform: scale(0.96);
}
```

#### 2. 卡片滑入

```css
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.card-enter {
  animation: slideInUp 0.35s var(--ease-out-ios);
}
```

#### 3. 模态框出现

```css
@keyframes modalIn {
  from {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.modal-enter {
  animation: modalIn 0.4s var(--ease-ios);
}
```

#### 4. 淡入淡出

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.25s ease-out;
}
```

#### 5. 弹性弹出

```css
@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.bounce-in {
  animation: bounceIn 0.5s var(--ease-spring);
}
```

#### 6. 加载旋转

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

#### 7. 左滑删除动画

```css
.task-card-swipe-left {
  transition: transform 0.3s var(--ease-ios);
}

.task-card-swipe-left.swiping {
  transform: translateX(-80px);
}

.delete-button {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background: var(--error);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
```

---

## 🎯 图标系统

### 图标风格

- 使用**SF Symbols风格**（细线条，圆润）
- 统一**24x24px**尺寸
- 使用Emoji作为分类图标

### 功能图标

| 功能 | 图标 | 说明 |
|------|-----|------|
| 添加 | ➕ | 快速添加 |
| 删除 | 🗑️ | 删除任务 |
| 完成 | ✓ | 标记完成 |
| 编辑 | ✏️ | 编辑任务 |
| 番茄钟 | 🍅 | 启动计时 |
| 统计 | 📊 | 查看数据 |
| 设置 | ⚙️ | 应用设置 |
| 搜索 | 🔍 | 搜索任务 |
| 火焰 | 🔥 | 连续打卡 |
| 成就 | 🏆 | 成就徽章 |

### 分类图标

| 分类 | 图标 | 颜色代码 |
|------|-----|---------|
| 工作 | 🔵 | #007AFF |
| 生活 | 🟢 | #34C759 |
| 学习 | 🟡 | #FF9500 |
| 健康 | 🔴 | #FF3B30 |

---

## 📱 页面布局详解

### 1. 主界面（任务列表）

```
┌────────────────────────────────┐
│ 勿蹉跎           [🍅] [📊] [⚙️]│ ← 导航栏（毛玻璃，44px高）
├────────────────────────────────┤
│                                │
│  🔍 搜索任务...                │ ← 搜索框（16px边距）
│                                │
│  [🔵] [🟢] [🟡] [🔴] [全部]     │ ← 分类筛选
│                                │
│  ┌──────────────────────────┐ │
│  │🔵 完成项目文档        🍅 │ │ ← 任务卡片
│  │                          │ │   （12px圆角，16px内边距）
│  │今天 15:30            ✓  │ │
│  └──────────────────────────┘ │
│                                │ ← 12px卡片间距
│  ┌──────────────────────────┐ │
│  │🟢 买菜                🍅 │ │
│  │明天                   ✓  │ │
│  └──────────────────────────┘ │
│                                │
├────────────────────────────────┤
│ 🔥 3天  今日: 2/5  🍅×3        │ ← 底部状态栏（49px高）
└────────────────────────────────┘
         [➕]                     ← FAB按钮（56px圆形）
      右下角固定
```

### 尺寸规范

- 导航栏：44px + safe-area-inset-top
- 搜索框：44px 高度，10px 圆角
- 分类按钮：40px 高度，8px 圆角
- 任务卡片：最小高度 80px，12px 圆角
- 底部栏：49px + safe-area-inset-bottom
- FAB按钮：56x56px，距右20px，距底24px

---

### 2. 番茄钟界面

```
┌────────────────────────────────┐
│         ✕ 退出                 │ ← 半透明顶部
│                                │
│                                │
│     完成项目文档               │ ← 任务名称（22px）
│                                │
│                                │
│        25:00                   │ ← 大号计时器（72px）
│                                │
│                                │
│     ●●●○○                      │ ← 番茄钟进度点
│                                │
│                                │
│     [开始专注]                 │ ← 主按钮（50px高）
│                                │
│                                │
│   今日 🍅×3  专注 75分钟       │ ← 统计信息
│                                │
└────────────────────────────────┘

背景：渐变色或纯色
颜色：#007AFF 到 #5AC8FA
```

---

### 3. 添加任务弹窗

```
┌────────────────────────────────┐
│                                │
│  ┌──────────────────────────┐ │
│  │  添加新任务              │ │ ← 模态框标题
│  │  ──────────────────────  │ │
│  │                          │ │
│  │  任务名称：              │ │
│  │  [          ]            │ │ ← 输入框
│  │                          │ │
│  │  分类：                  │ │
│  │  [🔵] [🟢] [🟡] [🔴]     │ │ ← 分类选择
│  │                          │ │
│  │  [取消]        [添加]    │ │ ← 按钮组
│  └──────────────────────────┘ │
│                                │
└────────────────────────────────┘
背景遮罩：rgba(0,0,0,0.4)
模态框：16px圆角，24px内边距
```

---

### 4. 成就徽章解锁

```
┌────────────────────────────────┐
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │        🥈                │ │ ← 大号徽章（80px）
│  │                          │ │
│  │    🎉 成就解锁！         │ │
│  │                          │ │
│  │   连续打卡 7 天          │ │
│  │                          │ │
│  │      银牌                │ │
│  │                          │ │
│  │   [太棒了！]             │ │
│  │                          │ │
│  └──────────────────────────┘ │
│                                │
└────────────────────────────────┘

动画：弹性弹出 + 光晕效果
```

---

## 💫 交互反馈

### 1. 触觉反馈（Haptics）

```javascript
// 轻触反馈
navigator.vibrate(10);

// 成功反馈
navigator.vibrate([50, 30, 50]);

// 错误反馈
navigator.vibrate([100, 50, 100, 50, 100]);

// 长按反馈
navigator.vibrate(50);
```

### 2. 视觉反馈

| 交互 | 反馈效果 | 说明 |
|------|---------|------|
| 按钮点击 | scale(0.96) | 缩小动画 |
| 卡片点击 | 背景色变深 | 高亮状态 |
| 左滑删除 | 滑动+红色按钮 | 危险操作 |
| 右滑完成 | 滑动+绿色勾选 | 成功操作 |
| 加载中 | 旋转动画 | 等待状态 |
| 完成任务 | 弹性动画+振动 | 成就感 |

### 3. Toast提示

```css
.toast {
  position: fixed;
  top: calc(44px + env(safe-area-inset-top) + 16px);
  left: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  text-align: center;
  backdrop-filter: blur(20px);
  animation: slideInDown 0.3s var(--ease-out-ios);
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

## 🌓 暗色模式切换

### 检测系统主题

```javascript
// 检测系统暗色模式
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark');
}

// 监听主题变化
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', e => {
    if (e.matches) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  });
```

### CSS变量切换

```css
:root {
  --bg-primary: #F2F2F7;
  --text-primary: #000000;
}

.dark {
  --bg-primary: #000000;
  --text-primary: #FFFFFF;
}
```

---

## 📐 Safe Area适配

### 刘海屏和Home Indicator

```css
/* 导航栏适配 */
.navbar {
  padding-top: env(safe-area-inset-top);
}

/* 底部栏适配 */
.bottom-bar {
  padding-bottom: env(safe-area-inset-bottom);
}

/* FAB按钮适配 */
.fab-button {
  bottom: calc(24px + env(safe-area-inset-bottom));
}

/* 页面内容区域 */
.content {
  padding-top: calc(44px + env(safe-area-inset-top));
  padding-bottom: calc(49px + env(safe-area-inset-bottom));
}
```

---

## ✅ 设计检查清单

### 视觉设计
- [ ] 使用iOS标准颜色
- [ ] 遵循8pt间距系统
- [ ] 圆角统一（8/10/12/16px）
- [ ] 阴影轻微柔和
- [ ] 毛玻璃效果到位
- [ ] 暗色模式适配

### 字体排版
- [ ] 使用SF Pro字体栈
- [ ] 字体大小符合规范
- [ ] 字重层级清晰
- [ ] 行高舒适

### 交互动画
- [ ] 使用iOS缓动曲线
- [ ] 动画时长合理
- [ ] 点击有缩放反馈
- [ ] 过渡流畅自然

### 移动端优化
- [ ] 按钮触摸区域≥44px
- [ ] Safe Area适配
- [ ] 防止双击缩放
- [ ] 防止橡皮筋效果
- [ ] 长按禁用选择

---

## 🎨 完整CSS变量表

```css
:root {
  /* 颜色 */
  --ios-blue: #007AFF;
  --ios-blue-light: #5AC8FA;
  --ios-blue-dark: #0051D5;
  
  --bg-primary: #F2F2F7;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #FAFAFA;
  
  --text-primary: #000000;
  --text-secondary: #3C3C43;
  --text-tertiary: #8E8E93;
  --text-quaternary: #C7C7CC;
  
  /* 间距 */
  --space-4: 4px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-20: 20px;
  --space-24: 24px;
  --space-32: 32px;
  
  /* 圆角 */
  --radius-small: 8px;
  --radius-medium: 10px;
  --radius-large: 12px;
  --radius-xlarge: 16px;
  --radius-full: 999px;
  
  /* 阴影 */
  --shadow-small: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-large: 0 4px 16px rgba(0, 0, 0, 0.12);
  
  /* 字体 */
  --font-large-title: 34px;
  --font-title1: 28px;
  --font-title2: 22px;
  --font-body: 17px;
  --font-subhead: 15px;
  --font-footnote: 13px;
  
  /* 动画 */
  --ease-ios: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-normal: 250ms;
}
```

---

**设计规范完成！** 🎉

遵循这份规范，你的应用将拥有原生iOS般的精致体验。
