import { forwardRef, Fragment, type Ref } from 'react';
import GlobalContext from '@contexts/GlobalContext';
import ScheduleDataContext from '@contexts/ScheduleDataContext';
import Calendar from '@components/calendar/Calendar';
import Content from '@components/content/Content';
import useCalendar from '@hooks/useCalendar';
import useScheduleData from '@hooks/useScheduleData';

const ReactFoldCalendar = forwardRef(({ options = {} }: { options: IOption }, ref: Ref<HTMLDivElement>) => {
  return (
    <GlobalContext.Provider value={useCalendar({ options })}>
      <ScheduleDataContext.Provider value={useScheduleData({ data: options?.data ?? [] })}>
        <div className="rfc-section" ref={ref}>
          <Calendar />
          {options?.useShowContent ? <Content /> : <Fragment />}
        </div>
      </ScheduleDataContext.Provider>
    </GlobalContext.Provider>
  );
});

export default ReactFoldCalendar;
