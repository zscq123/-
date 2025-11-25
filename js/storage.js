// ==========================================
// 本地存储模块
// ==========================================

const Storage = {
  // 获取所有任务
  getTasks() {
    try {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('读取任务数据失败:', error);
      return [];
    }
  },

  // 保存所有任务
  saveTasks(tasks) {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('保存任务失败:', error);
      // 使用Toast提示而不是alert（移动端友好）
      if (typeof showToast === 'function') {
        showToast('⚠️ 保存失败，存储空间可能已满', 3000);
      }
    }
  },

  // 添加任务
  addTask(task) {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
    return task;
  },

  // 删除任务
  deleteTask(id) {
    const tasks = this.getTasks();
    const filtered = tasks.filter(task => task.id !== id);
    this.saveTasks(filtered);
  },

  // 更新任务
  updateTask(id, updates) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.saveTasks(tasks);
      return tasks[index];
    }
    return null;
  },

  // 切换任务完成状态
  toggleTask(id) {
    const tasks = this.getTasks();
    const task = tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      this.saveTasks(tasks);
      return task;
    }
    return null;
  },

  // 获取番茄钟历史
  getPomodoroHistory() {
    try {
      const history = localStorage.getItem('pomodoroHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('读取番茄钟历史失败:', error);
      return [];
    }
  },

  // 添加番茄钟记录
  addPomodoroRecord(record) {
    const history = this.getPomodoroHistory();
    history.push(record);
    localStorage.setItem('pomodoroHistory', JSON.stringify(history));
  },

  // 获取成就数据
  getAchievements() {
    try {
      const achievements = localStorage.getItem('achievements');
      return achievements ? JSON.parse(achievements) : {
        streak: 0,
        lastCheckDate: null,
        totalDays: 0,
        badges: []
      };
    } catch (error) {
      console.error('读取成就数据失败:', error);
      return {
        streak: 0,
        lastCheckDate: null,
        totalDays: 0,
        badges: []
      };
    }
  },

  // 保存成就数据
  saveAchievements(achievements) {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  },

  // 获取设置
  getSettings() {
    try {
      const settings = localStorage.getItem('settings');
      return settings ? JSON.parse(settings) : {
        darkMode: false,
        pomodoroDuration: 25,
        breakDuration: 5,
        notifications: true,
        sound: true,
        vibration: true
      };
    } catch (error) {
      console.error('读取设置失败:', error);
      return {
        darkMode: false,
        pomodoroDuration: 25,
        breakDuration: 5,
        notifications: true,
        sound: true,
        vibration: true
      };
    }
  },

  // 保存设置
  saveSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
  },

  // 清除所有数据
  clearAll() {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      localStorage.clear();
      location.reload();
    }
  }
};
