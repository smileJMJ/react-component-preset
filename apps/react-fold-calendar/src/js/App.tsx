import { forwardRef, Fragment, type Ref } from 'react';
import GlobalContext from '@rfc/contexts/GlobalContext';
import ScheduleDataContext from '@rfc/contexts/ScheduleDataContext';
import Calendar from '@rfc/components/calendar/Calendar';
import Content from '@rfc/components/content/Content';
import useCalendar from '@rfc/hooks/useCalendar';
import useScheduleData from '@rfc/hooks/useScheduleData';
import type { IOption } from '@rfc/types/index';

const ReactFoldCalendar = forwardRef(({ options = {} }: { options?: IOption }, ref: Ref<HTMLDivElement>) => {
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
