import { DEFAULT_OPTION } from 'react-fold-calendar/constants/common';

export const setOption = (options: IOption) => {
  return { ...DEFAULT_OPTION, ...options };
};
