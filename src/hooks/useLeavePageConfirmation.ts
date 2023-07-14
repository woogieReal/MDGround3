import { useEffect } from 'react';

/**
 * Inspiration from: https://stackoverflow.com/a/70759912/2592233
 */
export const useLeavePageConfirmation = (shouldPreventLeaving: boolean) => {
  useEffect(() => {
    const originalOnBeforeUnloadFunction = window.onbeforeunload;

    console.log(shouldPreventLeaving, window.onbeforeunload);

    if (shouldPreventLeaving) {
      window.onbeforeunload = () => {
        return ''
      };
    } else {
      window.onbeforeunload = originalOnBeforeUnloadFunction;
    }

    /*
     * When the component is unmounted, the original change function is assigned back.
     */
    return () => {
      window.onbeforeunload = originalOnBeforeUnloadFunction;
    };
  }, [shouldPreventLeaving]);
};