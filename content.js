class DollarRemover {
  constructor() {
    this.isEnabled = true;
    this.processedElements = new Set();
    this.originalContents = new Map();
    this.init();
  }

  async init() {
    // ストレージから有効/無効状態を取得
    const result = await chrome.storage.local.get(['enabled']);
    this.isEnabled = result.enabled !== false;
    
    // 初期処理
    if (this.isEnabled) {
      this.processCodeBlocks();
    }
    
    // DOM変更の監視
    this.observeChanges();
    
    // ストレージの変更を監視
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.enabled) {
        this.isEnabled = changes.enabled.newValue;
        if (this.isEnabled) {
          this.processCodeBlocks();
        } else {
          this.restoreAllCodeBlocks();
        }
      }
    });
  }

  observeChanges() {
    const observer = new MutationObserver(() => {
      if (this.isEnabled) {
        this.processCodeBlocks();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  processCodeBlocks() {
    // 一般的なコードブロックのセレクター
    const selectors = [
      'pre code',
      'pre',
      'code',
      '.highlight pre',
      '.language-bash',
      '.language-shell',
      '.language-terminal',
      '[class*="language-"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => this.processElement(element));
    });
  }

  processElement(element) {
    if (this.processedElements.has(element)) {
      return;
    }

    const text = element.textContent || element.innerText;
    if (!text || !this.containsDollarPrefix(text)) {
      return;
    }

    // 元のコンテンツを保存
    this.originalContents.set(element, {
      innerHTML: element.innerHTML,
      textContent: element.textContent
    });

    const processedText = this.removeDollarPrefix(text);
    
    // テキストを更新
    if (element.tagName.toLowerCase() === 'code' && element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      element.textContent = processedText;
    } else {
      // より複雑な構造の場合、テキストノードのみを更新
      this.updateTextNodes(element, text, processedText);
    }

    this.processedElements.add(element);
  }

  containsDollarPrefix(text) {
    const lines = text.split('\n');
    return lines.some(line => line.trim().startsWith('$'));
  }

  removeDollarPrefix(text) {
    return text.split('\n').map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('$ ')) {
        // $の後にスペースがある場合、$とスペースを削除
        const leadingSpaces = line.match(/^\s*/)[0];
        return leadingSpaces + line.trim().substring(2);
      } else if (trimmed === '$') {
        // $だけの行の場合、空行にする
        return '';
      }
      return line;
    }).join('\n');
  }

  updateTextNodes(element, originalText, newText) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      if (textNode.textContent.includes('$')) {
        textNode.textContent = this.removeDollarPrefix(textNode.textContent);
      }
    });
  }

  restoreElement(element) {
    const original = this.originalContents.get(element);
    if (original) {
      element.innerHTML = original.innerHTML;
      this.processedElements.delete(element);
      this.originalContents.delete(element);
    }
  }

  restoreAllCodeBlocks() {
    this.processedElements.forEach(element => {
      this.restoreElement(element);
    });
    this.processedElements.clear();
    this.originalContents.clear();
  }
}

// 拡張機能を初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DollarRemover();
  });
} else {
  new DollarRemover();
} 