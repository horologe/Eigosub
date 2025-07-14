/**
 * 各辞書ソースからの定義情報
 */
export type Item = {
  label: string;
  pos: string;
  text: string;
}

/**
 * 関連する句の情報
 */
export type Phrase = {
  w: string;
  x: string[];
  p?: string;
  i?: any; // スクリプトからは型が不明確
}

/**
 * 例文の情報
 */
export type Example = {
  e: string;
  j: string;
}

/**
 * union-body.tkh に格納されている単語エントリ全体の構造
 */
export type WordEntry = {
  word: string;
  translation?: string[];
  pronunciation?: string;
  item: Item[];

  // 活用形
  noun_plural?: string[];
  verb_singular?: string[];
  verb_present_participle?: string[];
  verb_past?: string[];
  verb_past_participle?: string[];
  adjective_comparative?: string[];
  adjective_superlative?: string[];
  adverb_comparative?: string[];
  adverb_superlative?: string[];

  // 関連語リスト
  alternative?: string[];
  parent?: string[];
  child?: string[];
  idiom?: string[];
  rephrase?: string[];
  related?: string[];
  cooccurrence?: string[];
  surface?: string[];

  // 句・例文
  phrase?: Phrase[];
  example?: Example[];

  // 語源
  etymology_prefix?: string;
  etymology_core?: string;
  etymology_suffix?: string;

  // 統計情報
  probability?: string;
  share?: string;

  // 単語習得年齢 (Age of Acquisition)
  aoa?: string;
  aoa_concept?: string;
  aoa_base?: string;
  aoa_syn?: number | string;
}

export type DictEntry = WordEntry[];