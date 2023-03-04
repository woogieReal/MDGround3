export const checkEmptyValue = (val: undefined | null | string | Array<any>) => {
  if (val === undefined || val === null) {
    return true;
  }

  if (typeof val === 'string') {
    return val.trim().length === 0 ? true : false;
  }

  if (typeof val === 'object' && Array.isArray(val)) {
    return val.length === 0 ? true : false;
  }

  return false;
}