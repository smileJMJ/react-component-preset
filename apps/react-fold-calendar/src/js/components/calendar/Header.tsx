import { Fragment, useCallback } from 'react';
import { useGlobalContext } from '@rfc/contexts/GlobalContext';
import { CAL_TYPE, CALC_DIR } from '@rfc/constants/calendar';
import { setCalcMonthDateObj, setCalcWeekDateObj } from '@rfc/utils/date';
import { setZeroPad } from '@rcp/react-common-preset/utils/string';
import type { IDateObj } from '@rfc/types/date';
import { ICalendar } from '@rfc/hooks/useCalendar';

const YMComponent = ({ type, l10n, drawDate, setSelectedDate }: Pick<ICalendar, 'type' | 'l10n' | 'drawDate' | 'setSelectedDate'>) => {
  const { prevMonth, nextMonth, prevWeek, nextWeek } = l10n?.calendar || {};

  const clickCallback = useCallback((date: IDateObj) => {
    setSelectedDate(date);
  }, []);

  const goPrevMonth = useCallback(() => {
    const prevDate = setCalcMonthDateObj(drawDate, CALC_DIR.MINUS);
    clickCallback(prevDate);
  }, [drawDate]);

  const goNextMonth = useCallback(() => {
    const nextDate = setCalcMonthDateObj(drawDate, CALC_DIR.PLUS);
    clickCallback(nextDate);
  }, [drawDate]);

  const goPrevWeek = useCallback(() => {
    const prevDate = setCalcWeekDateObj(drawDate, CALC_DIR.MINUS);
    clickCallback(prevDate);
  }, [drawDate]);

  const goNextWeek = useCallback(() => {
    const nextDate = setCalcWeekDateObj(drawDate, CALC_DIR.PLUS);
    clickCallback(nextDate);
  }, [drawDate]);

  return (
    <div className="rfc-header-ym">
      <h1 className="rfc-header-title">
        {setZeroPad(drawDate?.year)}.{setZeroPad(drawDate?.month)}.
      </h1>
      <div className="rfc-header-btn">
        {type === CAL_TYPE.WEEK ? (
          <Fragment>
            <button type="button" className="btn-week-minus" onClick={goPrevWeek}>
              <span className="hidden">{prevWeek}</span>
            </button>
            <button type="button" className="btn-week-plus" onClick={goNextWeek}>
              <span className="hidden">{nextWeek}</span>
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <button type="button" className="btn-month-minus" onClick={goPrevMonth}>
              <span className="hidden">{prevMonth}</span>
            </button>
            <button type="button" className="btn-month-plus" onClick={goNextMonth}>
              <span className="hidden">{nextMonth}</span>
            </button>
          </Fragment>
        )}
      </div>
    </div>
  );
};

const DayComponent = ({ l10n }: Pick<ICalendar, 'l10n'>) => {
  const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } = l10n?.calendar || {};
  const dayName = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];
  return (
    <div className="rfc-header-day">
      {dayName?.map((name, i) => (
        <div key={`${name}-${i}`} className={`${i === 0 ? 'sunday' : i === 6 ? 'saturday' : ''}`}>
          {name}
        </div>
      ))}
    </div>
  );
};

const Header = () => {
  const calendarState = useGlobalContext()!;

  return (
    <div className="rfc-header">
      <YMComponent {...calendarState} />
      <DayComponent {...calendarState} />
    </div>
  );
};

export default Header;
