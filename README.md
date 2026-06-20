# NERD is My Life — Portfolio

**URL:** https://nerd-heidi.com  
**Repository:** nerd-heidi/portfolio

## ファイル構成

```
portfolio/
├── index.html          # トップページ（11セクショングリッド）
├── style.css           # 全ページ共通スタイル
├── script.js           # インタラクション
├── CNAME               # カスタムドメイン設定
├── favorite-music.html # 01 Favorite Music
├── beat.html           # 02 Beat
├── anime.html          # 03 Anime
├── photo.html          # 04 My Photo
├── idol.html           # 05 Favorite Idol
├── work.html           # 06 Work
├── ai.html             # 07 AI
├── book.html           # 08 Favorite Book
├── game.html           # 09 Game
├── movie.html          # 10 Movie
└── food.html           # 11 Food
```

---

## GitHub Pages への公開手順

### 1. リポジトリを作成・初期化

```bash
cd portfolio/
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/nerd-heidi/portfolio.git
git push -u origin main
```

### 2. GitHub Pages を有効化

1. GitHub の `nerd-heidi/portfolio` リポジトリを開く
2. **Settings** → **Pages** を選択
3. **Source** で `Deploy from a branch` → `main` ブランチ、`/ (root)` フォルダを選択
4. **Save** をクリック

### 3. カスタムドメインを設定

1. **Settings** → **Pages** → **Custom domain** に `nerd-heidi.com` を入力して Save
2. **Enforce HTTPS** にチェックを入れる（DNS設定後に有効化可能）

### 4. DNS 設定（ドメイン管理会社で設定）

**A レコード**（4つすべて追加）:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**CNAME レコード**（www サブドメイン用）:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | nerd-heidi.github.io |

> DNS の反映には最大 24〜48 時間かかる場合があります。

---

## コンテンツの編集方法

各カテゴリページの `item-card` 内の以下を実際の内容に書き換えてください：

- **`h3`** → タイトル（アーティスト名、ゲームタイトルなど）
- **`p`** → 説明文
- **`img src`** → 実際の画像URL（またはローカル画像パス）
- **`span.tag`** → タグラベル

### 画像をローカルで使う場合

```
portfolio/
└── images/
    ├── music-01.jpg
    ├── game-01.jpg
    └── ...
```

HTML の `src` を `images/music-01.jpg` のように変更してください。

---

## 更新・再デプロイ

```bash
git add .
git commit -m "update content"
git push
```

`main` ブランチに push すると自動で GitHub Pages に反映されます。
