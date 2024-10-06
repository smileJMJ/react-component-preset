import { createContext, useContext } from 'react';
import type { IScheduleData } from '@hooks/useScheduleData';

const ScheduleDataContext = createContext<IScheduleData | null>(null);

export const useScheduleContext = () => {
  const context = useContext(ScheduleDataContext);
  if (!context) {
    console.error('해당 context는 <ReactFoldCalendar />에서만 사용 가능합니다.');
  }
  return context;
};

export default ScheduleDataContext;
