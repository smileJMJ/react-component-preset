import { DEFAULT_OPTION } from 'react-fold-calendar/constants/common';
import type { IOption } from 'react-fold-calendar/types/index';

export const setOption = (options: IOption) => {
  return { ...DEFAULT_OPTION, ...options };
};
