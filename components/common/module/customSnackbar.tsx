import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import CustomAlert from '@/components/common/atoms/customAlert';
import _ from 'lodash';
import { checkNotUndefined } from '@/src/utils/common/commonUtil';
import { createExternalSnackBarProp, createInitialExternalSwitch, createInternaSnackBarProp, ExternalSnackBarProp, InternalSnackBarProp } from '@/src/models/snackbar';

const externalSwitch = createInitialExternalSwitch();

export const showSnackbar = (...params: Partial<ExternalSnackBarProp>) => {
  if (externalSwitch.isRender) {
    const externalProp: ExternalSnackBarProp = createExternalSnackBarProp();

    params
      .filter(checkNotUndefined)
      .forEach((param, idx) => externalProp[idx] = param)
    ;

    externalSwitch.fn({ open: true, prop: externalProp });
  }
}

export const CustomSnackbar = () => {
  const [internalProp, setInternalProp] = React.useState<InternalSnackBarProp>(createInternaSnackBarProp());

  const open = internalProp.open;
  const [guidText, severity, autoHide, autoHideDuration] = internalProp.prop;
  
  const handleClose = (event: React.SyntheticEvent<any> | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setInternalProp(createInternaSnackBarProp());
  };

  React.useEffect(() => {
    if (!externalSwitch.isRender) {
      externalSwitch.isRender = true;
      externalSwitch.fn = params => setInternalProp(params);
    }

    return () => {
      externalSwitch.isRender = false;
    }
  }, [])

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={open}
        autoHideDuration={autoHide ? autoHideDuration : null}
        onClose={handleClose}
      >
        <CustomAlert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {guidText}
        </CustomAlert>
      </Snackbar>
    </Stack>
  );
}
