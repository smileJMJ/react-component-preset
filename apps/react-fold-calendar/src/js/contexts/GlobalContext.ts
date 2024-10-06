import { createContext, useContext } from 'react';
import { ICalendar } from '@hooks/useCalendar';

const GlobalContext = createContext<ICalendar | null>(null);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    console.error('해당 context는 <ReactFoldCalendar />에서만 사용 가능합니다.');
  }
  return context;
};

export default GlobalContext;
