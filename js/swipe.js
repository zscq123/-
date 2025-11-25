// ==========================================
// 滑动手势检测模块
// ==========================================

class SwipeDetector {
  constructor() {
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.currentElement = null;
    this.threshold = 100; // 滑动距离阈值
    this.restraint = 50;  // 垂直方向限制
    this.allowedTime = 500; // 最大滑动时间
  }

  /**
   * 为任务列表添加滑动手势
   */
  init() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    taskList.addEventListener('touchstart', (e) => {
      // 如果点击的是按钮，不处理滑动
      if (e.target.closest('.task-complete') || e.target.closest('.pomodoro-trigger')) {
        return;
      }

      const card = e.target.closest('.task-card');
      if (!card) return;

      const touch = e.touches[0];
      this.startX = touch.clientX;
      this.startY = touch.clientY;
      this.startTime = Date.now();
      this.currentElement = card;
      
      // 添加过渡效果
      card.style.transition = 'none';
    });

    taskList.addEventListener('touchmove', (e) => {
      if (!this.currentElement) return;

      const touch = e.touches[0];
      const distX = touch.clientX - this.startX;
      const distY = touch.clientY - this.startY;

      // 垂直滑动超过限制，取消水平滑动
      if (Math.abs(distY) > this.restraint) {
        this.resetCard();
        return;
      }

      // 水平滑动时阻止默认行为（防止页面滚动）
      if (Math.abs(distX) > 10) {
        e.preventDefault();
        
        // 左滑显示红色删除背景
        if (distX < 0) {
          this.currentElement.style.transform = `translateX(${distX}px)`;
          this.currentElement.style.backgroundColor = 'rgba(255, 59, 48, 0.1)';
        }
        // 右滑显示绿色完成背景
        else if (distX > 0) {
          this.currentElement.style.transform = `translateX(${distX}px)`;
          this.currentElement.style.backgroundColor = 'rgba(52, 199, 89, 0.1)';
        }
      }
    });

    taskList.addEventListener('touchend', (e) => {
      if (!this.currentElement) return;

      const touch = e.changedTouches[0];
      const distX = touch.clientX - this.startX;
      const distY = touch.clientY - this.startY;
      const elapsedTime = Date.now() - this.startTime;

      // 恢复过渡效果
      this.currentElement.style.transition = 'transform 0.3s ease, background-color 0.3s ease';

      // 检查是否是有效滑动
      if (elapsedTime <= this.allowedTime && Math.abs(distY) < this.restraint) {
        // 左滑删除
        if (distX < -this.threshold) {
          this.handleSwipeLeft(this.currentElement);
          return;
        }
        // 右滑完成
        else if (distX > this.threshold) {
          this.handleSwipeRight(this.currentElement);
          return;
        }
      }

      // 未达到阈值，恢复原位
      this.resetCard();
    });
  }

  /**
   * 左滑删除
   */
  handleSwipeLeft(card) {
    const taskId = parseInt(card.dataset.id);
    const self = this; // 保存this引用
    
    // 滑动到左侧消失
    card.style.transform = 'translateX(-100%)';
    card.style.opacity = '0';
    
    // 振动反馈
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // 300ms后删除
    setTimeout(() => {
      if (confirm('确定要删除这个任务吗？')) {
        Storage.deleteTask(taskId);
        showToast('🗑️ 任务已删除');
        TaskManager.renderTasks();
        TaskManager.updateStats();
      } else {
        // 取消删除，恢复卡片
        card.style.transform = 'translateX(0)';
        card.style.opacity = '1';
        card.style.backgroundColor = '';
        self.currentElement = null;
      }
    }, 300);
  }

  /**
   * 右滑完成
   */
  handleSwipeRight(card) {
    const taskId = parseInt(card.dataset.id);
    const task = Storage.getTasks().find(t => t.id === taskId);
    
    // 如果已完成，提示
    if (task && task.completed) {
      showToast('⚠️ 任务已完成', 2000);
      this.resetCard();
      return;
    }

    // 滑动到右侧消失
    card.style.transform = 'translateX(100%)';
    card.style.opacity = '0';
    
    // 振动反馈
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }

    // 300ms后标记完成
    setTimeout(() => {
      TaskManager.toggleComplete(taskId);
    }, 300);
  }

  /**
   * 重置卡片位置
   */
  resetCard() {
    if (this.currentElement) {
      this.currentElement.style.transform = 'translateX(0)';
      this.currentElement.style.backgroundColor = '';
      this.currentElement = null;
    }
  }
}

// 创建全局实例
const swipeDetector = new SwipeDetector();
