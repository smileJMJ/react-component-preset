import { Fragment, useCallback } from 'react';
import { useGlobalContext } from '@contexts/GlobalContext';
import { setDateObj, compareDateObj } from '@utils/date';
import type { IDateObj } from '@type/date';

interface IDateProps {
  dateObj: IDateObj;
  hasMark: boolean;
}

const Date = ({ dateObj, hasMark }: IDateProps) => {
  const { selectedDate, setSelectedDate, option } = useGlobalContext()!;
  const { date, day } = dateObj || {};
  const todayDateObj = setDateObj();
  const isToday = compareDateObj(dateObj, todayDateObj);
  const isSelectedDate = compareDateObj(dateObj, selectedDate);

  const handleClick = useCallback(() => {
    setSelectedDate(dateObj);
    if (typeof option?.handleDateClick === 'function') {
      option.handleDateClick();
    }
  }, [dateObj]);

  return (
    <div className={`date ${isToday ? 'today' : ''} ${isSelectedDate ? 'selected' : ''} ${day === 0 ? 'sunday' : day === 6 ? 'saturday' : ''}`}>
      {typeof date === 'number' && date > 0 ? (
        <Fragment>
          <button type="button" onClick={handleClick} data-contents="달력_날짜_클릭">
            <strong>{date}</strong>
            {hasMark ? <div className="mark"></div> : <Fragment />}
          </button>
        </Fragment>
      ) : (
        <Fragment />
      )}
    </div>
  );
};

export default Date;
