import { Fragment, useMemo, useCallback } from 'react';
import { useGlobalContext } from '@contexts/GlobalContext';
import useSwipeable from '@hooks/useSwipeable';
import Date from '@components/calendar/Date';
import { CALC_DIR } from '@constants/calendar';
import { setWeekDateArr, setCalcWeekDateObj } from '@utils/date';
import type { IDateObj } from '@type/date';
import type { IDataByDateMap } from '@hooks/useScheduleData';

interface IWeekProps {
  dataByDateMap: IDataByDateMap;
}

const Week = ({ dataByDateMap }: IWeekProps) => {
  const { drawDate, setDrawDate } = useGlobalContext()!;
  const weekDateArr = useMemo(() => setWeekDateArr(drawDate), [drawDate]);

  const swipeCallback = useCallback((date: IDateObj) => {
    setDrawDate(date);
  }, []);

  const goPrevWeek = useCallback(() => {
    const prevDate = setCalcWeekDateObj(drawDate, CALC_DIR.MINUS);
    swipeCallback(prevDate);
  }, [drawDate]);

  const goNextWeek = useCallback(() => {
    const nextDate = setCalcWeekDateObj(drawDate, CALC_DIR.PLUS);
    swipeCallback(nextDate);
  }, [drawDate]);

  const handleSwiper = useSwipeable({
    onSwipedLeft: goNextWeek,
    onSwipedRight: goPrevWeek,
  });

  return (
    <div className="week calendar-week" {...handleSwiper}>
      {Array.isArray(weekDateArr) && weekDateArr?.length > 0 ? (
        weekDateArr?.map((date, i) => {
          const { year, month } = drawDate || {};
          const hasData = !!date && dataByDateMap && Array.isArray(dataByDateMap[year]) && dataByDateMap[year][month - 1][date - 1]?.length > 0;

          return <Date key={`${date}-${i}`} dateObj={{ ...drawDate, date, day: i }} hasMark={hasData} />;
        })
      ) : (
        <Fragment />
      )}
    </div>
  );
};

export default Week;
