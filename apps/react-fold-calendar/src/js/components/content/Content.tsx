import { useMemo, useCallback } from 'react';
import { useGlobalContext } from 'react-fold-calendar/contexts/GlobalContext';
import { useScheduleContext } from 'react-fold-calendar/contexts/ScheduleDataContext';
import List from 'react-fold-calendar/components/content/List';
import NoData from 'react-fold-calendar/components/content/NoData';
import { setZeroPad } from '@rcp/react-common-preset/utils/string';

const Content = () => {
  const { selectedDate, l10n } = useGlobalContext()!;
  const { dataMap, dataByDateMap, getScheduleData } = useScheduleContext()!;
  const scheduleData = useMemo(() => getScheduleData(selectedDate, dataMap, dataByDateMap), [selectedDate, dataMap, dataByDateMap]);
  const { year, month, date, day } = selectedDate;

  const dayL10NName = useCallback(
    (dayIdx: number) => {
      const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } = l10n?.calendar || {};
      const dayName = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];

      return dayName[dayIdx];
    },
    [l10n]
  );

  return (
    <div className="rfc-content">
      <div className="rfc-content-title">
        <h1 className="rfc-content-date">
          {year}.{setZeroPad(month)}.{setZeroPad(date)} ({dayL10NName(day)})
        </h1>
      </div>
      {Array.isArray(scheduleData) && scheduleData?.length > 0 ? <List data={scheduleData} /> : <NoData />}
    </div>
  );
};

export default Content;
