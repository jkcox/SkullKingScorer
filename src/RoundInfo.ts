interface NumberDictionary {
  [index: string]: number;
}
interface RoundInfo {
  bids: NumberDictionary;
  tricks: NumberDictionary;
  bonus: NumberDictionary;
}

export default RoundInfo;
