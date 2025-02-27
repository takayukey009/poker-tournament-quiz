import { initializeQuizQuestions } from '../supabase/quizService';
import type { QuizQuestion } from '../supabase/quizService';

// サンプルデータ
const sampleQuestions: QuizQuestion[] = [
  {
    day: 1,
    title: "トーナメント序盤のスタックサイズ効果と3ベット戦略",
    category: "early",
    question: `ブラインド100/200（アンティ25）、12人テーブル、ディープスタック形式。
• あなた（100BB）はハイジャック（HJ）から A♥K♦ で2.5BBオープン。
• カットオフ（CO, 120BB）が3ベット（7BB）。
• フォールドがあなたに回ってきた。

トーナメント序盤のディープスタック状況で、このハンドをどう扱いますか？ 4ベット、コール、フォールドのどれが最も期待値が高いでしょう？`,
    solution: `• 解説
• トーナメント序盤のディープスタック時は、チップEVが重視されポジションの価値が高まる。
• AKoはプレミアムハンドだが、ポジション不利（HJ vs CO）である点に注意。
• 戦略的選択肢:
  1. 4ベット（16-18BB程度）: GTOソルバーも推奨するプレイ。相手のコール・5ベットレンジを引き出すことでバリューを取れる。
  2. コール: ディープだとポジション不利は厳しいが、ボードによってはポストフロップでバリューを得やすい。
  3. フォールド: 最も期待値が低い選択肢。AKoはあまりにも強すぎるためフォールドは非効率。

• 結論: トーナメント序盤のディープスタックなら、4ベット を推奨。スタック的に負けても再エントリー/リバイ可能期間であればアグレッシブに攻めるべき。`
  },
  {
    day: 2,
    title: "早期のアンティ効果とオープンレンジ",
    category: "early",
    question: `ブラインド100/200（アンティ25）、9人テーブル、全員70BB以上。
• あなたはUTG+1でK♥Q♠を持っている。
• UTGはフォールド。

通常のノーリミットキャッシュゲームでは、UTG+1からKQoをオープンするのはやや広めのレンジですが、トーナメントのアンティあり状況ではどう判断しますか？`,
    solution: `• 解説
• アンティの存在がプリフロップのオープンレンジに影響:
  - ノーアンティ: UTG+1からのKQoは多くのGTOレンジではフォールド推奨
  - アンティあり: レンジが広がり、KQoも含まれることが多い

• アンティの効果:
  1. ポットが最初から大きくなるため、勝率が低くてもオープンEVがプラスになりやすい
  2. スティールの価値が上がり、ポジション序盤でもプレイ可能なハンドが増える

• KQoのUTG+1オープン:
  - アンティ25/ブラインド200 = 12.5%のアンティ比率は、レンジを20-25%広げる効果がある
  - KQoはボーダーラインだが、アンティありならオープンレイズ（2.3-2.5BB）が推奨

• 結論: アンティありのトーナメント形式では2.3BBでオープンが基本戦略。ただしテーブルがタイトな傾向なら、レイズサイズは2.2BBにすることでスチール成功率を高めることも検討。`
  }
];

// データベース初期化関数
export const initializeDatabase = async () => {
  try {
    await initializeQuizQuestions(sampleQuestions);
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

// スクリプトが直接実行された場合に初期化を実行
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Initialization script failed:', error);
      process.exit(1);
    });
}
