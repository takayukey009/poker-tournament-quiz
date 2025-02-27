// questionData.ts
// 問題データの型定義
export interface Question {
  id: string;
  category: 'preflop' | 'flop' | 'turn' | 'river' | 'icm';
  title: string;
  description: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image?: string;
}

// プリフロップの問題
export const preflop: Question[] = [
  {
    id: 'preflop-1',
    category: 'preflop',
    title: 'UTGからのオープンレイズに対するアクション',
    description: 'あなたはBTN（ボタン）ポジションで、ハンドは A♥K♦です。UTGプレイヤーが3BBでオープンレイズしました。あなたのアクションは？',
    options: [
      'フォールド',
      'コール',
      '3ベット（9BB）',
      '3ベット（12BB）'
    ],
    correctAnswer: 3,
    explanation: 'AKスーテッドはプレミアムハンドであり、ポジションも良いため、12BBの3ベットが最適です。UTGのレンジは狭いですが、AKスーテッドはそのレンジに対して十分強いハンドです。',
    difficulty: 'intermediate'
  },
  {
    id: 'preflop-2',
    category: 'preflop',
    title: 'ショートスタックのプッシュに対するコール判断',
    description: 'トーナメント中盤、あなたはBB（ビッグブラインド）でJ♠J♣を持っています。UTG（10BB）がオールインプッシュしました。あなたのアクションは？',
    options: [
      'フォールド',
      'コール'
    ],
    correctAnswer: 1,
    explanation: 'JJはUTGの10BBプッシュレンジに対して十分強いハンドです。UTGのプッシュレンジは約8%程度（88+, AK, AQs）と想定され、JJはこのレンジに対して約57%のエクイティを持ちます。期待値が明らかにプラスなのでコールすべきです。',
    difficulty: 'intermediate'
  },
  {
    id: 'preflop-3',
    category: 'preflop',
    title: '3ベットポットでのプリフロップアクション',
    description: 'あなたはCO（カットオフ）で、ハンドは Q♥Q♦です。BTN（ボタン）が2.5BBでオープンし、あなたは8BBで3ベットしました。BTNは18BBで4ベットしてきました。あなたのアクションは？',
    options: [
      'フォールド',
      'コール',
      '5ベットオールイン'
    ],
    correctAnswer: 1,
    explanation: 'QQは非常に強いハンドですが、BTNの4ベットレンジはQQより強いハンド（AA, KK）を含んでいる可能性が高いです。5ベットオールインは、相手がAA, KKの場合に大きな損失となります。コールしてフロップを見ることで、ポストフロップでより多くの情報を得られます。',
    difficulty: 'advanced'
  }
];

// フロップの問題
export const flop: Question[] = [
  {
    id: 'flop-1',
    category: 'flop',
    title: 'ドライボードでのCベット判断',
    description: 'あなたはBTN（ボタン）でA♠K♣を持ち、2.5BBでオープンレイズしました。BB（ビッグブラインド）だけがコールし、フロップは 7♥4♦2♠ です。BBがチェックしました。あなたのアクションは？',
    options: [
      'チェック',
      '1/3ポットベット',
      '2/3ポットベット',
      'ポットサイズベット'
    ],
    correctAnswer: 1,
    explanation: 'このドライなボードではオーバーカードを持っているだけですが、相手のレンジにヒットしている可能性は低いです。1/3ポットサイズのCベットは、相手に簡単にフォールドさせるには十分で、かつリスクが低いベットサイズです。',
    difficulty: 'beginner'
  },
  {
    id: 'flop-2',
    category: 'flop',
    title: 'ウェットボードでのアクション',
    description: 'あなたはSB（スモールブラインド）でK♥K♠を持ち、3BBでオープンレイズしました。BB（ビッグブラインド）がコールし、フロップは J♥T♥9♦ です。あなたのアクションは？',
    options: [
      'チェック',
      '1/3ポットベット',
      '2/3ポットベット',
      'ポットサイズベット'
    ],
    correctAnswer: 2,
    explanation: 'このウェットボードではストレートやフラッシュドローが多く存在します。KKはオーバーペアで強いハンドですが、ボードの危険性を考慮すると、2/3ポットサイズのベットが適切です。これにより、ドローハンドに正しいオッズを与えず、かつバリューも取れます。',
    difficulty: 'intermediate'
  }
];

// ターンの問題
export const turn: Question[] = [
  {
    id: 'turn-1',
    category: 'turn',
    title: 'ターンでのセミブラフ判断',
    description: 'あなたはBTN（ボタン）でA♥T♥を持ち、2.5BBでオープンレイズしました。BB（ビッグブラインド）がコールし、フロップは K♥7♥3♠ です。BBがチェックし、あなたは2/3ポットベット、BBはコールしました。ターンは 9♣ です。BBが再びチェックしました。あなたのアクションは？',
    options: [
      'チェック',
      '1/3ポットベット',
      '2/3ポットベット',
      'ポットサイズベット'
    ],
    correctAnswer: 2,
    explanation: 'あなたはナッツフラッシュドローを持っており、ターンでもセミブラフとして2/3ポットベットが適切です。このベットにより、相手の弱いハンドをフォールドさせつつ、ドローが完成した場合に大きなポットを獲得できる可能性があります。',
    difficulty: 'intermediate'
  }
];

// リバーの問題
export const river: Question[] = [
  {
    id: 'river-1',
    category: 'river',
    title: 'リバーでのバリューベット判断',
    description: 'あなたはCO（カットオフ）でA♠A♣を持ち、2.5BBでオープンレイズしました。BTN（ボタン）がコールし、フロップは K♥9♦4♠ です。あなたは2/3ポットベット、BTNはコールしました。ターンは 7♣ で、あなたは2/3ポットベット、BTNは再びコールしました。リバーは 2♦ です。あなたのアクションは？',
    options: [
      'チェック',
      '1/3ポットベット',
      '2/3ポットベット',
      'ポットサイズベット'
    ],
    correctAnswer: 2,
    explanation: 'ポケットエースはこのボードで非常に強いハンドです。リバーでも2/3ポットサイズのバリューベットが適切です。相手はKxやセカンドペアなどの弱いハンドでコールしている可能性があり、それらのハンドからバリューを取ることが重要です。',
    difficulty: 'intermediate'
  }
];

// ICM問題
export const icm: Question[] = [
  {
    id: 'icm-1',
    category: 'icm',
    title: 'ファイナルテーブルでのICM判断',
    description: 'トーナメントのファイナルテーブル（6人残り）で、あなたはショートスタック（10BB）でSB（スモールブラインド）です。ハンドは A♣T♦ です。全員フォールドしてあなたのアクションになりました。賞金構成は1位$1000、2位$600、3位$400、4位$300、5位$200、6位$100です。あなたのアクションは？',
    options: [
      'フォールド',
      'ミニマムレイズ（2BB）',
      'プッシュ（オールイン）'
    ],
    correctAnswer: 2,
    explanation: 'SBからBBに対して、A♣T♦は十分強いハンドです。ショートスタック（10BB）の状況では、ミニマムレイズよりもプッシュ（オールイン）が適切です。ICMプレッシャーはありますが、このハンドと状況ではプッシュのEVが最も高いです。',
    difficulty: 'advanced'
  }
];
