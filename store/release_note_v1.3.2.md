# Release Note — v1.3.2

## ハイライト

**v1.3.2 で Manabi-reader にリブランド + tips.jp / note.com 対応 + 学習カレンダー 3 タブ（3 サイト総合 / サイト別 / この記事のみ）。**

旧称「Brain Reader」は同一拡張のアップデートとして継続。製品 URL も `https://south-create.com/manabi-reader/` に移行しました（旧 `/brain-reader/` は 301 リダイレクト予定）。

**Release date**: 2026-05-11
**Manifest version**: 1.3.2
**Source**: tag `v1.3.2`（main マージ後に切る）

## What's new since v1.1.0 (Chrome ストア最終公開版)

### v1.3.0 — Multi-site support: brain → brain + tips
- **Tips（tips.jp）対応**を追加。サイトを自動判定し、ヘッダのブランド名（BrainReader / TipsReader）と配色が自動切替
- ストレージスキーマ刷新：`brain_reader_*` → `reader_<site>_*`、横断メタを `reader_meta` に集約
- 既存 v1.2.0 ユーザーのデータは起動時に自動マイグレーション（履歴を一切失わない）
- 配色：brain は v1.1.0 と pixel-perfect 一致（白基調 + オレンジ赤）/ tips は白基調 + 黄系アクセント

### v1.3.1 — Calendar 3-tab scope
- 学習カレンダーのスコープタブを **3 段階に拡張**：
  - 3 サイト総合
  - {現在地サイト} 全記事（タブ名は閲覧中サイトで動的化）
  - この記事のみ
- スキーマ拡張：`learningDays[date].articlesBySite[siteId]` を追加し、サイト別集計を可能に
- v1.3.0 データから自動マイグレーション（`articles` → `articlesBySite.brain` に転写）
- TOC 行間タイト化：ビルトイン目次相当の密度に圧縮

### v1.3.2 — Multi-site support: + note
- **note（note.com）対応**を追加
- 配色：ティール `#41C9B4`（note 公式色）+ 白基調シャシー
- 学習カレンダー 3 タブが note でも動的にラベル切替（「note 全記事」）
- DOM 調査結果：`[data-name="body"]` セレクタで本文取得、UUID 形式の安定アンカー ID あり

## ストア更新版（このリリース）の変更点

- manifest 整理 + Manabi-reader リブランド：
  - `name` を `Manabi-reader` にリブランド（旧 `Brain / Tips / note Reader - 学習アシスト`）
  - `action.default_title` を `Manabi-reader` に統一（旧 `Reader (Brain / Tips / note)`）
  - `description` を Manabi-reader 訴求文に書き換え（3 サイト対応 + Kindle 学習体験を 1 行で表現、132 文字制限内）
  - `homepage_url` を `https://south-create.com/manabi-reader/` に変更（旧 `/brain-reader/` は 301 リダイレクト予定）
  - `version_name` 削除（ストア提出版は suffix 不要）
- Markdown エクスポート出力に **著作権・再配布禁止の注意文言を自動挿入**：
  ```
  > ※ 本ファイルは私的使用目的の複製です。著作権は各記事の著者に帰属します。
  > ※ 再配布・公衆送信は禁止されています。
  ```
- Privacy Policy 更新：3 サイト対応・各社規約配慮文言・データ削除手順を v1.3.2 に合わせて改訂
- Privacy Policy 公開 URL：https://south-create.com/manabi-reader/privacy/

## マイグレーション保証

v1.1.0 から v1.3.2 へ直接アップデートしても、既存ユーザーの栞・ハイライト・既読・学習カレンダー履歴はすべて保持されます。

- v2 マイグレーション：`brain_reader_*` → `reader_brain_*`、`br_aff_*` → `reader_meta.brainAffiliateLinks[*]`、`brain_reader_tutorial_done_v1` → `reader_meta.tutorialDoneV1`、旧 b64 形式キーは `reader_brain_legacy_*` で別プレフィックス保存
- v3 マイグレーション：`learningDays[date].articles` → `learningDays[date].articlesBySite.brain`（既存 brain データを横断スキーマに転写）

両マイグレーションとも完了マーカー（`reader_migration_v2_done` / `reader_migration_v3_done`）で二度目以降スキップ。idempotent。

## 自動テストカバレッジ

- `test_migration.mjs`：v2 マイグレーション 10 / 10 PASS（合成 + 実データ両方）
- `test_migration_v3.mjs`：v3 マイグレーション 8 / 8 PASS
- `test_site_detection.mjs`：URL 判定 12 / 12 PASS（brain × 3、tips × 3、note × 5、未対応 × 1）

## 既知の制約 / 次フェーズ申し送り

- ペイウォール記事の DOM は未検証（無料記事のみ確認済）。tips/Brain の有料記事 URL を入手次第追加対応
- tips.jp の Bootstrap scrollspy（`#navbar-spy`）と自前のスクロール検出は実機で挙動確認、競合があれば対応
