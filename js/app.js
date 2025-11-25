// ==========================================
// 主应用逻辑
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // 初始化应用
  init();
});

function init() {
  // 渲染任务列表
  TaskManager.renderTasks();
  
  // 更新统计
  TaskManager.updateStats();
  
  // 请求通知权限
  requestNotificationPermission();
  
  // 绑定事件
  bindEvents();
  
  // 初始化滑动手势
  if (typeof swipeDetector !== 'undefined') {
    swipeDetector.init();
  }
  
  // 检查打卡
  checkDailyStreak();
  
  console.log('✅ 应用初始化完成');
}

// 绑定事件监听
function bindEvents() {
  // FAB 按钮 - 添加任务
  const fabButton = document.getElementById('fabButton');
  let pressTimer;
  let isLongPress = false;
  
  fabButton.addEventListener('touchstart', () => {
    isLongPress = false;
    pressTimer = setTimeout(() => {
      isLongPress = true;
      if (navigator.vibrate) navigator.vibrate(50);
      showToast('语音输入功能即将推出', 2000);
    }, 500);
  });
  
  fabButton.addEventListener('touchend', () => {
    clearTimeout(pressTimer);
  });
  
  fabButton.addEventListener('touchmove', () => {
    clearTimeout(pressTimer);
  });
  
  fabButton.addEventListener('click', (e) => {
    if (!isLongPress) {
      openAddTaskModal();
    }
    isLongPress = false;
  });

  // 取消按钮
  document.getElementById('cancelBtn').addEventListener('click', closeAddTaskModal);

  // 添加任务表单
  document.getElementById('addTaskForm').addEventListener('submit', handleAddTask);

  // 分类选择
  document.querySelectorAll('.category-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.category-select-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 分类筛选
  document.querySelectorAll('.category-filter .category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      TaskManager.setFilter(category);
    });
  });

  // 搜索
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    TaskManager.setSearch(e.target.value);
  });

  // 导航栏按钮
  document.getElementById('pomodoroBtn').addEventListener('click', () => {
    showToast('请先选择一个任务开始番茄钟', 2000);
  });

  document.getElementById('statsBtn').addEventListener('click', () => {
    showToast('统计功能即将推出', 2000);
  });

  document.getElementById('settingsBtn').addEventListener('click', () => {
    showToast('设置功能即将推出', 2000);
  });

  // 番茄钟控制
  document.getElementById('startPomodoroBtn').addEventListener('click', () => {
    PomodoroTimer.startTimer();
  });

  document.getElementById('closePomodoroBtn').addEventListener('click', () => {
    PomodoroTimer.close();
  });

  document.getElementById('whiteNoiseBtn').addEventListener('click', () => {
    showToast('白噪音功能即将推出', 2000);
  });

  // 点击遮罩关闭模态框
  document.getElementById('addTaskModal').addEventListener('click', (e) => {
    if (e.target.id === 'addTaskModal') {
      closeAddTaskModal();
    }
  });

  // 任务列表事件委托（避免内存泄漏）
  const taskList = document.getElementById('taskList');
  let pressTimer = null;
  let longPressTarget = null;

  // 完成按钮和番茄钟按钮（点击事件）
  taskList.addEventListener('click', (e) => {
    // 完成任务
    if (e.target.classList.contains('task-complete') || e.target.closest('.task-complete')) {
      const btn = e.target.classList.contains('task-complete') ? e.target : e.target.closest('.task-complete');
      const id = parseInt(btn.dataset.id);
      TaskManager.toggleComplete(id);
    }
    
    // 启动番茄钟
    if (e.target.classList.contains('pomodoro-trigger') || e.target.closest('.pomodoro-trigger')) {
      const btn = e.target.classList.contains('pomodoro-trigger') ? e.target : e.target.closest('.pomodoro-trigger');
      const id = parseInt(btn.dataset.id);
      TaskManager.startPomodoro(id);
    }
  });

  // 长按显示选项菜单（简化版：暂时保留长按删除作为备选）
  taskList.addEventListener('touchstart', (e) => {
    const card = e.target.closest('.task-card');
    if (card && !e.target.closest('.task-complete') && !e.target.closest('.pomodoro-trigger')) {
      longPressTarget = card;
      pressTimer = setTimeout(() => {
        // 长按显示提示：可以使用滑动手势
        showToast('💡 向左滑动删除，向右滑动完成', 2000);
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        longPressTarget = null;
      }, 800);
    }
  });

  taskList.addEventListener('touchend', () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    longPressTarget = null;
  });

  taskList.addEventListener('touchmove', () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    longPressTarget = null;
  });
}

