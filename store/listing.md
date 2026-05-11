# Chrome Web Store 掲載情報 — v1.3.2

> **Manabi-reader（旧 Brain Reader）** — v1.3.2 でリブランド。製品 URL も `/manabi-reader/` に移行（旧 `/brain-reader/` は 301 リダイレクトで救済予定）。配布チャネル（Chrome ウェブストア）は同一拡張のアップデートとして継続。

## 基本情報

**拡張機能名**: Manabi-reader

**要約（132文字以内）**:
```
Manabi-reader：Brain・Tips・note の長文記事をKindleのように快適に読む。目次・栞・ハイライト・進捗管理・学習カレンダー（3サイト横断）。
```

**詳細説明**:
```
Manabi-reader は、Brain（brain-market.com）/ Tips（tips.jp）/ note（note.com）の長文記事を、Kindleのように快適に学習するためのChrome拡張機能です。3サイトすべてに対応し、サイトを開くと自動でブランドが切り替わります。

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
- Markdownでエクスポート（著作権注意文言を自動付与）

📊 統計＆進捗
- 進捗バー / 既読・栞・ハイライト件数
- 学習カレンダー（3 タブ：3サイト総合 / 各サイト全記事 / この記事のみ）
- 連続学習日数（ストリーク）

🎉 ストリーク演出
- 5 日以上連続で学習するとお祝いバナー
- X（旧 Twitter）でシェア可能

🔄 Chrome Sync 対応
- 学習カレンダーは Chrome のアカウント間で同期
- 端末を変えても記録が引き継がれる

🔁 続きから再開
- 前回読んだ位置を覚えて、次回開いた時にバナーで案内

■ 対応サイト

- brain-market.com（Brain）
- tips.jp（Tips）
- note.com（note）

■ プライバシー

本拡張機能はユーザーデータを外部サーバに一切送信しません。すべてのデータはブラウザの localStorage と Chrome の同期ストレージに保存され、開発元からは見えません。

詳細：https://south-create.com/manabi-reader/privacy/

■ 著作権への配慮

ハイライトのMarkdownエクスポート出力には、私的使用目的の複製である旨と再配布・公衆送信禁止の注意文言を自動付与します。各サイトの利用規約を尊重した実装です。
```

---

## カテゴリ

- **カテゴリ**: 仕事効率化（Productivity）
- **言語**: 日本語

## Privacy policy

**公開 URL**: https://south-create.com/manabi-reader/privacy/

ストア審査の Privacy practices タブで上記 URL を入力。

## 製品ホームページ

**URL**: https://south-create.com/manabi-reader/

## バージョン情報

- **manifest.version**: 1.3.2
- **対応 Chrome**: 94 以上（ImageDecoder API は不使用、Manifest V3 対応の Chrome なら可）

## 権限の正当性（Justification 欄向け）

ストアでは要求権限の用途説明が必須。以下を貼り付け：

| 権限 | Justification |
|---|---|
| `storage` | 栞・ハイライト・学習カレンダーをユーザーの Chrome 間で同期するため。`chrome.storage.sync` のみ使用、外部送信ゼロ |
| `clipboardWrite` | 「Markdownでコピー」ボタン押下時、ハイライトまとめをクリップボードに書き出すため |
| `host_permissions`（brain-market.com / tips.jp / note.com）| 上記 3 サイトの記事ページに content script を注入し、目次・栞・既読トラッキング UI を提供するため |
| Single purpose | Manabi-reader：上記 3 サイトの長文読書を学習目的で支援する単一機能 |

## スクリーンショット要件

Chrome ストア規定：1280×800 または 640×400、PNG/JPEG、最大 5 枚。

`store/screenshots/` 配下に v1.3.2 用 5 枚を配置：

1. `01-brain-toc.png` — Brain 記事 + 目次タブ（オレンジ赤テーマ）
2. `02-tips-toc.png` — Tips 記事 + 目次タブ（黄系テーマ）
3. `03-note-toc.png` — note 記事 + 目次タブ（ティールテーマ）
4. `04-stats-calendar.png` — 統計タブ + 学習カレンダー 3 タブ
5. `05-markdown-export.png` — Markdown エクスポート結果（著作権文言付き）

## 提出 ZIP

ファイル名: `manabi-reader-v1.3.2-store.zip`

含むファイル:
- `manifest.json`
- `content.js`
- `icon16.png` / `icon32.png` / `icon48.png` / `icon128.png`

含めないもの: `test_*.mjs`, `test_fixtures_*.json`, `store/`, `README*.md`, `*.zip`（過去ビルド）, `.git*`

## 審査観点メモ

1. **Single purpose**: 3 サイトでの長文記事学習補助、という単一目的（同一機能群を異なるホストに展開）。Manifest V3 適合
2. **Privacy practices**: 取得データなし → 「I do not collect or use any user data」を選択せず、「The user data my Chrome extension uses are NOT being sold or transferred to third parties for purposes that are unrelated to the item's single purpose」にチェック
3. **Permission justification**: 上記表を全項目埋める
4. **Privacy policy URL**: 上記 URL を入力
