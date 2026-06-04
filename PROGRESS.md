# PROGRESS

Phase: 8 + 全体品質修正
Status: in_progress
Last: 【品質修正】ルート絶対パス崩壊を全面修正 — nav/footer/本文の内部リンク335件を深さ別相対パス化（全22ページ）＋manifest/sw/main.jsのPWA基盤を相対化（基準自動検出）＋sitemapにitinerary・法務3ページ追加。GitHub Pagesサブパス配信でnav全404・SW登録失敗だった土台バグを解消。
Next: （次セッション）serena導入→ UI/アクセシビリティ深掘り（frontend-design→ui-ux-pro-max）を1スキルずつ。残: og-default.jpg(PNG・藤丸/Canva)、404.html深層パス時の相対リンク制約（既知・低優先）
Blockers: og-default.jpg未作成（社会的シェア画像）/ Wise住所エラー（Phase 6収益化の前提）
Updated: 2026-06-04

## 全体品質修正セッション（2026-06-04）
- [x] コードベース全体把握（21 HTMLページ+共通CSS/JS+PWA一式）
- [x] **critical**: ルート絶対パス→相対パス（335リンク/22ファイル・深さ別 ./・../・../../）
- [x] manifest.json start_url/icons 相対化
- [x] sw.js PRECACHE 相対化・v2→v3・itinerary/法務ページ追加
- [x] main.js SW登録を manifest-link 基準の base-path 非依存方式に
- [x] robots.txt 確認（Disallowなし=E-E-A-Tページ公開済み・対応不要）
- [x] sitemap.xml 網羅補完（itinerary + privacy/terms/affiliate-disclosure）
- [x] JSON-LD </script> エスケープバグ検査 → 検出なし（手書きで安全）
- [ ] UI/デザイン原則準拠の深掘り（青緑・66ch・Progressive Disclosure）
- [ ] アクセシビリティAAA 監査（コントラスト比・キーボード・スクリーンリーダー）
- [ ] code-modernization レビュー
- [ ] webapp-testing/playwright（※「ブラウザで確認して」指示時のみ）
- 注: serena未ロードのためnativeツール（Glob/Grep/Read）で実施

## Phase 6: スキップ（Wise住所エラー未解決）

## Phase 7 チェックリスト
- [x] sitemap.xml 作成（全20ページ）
- [x] robots.txt 作成
- [x] OGP メタタグ — index.html・全6記事（og:url/image/site_name/twitter:card）
- [x] JSON-LD — index.html（WebSite）・how-to-call-waiter（Article+BreadcrumbList）
- [x] JSON-LD — 残5記事（konbini・train・toilet・manners・food-guide）
- [x] Plausible / GA4 スクリプトプレースホルダー追加（全20ページ、コメントアウト済み）
- [x] manifest.json SVGアイコン修正（PNG参照 → SVG）
- [x] icons/icon-192.svg・icon-512.svg 作成
- [x] assets/og-default.svg 作成（⚠️ og:imageはPNG必須 → Canvaで1200×630 PNG要作成）
- [ ] Google Search Console 登録（藤丸が手動）
- [ ] Pinterest 用画像テンプレート指針（Canva）

## 記事文体修正（完了）
- [x] how-to-call-waiter / konbini / train / manners / toilet / food-guide

---

# Code Audit Report — /code-audit

**Project**: Static HTML/CSS/JS travel guide (GitHub Pages)
**Scope**: Full project `C:\Users\Lenovo\sumimasen`
**Findings**: 8 total (2 high, 4 medium, 2 low)

---

## High Priority

### Security / Assets
- [HIGH] `og:image` references `/assets/og-default.jpg` (PNG) which does not exist — social shares show broken image — all article pages
- [HIGH] `manifest.json` referenced `/icons/icon-192.png` and `/icons/icon-512.png` (PNG) which did not exist — PWA install fails silently — `manifest.json:11-20` *(fixed: updated to SVG)*

## Medium Priority

### Duplication
- [MEDIUM] Nav/footer HTML duplicated across ~21 static pages — no shared include mechanism (inherent to static HTML; consider 11ty/SSG in Phase 8) — `index.html`, `phrases/index.html`, all article/area/tool pages
- [MEDIUM] `sw.js` PRECACHE list only covers 5 URLs; 15+ pages added since Phase 1 are not precached — offline support is incomplete — `sw.js:3-8`

### SEO
- [MEDIUM] JSON-LD structured data only on 2/7 article pages — remaining 5 articles have no Article schema — `articles/konbini/`, `train/`, `toilet/`, `manners/`, `food-guide/`
- [MEDIUM] `robots.txt` Disallows `/privacy-policy/`, `/terms-of-use/`, `/affiliate-disclosure/` — these contain E-E-A-T signals (FTC disclosure, operator info) that help trust; consider re-enabling — `robots.txt:4-6`

## Low Priority

### Configuration
- [LOW] `sitemap.xml` base URL hardcoded as `nijimaru-dev.github.io/sumimasen` — TODO comment present but easy to forget when domain is acquired — `sitemap.xml:2`
- [LOW] `assets/og-default.svg` created as placeholder — Twitter/Facebook require PNG for og:image; SVG will not render in social previews — `assets/og-default.svg`

---

# Implementation Plan

## Quick Wins (< 30 min each)
| # | Finding | File(s) | Fix |
|---|---------|---------|-----|
| 1 | robots.txt blocking E-E-A-T pages | `robots.txt:4-6` | Remove Disallow for legal pages; only block /tools/ if desired |
| 2 | JSON-LD missing on 5 articles | `articles/*/index.html` | Add Article+BreadcrumbList JSON-LD (same pattern as waiter article) |
| 3 | og:image PNG missing | `assets/` | Export 1200×630 PNG from Canva; save as `assets/og-default.jpg` |

## Medium Effort (30 min - 2 hours each)
| # | Finding | File(s) | Fix |
|---|---------|---------|-----|
| 1 | sw.js incomplete precache | `sw.js` | Update PRECACHE array with all current page URLs |
| 2 | Nav/footer duplication | all HTML pages | Phase 8: migrate to 11ty or similar SSG for templating |

## Suggested Fix Order
1. **Quick Wins**: JSON-LD on remaining articles + og:image PNG (unblocks social sharing)
2. **sw.js**: Update precache list (unblocks full offline support)
3. **Phase 8**: SSG migration for nav/footer (architectural — separate phase)

## Verification
- [ ] Open each article in Twitter Card Validator — og:image shows correctly
- [ ] Open site in Chrome DevTools Application → Manifest — icons load
- [ ] Open site offline — key pages (phrases, articles) load from cache
