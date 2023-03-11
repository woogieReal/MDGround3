import { AlertColor } from '@mui/material/Alert';
import _ from 'lodash';

export type ExternalSnackBarProp = [string, AlertColor, boolean, number];
const INITIAL_EXTERNAL_SNACK_BAR_PROP: ExternalSnackBarProp = ['', 'success', true, 3000];
export const createExternalSnackBarProp = _.constant(INITIAL_EXTERNAL_SNACK_BAR_PROP);


export type InternalSnackBarProp = {
  open: boolean;
  prop: ExternalSnackBarProp
}
const INITIAL_INTERNAL_SNACK_BAR_PROP: InternalSnackBarProp = {
  open: false,
  prop: createExternalSnackBarProp(),
}
export const createInternaSnackBarProp = _.constant(INITIAL_INTERNAL_SNACK_BAR_PROP);


export type ExternalSwitch = {
  isRender: boolean;
  fn: (params: InternalSnackBarProp) => void
}
const INITIAL_EXTERNAL_SWITCH: ExternalSwitch = {
  isRender: false,
  fn: (params: InternalSnackBarProp): void => undefined,
}
export const createInitialExternalSwitch = _.constant(INITIAL_EXTERNAL_SWITCH);
