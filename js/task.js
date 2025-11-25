// ==========================================
// 任务管理模块
// ==========================================

const TaskManager = {
  currentFilter: 'all',
  searchQuery: '',

  // 分类配置
  categories: {
    work: { icon: '🔵', name: '工作', color: '#007AFF' },
    life: { icon: '🟢', name: '生活', color: '#34C759' },
    study: { icon: '🟡', name: '学习', color: '#FF9500' },
    health: { icon: '🔴', name: '健康', color: '#FF3B30' }
  },

  // 渲染任务列表
  renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    let tasks = Storage.getTasks();

    // 应用筛选
    if (this.currentFilter !== 'all') {
      tasks = tasks.filter(task => task.category === this.currentFilter);
    }

    // 应用搜索
    if (this.searchQuery) {
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // 显示空状态或任务列表
    if (tasks.length === 0) {
      taskList.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    
    // 使用事件委托，避免每次都创建新的监听器
    // 先移除旧内容，然后重新渲染
    taskList.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
  },

  // 创建任务卡片HTML
  createTaskCard(task) {
    const category = this.categories[task.category] || this.categories.work;
    const completedClass = task.completed ? 'completed' : '';
    const timeText = this.getTimeText(task.createdAt);

    return `
      <div class="task-card ${completedClass}" data-id="${task.id}">
        <div class="task-header">
          <span class="task-category">${category.icon}</span>
          <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
          <button class="task-action pomodoro-trigger" data-id="${task.id}">🍅</button>
        </div>
        <div class="task-meta">
          <span class="task-time">${timeText}</span>
          <button class="task-complete" data-id="${task.id}">
            ${task.completed ? '✓' : ''}
          </button>
        </div>
      </div>
    `;
  },

  // 获取时间文本
  getTimeText(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `今天 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '明天';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  },

  // 转义HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // 切换完成状态
  toggleComplete(id) {
    const task = Storage.toggleTask(id);
    if (task) {
      // 振动反馈
      if (navigator.vibrate && task.completed) {
        navigator.vibrate([50, 30, 50]);
      }
      
      // 显示提示
      if (task.completed) {
        showToast('✅ 任务已完成！');
        // 检查并更新打卡
        this.checkAndUpdateStreak();
      }

      this.renderTasks();
      this.updateStats();
    }
  },

  // 删除任务
  deleteTask(id) {
    if (confirm('确定要删除这个任务吗？')) {
      Storage.deleteTask(id);
      
      // 振动反馈
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      showToast('🗑️ 任务已删除');
      this.renderTasks();
      this.updateStats();
    }
  },

  // 启动番茄钟
  startPomodoro(id) {
    const tasks = Storage.getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
      if (task.completed) {
        showToast('⚠️ 任务已完成，无需番茄钟', 2000);
        return;
      }
      PomodoroTimer.start(task);
    }
  },

  // 更新统计数据
  updateStats() {
    const tasks = Storage.getTasks();
    const today = new Date().toDateString();
    
    // 今日任务
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt).toDateString();
      return taskDate === today;
    });

    const todayComplete = todayTasks.filter(task => task.completed).length;
    const todayTotal = todayTasks.length;

    document.getElementById('todayComplete').textContent = todayComplete;
    document.getElementById('todayTotal').textContent = todayTotal;

    // 今日番茄钟数
    const pomodoroHistory = Storage.getPomodoroHistory();
    const todayPomodoros = pomodoroHistory.filter(record => {
      const recordDate = new Date(record.date).toDateString();
      return recordDate === today;
    });

    document.getElementById('todayPomodoro').textContent = todayPomodoros.length;

    // 连续打卡天数
    this.updateStreak();
  },

  // 更新连续打卡
  updateStreak() {
    const achievements = Storage.getAchievements();
    document.getElementById('streakDays').textContent = achievements.streak || 0;
  },

  // 设置筛选
  setFilter(category) {
    this.currentFilter = category;
    
    // 更新按钮状态
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === category) {
        btn.classList.add('active');
      }
    });

    this.renderTasks();
  },

  // 设置搜索
  setSearch(query) {
    this.searchQuery = query;
    this.renderTasks();
  },

  // 检查并更新打卡
  checkAndUpdateStreak() {
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
      this.updateStreak();
    }
  }
};

// Toast 提示函数
function showToast(message, duration = 2000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  toast.classList.add('slide-in-down');

  setTimeout(() => {
    toast.classList.remove('slide-in-down');
    toast.style.display = 'none';
  }, duration);
}
