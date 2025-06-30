class PopupController {
  constructor() {
    this.enableToggle = document.getElementById('enableToggle');
    this.statusIcon = document.getElementById('statusIcon');
    this.statusText = document.getElementById('statusText');
    this.statusValue = document.getElementById('statusValue');
    
    this.init();
  }

  async init() {
    // 現在の設定を読み込み
    await this.loadSettings();
    
    // トグルの変更イベントを監視
    this.enableToggle.addEventListener('change', (e) => {
      this.updateSetting(e.target.checked);
    });

    // ストレージの変更を監視
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.enabled) {
        this.updateUI(changes.enabled.newValue);
      }
    });
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get(['enabled']);
      const isEnabled = result.enabled !== false; // デフォルトは有効
      this.updateUI(isEnabled);
      this.enableToggle.checked = isEnabled;
    } catch (error) {
      console.error('設定の読み込みに失敗しました:', error);
      this.showError();
    }
  }

  async updateSetting(enabled) {
    try {
      await chrome.storage.local.set({ enabled: enabled });
      this.updateUI(enabled);
      
      // 現在のタブに設定変更を通知
      await this.notifyCurrentTab(enabled);
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
      this.showError();
      // エラーの場合、トグルを元に戻す
      this.enableToggle.checked = !enabled;
    }
  }

  async notifyCurrentTab(enabled) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'settingChanged',
          enabled: enabled
        });
      }
    } catch (error) {
      // コンテンツスクリプトが注入されていない場合は無視
      console.log('タブへの通知をスキップしました:', error.message);
    }
  }

  updateUI(enabled) {
    if (enabled) {
      this.statusIcon.textContent = '✅';
      this.statusText.textContent = '有効';
      this.statusValue.className = 'status-value status-enabled';
    } else {
      this.statusIcon.textContent = '❌';
      this.statusText.textContent = '無効';
      this.statusValue.className = 'status-value status-disabled';
    }
  }

  showError() {
    this.statusIcon.textContent = '⚠️';
    this.statusText.textContent = 'エラー';
    this.statusValue.className = 'status-value';
  }
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});

// フォーカス時に設定を再読み込み
window.addEventListener('focus', async () => {
  const controller = new PopupController();
  await controller.loadSettings();
}); 