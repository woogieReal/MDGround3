export const removeTargetIndexDataFromArray = (trees: any[], targetIndex: number) => {
  return trees.filter((tree: any, index: number) => index !== targetIndex);
}
