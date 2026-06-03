# PROGRESS

Phase: 7
Status: complete
Last: JSON-LD全6記事完了・GA4プレースホルダー全20ページ追加・commit & push
Next: Google Search Console登録（藤丸が手動）→ og-default.jpg作成（Canva 1200×630）→ Phase 8検討
Blockers: -
Updated: 2026-06-04

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
