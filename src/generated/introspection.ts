export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    ComponentUnion: ["Game", "Health", "Special"],
  },
};
export default result;
