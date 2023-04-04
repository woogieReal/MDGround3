import { CustomSnackbar, showSnackbar } from '@/components/common/module/customSnackbar';
import * as React from 'react';

const Test = () => {
  // showSnackbar('!!!!');

  return (
    <div>
      <button onClick={() => showSnackbar('???')} >클릭해!</button>
      <CustomSnackbar />
    </div>
  ) 
}

export default Test;