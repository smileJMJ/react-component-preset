import { useMemo } from 'react';
import { useGlobalContext } from '@contexts/GlobalContext';
import { useScheduleContext } from '@contexts/ScheduleDataContext';
import List from '@components/content/List';
import NoData from '@components/content/NoData';

const Content = () => {
  const { selectedDate } = useGlobalContext()!;
  const { dataMap, dataByDateMap, getScheduleData } = useScheduleContext()!;
  const scheduleData = useMemo(() => getScheduleData(selectedDate, dataMap, dataByDateMap), [selectedDate, dataMap, dataByDateMap]);

  return <div className="rfc-content">{Array.isArray(scheduleData) && scheduleData?.length > 0 ? <List data={scheduleData} /> : <NoData />}</div>;
};

export default Content;