// 打开添加任务模态框
function openAddTaskModal() {
  const modal = document.getElementById('addTaskModal');
  modal.style.display = 'flex';
  modal.querySelector('.modal-content').classList.add('modal-in');
  document.getElementById('taskInput').focus();
}

// 关闭添加任务模态框
function closeAddTaskModal() {
  const modal = document.getElementById('addTaskModal');
  modal.style.display = 'none';
  document.getElementById('addTaskForm').reset();
  
  // 重置分类选择
  document.querySelectorAll('.category-select-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.category-select-btn[data-category="work"]').classList.add('active');
}

// 处理添加任务
function handleAddTask(e) {
  e.preventDefault();
  
  const title = document.getElementById('taskInput').value.trim();
  if (!title) return;

  // 获取选中的分类
  const selectedCategory = document.querySelector('.category-select-btn.active');
  const category = selectedCategory ? selectedCategory.dataset.category : 'work';

  // 创建任务对象
  const task = {
    id: Date.now(),
    title: title,
    category: category,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  // 保存任务
  Storage.addTask(task);

  // 振动反馈
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }

  // 显示提示
  showToast('✅ 任务已添加');

  // 关闭模态框
  closeAddTaskModal();

  // 重新渲染
  TaskManager.renderTasks();
  TaskManager.updateStats();
}

// 检查每日打卡
function checkDailyStreak() {
  const achievements = Storage.getAchievements();
  const today = new Date().toDateString();
  const lastDate = achievements.lastCheckDate;

  // 如果今天已经打卡，直接返回
  if (lastDate === today) {
    return;
  }

  // 检查任务完成情况
  const tasks = Storage.getTasks();
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt).toDateString();
    return taskDate === today && task.completed;
  });

  // 如果今天有完成任务，更新打卡
  if (todayTasks.length > 0) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate === yesterday.toDateString()) {
      // 连续打卡
      achievements.streak++;
    } else if (lastDate !== today) {
      // 中断了，重新计数
      achievements.streak = 1;
    }

    achievements.lastCheckDate = today;
    achievements.totalDays++;

    Storage.saveAchievements(achievements);
    TaskManager.updateStreak();
  }
}

// 检测摇一摇（未来功能）
function detectShake() {
  if ('DeviceMotionEvent' in window) {
    let lastTime = 0;
    let lastX = 0, lastY = 0, lastZ = 0;

    window.addEventListener('devicemotion', (e) => {
      const current = e.accelerationIncludingGravity;
      const currentTime = new Date().getTime();

      if ((currentTime - lastTime) > 100) {
        const diffTime = currentTime - lastTime;
        const diffX = Math.abs(current.x - lastX);
        const diffY = Math.abs(current.y - lastY);
        const diffZ = Math.abs(current.z - lastZ);

        const speed = (diffX + diffY + diffZ) / diffTime * 10000;

        if (speed > 15000) {
          // 摇一摇触发
          handleShake();
        }

        lastTime = currentTime;
        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
      }
    });
  }
}

// 处理摇一摇
function handleShake() {
  const tasks = Storage.getTasks().filter(t => !t.completed);
  
  if (tasks.length === 0) {
    showToast('没有未完成的任务', 2000);
    return;
  }

  const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
  
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }

  showToast(`🎲 随机任务：${randomTask.title}`, 3000);
}

// 检测系统主题
function detectTheme() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
  }

  // 监听主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
}

// 调用主题检测
detectTheme();
