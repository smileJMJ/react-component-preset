// 월/일 - 0을 포함한 2자리 문자열로 맞추기
export const setZeroPad = (str: string | number) => {
  return `${str}`?.padStart(2, '0');
};
