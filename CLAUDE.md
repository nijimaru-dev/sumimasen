# CLAUDE.md — Sumimasen

## 最初に必ずやること
1. Notion設計ノートを読む: https://app.notion.com/p/373a4c2a1e9b813c96accf6806741b38
2. PROGRESS.mdを読んで現在地を確認する
3. 対策室（設計ノート内）を確認してから着手する

## Notion連携（必須）
- Phase完了時: PROGRESS.mdをNotionに書き戻す
- 設計の疑問: Notionを読んで判断。それでも不明なら停止して藤丸に確認
- 詳細設計は全てNotionにある。このファイルには書かない

## 実行ルール
- 1セッション1Phase（絶対に詰め込まない）
- コンテキスト50%超で /compact
- Phase完了: PROGRESS.md更新 → git commit → /compact
- 同じ修正を3回繰り返したら停止して報告

## 承認必須（必ず止まれ）
- ファイル・リポジトリの削除
- 外部サービスへの課金
- 公開設定の変更
- 確定済み設計の変更

## 環境
- PowerShell: $env:USERPROFILE 使用、コマンドは1行ずつ
- CSSパス: /css/style.css ではなく ../css/style.css を使う
- GitHub Pages: nijimaru-dev/sumimasen（Public）

## チーム
- 藤丸（CEO）: 最終承認
- 参謀（Claude.ai）: 設計判断
- クロコ（Claude Code）: 実装（= あなた）
- アングラ（Antigravity）: ドキュメント（Windowsバグ制限中）
