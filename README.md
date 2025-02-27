# テキサスホールデムトーナメント問題集

モバイル向けのテキサスホールデムトーナメント問題集アプリケーションです。ポーカートーナメントの戦略を学ぶための問題を日替わりで提供します。

## 機能

- 日替わりのポーカー問題
- ダーク/ライトテーマ切り替え
- 問題と解答の表示
- モバイルフレンドリーなUI

## 技術スタック

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全な開発
- [Tailwind CSS](https://tailwindcss.com/) - スタイリング

## 開発方法

開発サーバーを起動:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開くと結果が表示されます。

## 問題の追加方法

`src/components/PokerTrainer.tsx` ファイル内の `days` 配列に新しい問題を追加できます。各問題は以下の形式で定義します:

```typescript
{
  day: 3, // 問題番号
  title: "問題のタイトル",
  category: "カテゴリー",
  question: `問題文...`,
  solution: `解答と解説...`
}
```
