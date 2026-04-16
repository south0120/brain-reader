# Chrome Web Store 掲載情報

## 基本情報

**拡張機能名**: Brain Reader - 学習アシスト

**要約（132文字以内）**:
```
Brain記事をKindleのように快適に読む。目次・栞・ハイライト・メモ・進捗管理・学習カレンダー・連続学習トラッキング機能付き。
```

**詳細説明**:
```
Brain（brain-market.com）の長文記事を、Kindleのように快適に学習するためのChrome拡張機能です。

■ 主な機能

📋 目次
- 全見出しを一覧表示・検索
- 現在位置の自動追従
- 既読チェックマーク

🔖 栞（ブックマーク）
- 見出しにマウスオーバーして1クリック登録
- 後で簡単にジャンプ

🖊 ハイライト＆メモ
- 4色マーカー（黄・緑・赤・青）
- メモ付きハイライト
- Markdownでエクスポート
- ハイライトをX（旧Twitter）でシェア

📊 学習カレンダー
- 月ごとのヒートマップで学習日を可視化
- 連続学習日数トラッキング（Duolingo風）
- 🔥 連続記録をXでシェア

📈 進捗管理
- スクロール位置と既読率の自動追跡
- 前回の閲覧位置からワンクリック再開

🔄 端末間同期
- Chromeプロファイル経由で学習カレンダーを自動同期
- 複数のPC/端末で学習状況を共有

■ 特徴
- brain-market.com 専用（他のサイトには影響しません）
- 外部サーバーへのデータ送信一切なし
- 全データはブラウザ内に保存
- 軽量・高速（追加ライブラリ不使用）

■ 使い方
1. brain-market.com の記事ページを開く
2. 右端の「Brain Reader」トグルをクリック
3. サイドパネルから目次・栞・ハイライト・統計を操作

■ 初回起動
初めて使う時はインタラクティブツアーが自動で表示され、各機能を順番にガイドします。
```

---

## カテゴリ

**カテゴリ**: 仕事効率化 (Productivity)

**言語**: 日本語

---

## 画像要件

### 必須
| 種類 | サイズ | 説明 |
|------|--------|------|
| アイコン | 128×128px | ✅ 既にある（icon128.png） |
| スクリーンショット | 1280×800 or 640×400 | 最低1枚、最大5枚 |

### 推奨
| 種類 | サイズ | 説明 |
|------|--------|------|
| プロモーションタイル（小） | 440×280px | ストア検索結果に表示 |
| プロモーションタイル（大） | 920×680px | フィーチャー時に表示 |
| マーキーイメージ | 1400×560px | ストアトップに表示（任意） |

### 撮るべきスクリーンショット（5枚）

1. **サイドバー全体** — 目次タブが開いてる状態。記事本文とサイドバーが並んで見える
2. **ハイライト機能** — テキストを選択してカラーポップアップが出てる状態
3. **学習カレンダー** — ヒートマップが表示された統計タブ。連続日数が見える
4. **栞一覧** — 栞タブにいくつか登録された状態
5. **ストリーク演出** — 🔥バナーが画面中央にポップアップしてる状態

---

## 権限の説明（審査時に必要）

| 権限 | 説明文（英語で入力） |
|------|-------------------|
| `storage` | Used to sync learning activity data (calendar) across user's Chrome profile devices. No data is sent to external servers. |
| `clipboardWrite` | Used to copy highlight summaries to the clipboard in Markdown format when user clicks the export button. |
| Host permission: `brain-market.com` | The extension only runs on brain-market.com to enhance the reading experience of Brain articles. It does not access any other websites. |

---

## 公開手順

### 1. デベロッパーアカウント登録
1. https://chrome.google.com/webstore/devconsole にアクセス
2. Googleアカウントでログイン
3. デベロッパー規約に同意
4. **登録料 $5（USD）を支払い**（1回限り）

### 2. ZIPパッケージ作成
```bash
cd /Users/dev/Documents/開発部/brain-reader
zip -r ../brain-reader.zip . -x ".git/*" "store/*" "README_note.md" "設計書.md" ".gitignore"
```

### 3. アップロード
1. Developer Dashboard → 「新しいアイテム」
2. ZIPをアップロード
3. 掲載情報を入力（上記のテキストをコピペ）
4. スクリーンショットをアップロード
5. プライバシーポリシーURL を入力
6. 権限の説明を入力
7. 「審査のため送信」

### 4. プライバシーポリシーの公開
GitHubリポジトリにプライバシーポリシーをpushして、以下のURLを使う：
```
https://github.com/south0120/brain-reader/blob/main/store/privacy_policy.md
```

---

## 審査のポイント
- 説明文と実際の機能が一致していること（不一致はリジェクト原因No.1）
- スクリーンショットが実際の動作画面であること
- 権限が最小限であること（✅ storageとclipboardWriteのみ）
- brain-market.com のみにマッチすること（✅ 他サイトへのアクセスなし）
