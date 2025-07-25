# AI概要ブロッカー

Googleなどの検索結果に自動表示されるAI要約やAI生成の回答を除外したい人向けのChrome拡張機能です。  
検索クエリに自動で `-ai` などの除外ワードを追加して、AI要約を含む結果をブロックします。  
余計なAI情報を見ずに、従来の検索結果を快適に閲覧できます。

---

## 🔧 主な機能

- Google検索でクエリに `-ai` などを自動追加
- 除外ワードは自由に編集可能（設定パネルあり）
- 有効・無効をワンクリックで切り替え可能
- シンプルで目立たないUI

---

## 🖥️ 使い方（インストール手順）

1. このリポジトリをZIPでダウンロード（右上「Code」→「Download ZIP」）
2. ZIPを解凍する
3. Chromeで `chrome://extensions/` にアクセス
4. 右上の「デベロッパーモード」をオンにする
5. 「パッケージ化されていない拡張機能を読み込む」をクリック
6. 解凍したフォルダを選択

---

## ⚙️ 除外ワードの設定方法

1. ページ右上に表示される `ON/OFF` ボタンの横にある ⚙️ アイコンをクリック
2. 除外したいキーワードをスペース区切りで入力（例：`ai gemini`）
3. 保存すると、以降の検索で自動的に `-ai -gemini` のように追加されます

---

## 🧾 ライセンス

このプロジェクトは [MITライセンス](LICENSE) のもとで公開されています。  
自由に利用・改変・再配布可能ですが、著作者クレジットの表示が必要です。

---

## 🙋‍♀️ 作者

- 🧑‍🎤 制作協力：ChatGPT（コード設計・補助）
- 🎙️ 拡張アイデア・公開：**ano(あの)**
- 🔗 [https://x.com/anone_anonymous](https://x.com/anone_anonymous)

---

## 💡 補足

今後スマホアプリもやりたいなとは思ってます
バグ報告助かります
