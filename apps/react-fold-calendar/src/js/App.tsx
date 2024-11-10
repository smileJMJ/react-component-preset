import { forwardRef, Fragment, type Ref } from 'react';
import GlobalContext from 'react-fold-calendar/contexts/GlobalContext';
import ScheduleDataContext from 'react-fold-calendar/contexts/ScheduleDataContext';
import Calendar from 'react-fold-calendar/components/calendar/Calendar';
import Content from 'react-fold-calendar/components/content/Content';
import useCalendar from 'react-fold-calendar/hooks/useCalendar';
import useScheduleData from 'react-fold-calendar/hooks/useScheduleData';

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
