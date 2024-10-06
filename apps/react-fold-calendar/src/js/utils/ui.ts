import { DEFAULT_OPTION } from '@constants/common';

export const setOption = (options: IOption) => {
  return { ...DEFAULT_OPTION, ...options };
};
