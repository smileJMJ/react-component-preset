import { useEffect, useCallback } from 'react';
import Header from '@components/calendar/Header';
import Month from '@components/calendar/Month';
import Week from '@components/calendar/Week';
import { useGlobalContext } from '@contexts/GlobalContext';
import { useScheduleContext } from '@contexts/ScheduleDataContext';
import { CAL_TYPE } from '@constants/calendar';

const Calendar = () => {
  const { l10n, type, selectedDate, setType, setDrawDate } = useGlobalContext()!;
  const { dataByDateMap } = useScheduleContext()!;

  // 선택한 날짜가 변경되면 달력을 그리는 drawDate(focus date)도 변경하도록
  useEffect(() => {
    setDrawDate(selectedDate);
  }, [selectedDate]);

  const btnClickCallback = useCallback(() => {
    setType(type === CAL_TYPE.WEEK ? CAL_TYPE.MONTH : CAL_TYPE.WEEK);
  }, [type]);

  return (
    <section className="rfc-calendar">
      <Header />
      <div className="rfc-calendar-content">{type === CAL_TYPE.WEEK ? <Week dataByDateMap={dataByDateMap} /> : <Month dataByDateMap={dataByDateMap} />}</div>
      <div className="rfc-calendar-btn">
        <button type="button" className={`btn-calendar ${type === CAL_TYPE.WEEK ? 'fold' : ''}`} onClick={btnClickCallback} data-contents="달력_달력확장_클릭">
          <span className="hidden">{l10n?.calendar?.btnCalendarText}</span>
          <span className="btn-calendar-icon"></span>
        </button>
      </div>
    </section>
  );
};

export default Calendar;
