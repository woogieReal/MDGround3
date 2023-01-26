import _ from 'lodash'

export enum ModifierKeys {
  CTRL = 'ctrlKey',
  SHIFT = 'shiftKey',
  ALT = 'altKey',
}

const checkKeyPressed = (e: React.KeyboardEvent<HTMLDivElement>, code: string, modifierKeys: ModifierKeys[]): boolean => {
  return modifierKeys.every(key => e[key]) && e.code === code;
}

export const checkPressedEnter = _.partial(checkKeyPressed, _, 'Enter', []);
export const checkPressedCtrlEnter = _.partial(checkKeyPressed, _, 'Enter', [ModifierKeys.CTRL]);
