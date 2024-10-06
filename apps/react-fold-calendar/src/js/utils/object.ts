// 깊은 복사 - rtk state는 Immer에서 불가변(Immutable)하게 설정되어 있어 깊은 복사 진행함
export const deepCopy = (obj: object) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  return JSON.parse(JSON.stringify(obj));
};
