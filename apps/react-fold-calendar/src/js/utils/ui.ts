import { DEFAULT_OPTION } from '@rfc/constants/common';
import type { IOption } from '@rfc/types/index';

export const setOption = (options: IOption) => {
  return { ...DEFAULT_OPTION, ...options };
};
