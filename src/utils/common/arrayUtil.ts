export const removeTargetIndexDataFromArray = (trees: any[], targetIndex: number) => {
  return trees.filter((tree: any, index: number) => index !== targetIndex);
}

export const getEmptyArrayIfNotArray = (target: any) => {
  return Array.isArray(target) ? target : [];
}