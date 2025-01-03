import { useCallback, useMemo, Fragment } from 'react';
import { useGlobalContext } from '@rfc/contexts/GlobalContext';
import useSwipeable from '@rfc/hooks/useSwipeable';
import Date from '@rfc/components/calendar/Date';
import { CALC_DIR } from '@rfc/constants/calendar';
import { setMonthDateArr, setCalcMonthDateObj } from '@rfc/utils/date';
import type { IDateObj } from '@rfc/types/date';
import type { IDataByDateMap } from '@rfc/hooks/useScheduleData';

interface IMonthProps {
  dataByDateMap: IDataByDateMap;
}

const Month = ({ dataByDateMap }: IMonthProps) => {
  const { drawDate, setDrawDate } = useGlobalContext()!;
  const month = useMemo(() => drawDate?.month, [drawDate]);
  const monthDateArr = useMemo(() => setMonthDateArr(drawDate), [month]);

  const swipeCallback = useCallback((date: IDateObj) => {
    setDrawDate(date);
  }, []);

  const goPrevMonth = useCallback(() => {
    const prevDate = setCalcMonthDateObj(drawDate, CALC_DIR.MINUS);
    swipeCallback(prevDate);
  }, [drawDate]);

  const goNextMonth = useCallback(() => {
    const nextDate = setCalcMonthDateObj(drawDate, CALC_DIR.PLUS);
    swipeCallback(nextDate);
  }, [drawDate]);

  const handleSwiper = useSwipeable({
    onSwipedLeft: goNextMonth,
    onSwipedRight: goPrevMonth,
  });

  return (
    <div className="month calendar-month" {...handleSwiper}>
      {Array.isArray(monthDateArr) && monthDateArr?.length > 0 ? (
        monthDateArr?.map((weekDateArr, i) => (
          <div key={`week-${i}`} className="week">
            {weekDateArr?.map((date, j) => {
              const { year, month } = drawDate || {};
              const hasData = !!date && dataByDateMap && Array.isArray(dataByDateMap[year]) && dataByDateMap[year][month - 1][date - 1]?.length > 0;

              return <Date key={`${date}-${j}`} dateObj={{ ...drawDate, date, day: j }} hasMark={hasData} />;
            })}
          </div>
        ))
      ) : (
        <Fragment />
      )}
    </div>
  );
};

export default Month;
