// ==========================================
// 番茄钟模块
// ==========================================

const PomodoroTimer = {
  duration: 25 * 60, // 25分钟
  timeLeft: 25 * 60,
  isRunning: false,
  interval: null,
  currentTask: null,
  wakeLock: null,
  lastCompletedDots: 0,

  // 启动番茄钟
  start(task) {
    this.currentTask = task;
    const settings = Storage.getSettings();
    this.duration = settings.pomodoroDuration * 60;
    this.timeLeft = this.duration;

    // 显示番茄钟界面
    document.getElementById('pomodoroOverlay').style.display = 'flex';
    document.getElementById('pomodoroTaskName').textContent = task.title;
    
    this.updateDisplay();
    this.updateProgress();
    this.updatePomodoroStats(); // 更新统计数据
  },

  // 开始计时
  async startTimer() {
    if (this.isRunning) {
      this.pause();
      return;
    }

    this.isRunning = true;
    document.getElementById('startPomodoroBtn').textContent = '暂停';

    // 请求屏幕常亮
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.log('无法获取屏幕常亮:', err);
      }
    }

    // 启动计时器
    this.interval = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      this.updateProgress(); // 实时更新进度点

      if (this.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
  },

  // 暂停计时
  pause() {
    this.isRunning = false;
    clearInterval(this.interval);
    document.getElementById('startPomodoroBtn').textContent = '继续';

    // 释放屏幕常亮
    if (this.wakeLock) {
      this.wakeLock.release();
      this.wakeLock = null;
    }
  },

  // 完成番茄钟
  complete() {
    this.isRunning = false;
    clearInterval(this.interval);

    // 释放屏幕常亮
    if (this.wakeLock) {
      this.wakeLock.release();
      this.wakeLock = null;
    }

    // 振动反馈
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // 显示通知
    this.showNotification();

    // 保存记录
    Storage.addPomodoroRecord({
      taskId: this.currentTask.id,
      taskTitle: this.currentTask.title,
      duration: this.duration / 60,
      date: new Date().toISOString()
    });

    // 更新统计
    TaskManager.updateStats();
    this.updatePomodoroStats(); // 更新番茄钟统计

    // 提示
    showToast('🎉 番茄钟完成！休息5分钟吧~', 3000);

    // 重置
    this.reset();
  },

  // 显示通知
  showNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🍅 番茄钟完成！', {
        body: '休息5分钟吧~',
        icon: 'assets/icons/icon-192.png',
        badge: 'assets/icons/icon-192.png',
        vibrate: [200, 100, 200]
      });
    }
  },

  // 重置计时器
  reset() {
    this.timeLeft = this.duration;
    this.lastCompletedDots = 0;
    this.updateDisplay();
    this.updateProgress();
    document.getElementById('startPomodoroBtn').textContent = '开始专注';
  },

  // 更新显示
  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('pomodoroTimer').textContent = display;
  },

  // 更新进度点
  updateProgress() {
    const totalDots = 8;
    const completedDots = Math.floor((1 - this.timeLeft / this.duration) * totalDots);
    const progressContainer = document.querySelector('.pomodoro-progress');
    
    if (!progressContainer) return;
    
    // 优化：只在进度变化时更新，避免每秒都重新渲染
    if (this.lastCompletedDots === completedDots) return;
    this.lastCompletedDots = completedDots;
    
    const dots = progressContainer.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
      if (index < completedDots) {
        dot.classList.add('filled');
        dot.textContent = '●';
      } else {
        dot.classList.remove('filled');
        dot.textContent = '○';
      }
    });
  },

  // 关闭番茄钟界面
  close() {
    if (this.isRunning) {
      if (!confirm('计时正在进行中，确定要关闭吗？')) {
        return;
      }
      this.pause();
    }

    document.getElementById('pomodoroOverlay').style.display = 'none';
    this.reset();
  },

  // 更新番茄钟统计数据
  updatePomodoroStats() {
    const pomodoroHistory = Storage.getPomodoroHistory();
    const today = new Date().toDateString();
    
    // 今日番茄钟数量
    const todayPomodoros = pomodoroHistory.filter(record => {
      const recordDate = new Date(record.date).toDateString();
      return recordDate === today;
    });
    
    document.getElementById('pomodoroCount').textContent = todayPomodoros.length;
    
    // 今日专注时长（分钟）
    const focusMinutes = todayPomodoros.reduce((total, record) => {
      return total + (record.duration || 25);
    }, 0);
    
    document.getElementById('focusMinutes').textContent = focusMinutes;
  }
};

// 请求通知权限
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
