type AllType = 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined'

export const checkEmptyValue = (val: undefined | null | string | Array<any> | object) => {
  if (val === undefined || val === null) {
    return true;
  }

  if (typeof val === 'string') {
    return val.trim().length === 0 ? true : false;
  }

  if (typeof val === 'object') {
    return Object.keys(val).length === 0 ? true : false;
  }

  return false;
}

export const checkNotBigint = (val: any): val is Exclude<any, 'bigint'> => typeof val !== 'bigint'
export const checkNotBoolean = (val: any): val is Exclude<any, 'boolean'> => typeof val !== 'boolean'
export const checkNotFunction = (val: any): val is Exclude<any, 'function'> => typeof val !== 'function'
export const checkNotNumber = (val: any): val is Exclude<any, 'number'> => typeof val !== 'number'
export const checkNotObject = (val: any): val is Exclude<any, 'object'> => typeof val !== 'object'
export const checkNotString = (val: any): val is Exclude<any, 'string'> => typeof val !== 'string'
export const checkNotSymbol = (val: any): val is Exclude<any, 'symbol'> => typeof val !== 'symbol'
export const checkNotUndefined = (val: any): val is Exclude<any, 'undefined'> => typeof val !== 'undefined'