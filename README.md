# コードブロック $ 削除ツール

Webページのコードセクションから行頭の「$」を自動削除するChrome拡張機能です。

## 機能

- 📝 コードブロック内の行頭の「$」を自動検出・削除
- ⚙️ 拡張機能アイコンから有効/無効の切り替えが可能
- 🚀 シンプルで軽量な動作
- 🔄 機能を無効にすると元のテキストが復元される

## インストール方法

### 1. アイコン画像の準備

拡張機能には複数サイズのPNGアイコンが必要です。`icon.svg`をPNG形式に変換してください：

**オンライン変換ツールを使用する場合：**
- [Convertio](https://convertio.co/svg-png/)
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Online-Convert](https://image.online-convert.com/convert-to-png)

**必要なサイズ：**
- `icon16.png` - 16x16ピクセル
- `icon48.png` - 48x48ピクセル  
- `icon128.png` - 128x128ピクセル

### 2. Chrome拡張機能として読み込み

1. Chromeブラウザで `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このプロジェクトフォルダを選択

## 使用方法

### 基本的な使用

1. 拡張機能をインストール後、任意のWebページを開く
2. コードブロックが含まれるページで、行頭の「$」が自動的に削除される
3. 拡張機能を無効にすると、元のテキストが復元される

### 設定の変更

1. Chrome拡張機能アイコン（ツールバー）をクリック
2. ポップアップで「機能を有効にする」トグルスイッチを操作
3. 設定は即座に反映される（ページリロード推奨）

## 対応するコードブロック

以下のセレクターでコードブロックを検出します：

- `pre code`
- `pre` 
- `code`
- `.highlight pre`
- `.language-bash`
- `.language-shell`
- `.language-terminal`
- `[class*="language-"]`

## 技術仕様

- **Manifest Version**: 3
- **権限**: `storage`, `activeTab`
- **対応ブラウザ**: Chrome 88+

## ファイル構成

```
nodoller/
├── manifest.json      # 拡張機能の設定ファイル
├── content.js         # メイン機能（$削除・UI表示）
├── popup.html         # 拡張機能ポップアップUI
├── popup.js          # ポップアップの動作制御
├── styles.css        # UI用スタイルシート
├── icon.svg          # アイコンのSVGソース
├── icon16.png        # 16x16アイコン（要変換）
├── icon48.png        # 48x48アイコン（要変換）
├── icon128.png       # 128x128アイコン（要変換）
└── README.md         # このファイル
```

## 開発者向け情報

### カスタマイズ

- `content.js`の`selectors`配列を編集してコードブロックの検出範囲を変更
- `styles.css`でUI デザインをカスタマイズ
- `popup.html`でポップアップUIを変更

### デバッグ

1. `chrome://extensions/`でデベロッパーモードを有効化
2. 拡張機能の「詳細」→「エラー」で問題を確認
3. コンソールログで動作状況を監視

## ライセンス

MIT License

## 作者

開発者: nodoller プロジェクト

---

**注意**: この拡張機能は教育・開発目的で作成されています。重要なデータの操作前にはバックアップを取ることを推奨します。 