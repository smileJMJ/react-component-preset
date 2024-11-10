import { Fragment, useCallback } from 'react';
import { useGlobalContext } from 'react-fold-calendar/contexts/GlobalContext';
import { setDateObj, compareDateObj } from 'react-fold-calendar/utils/date';
import type { IDateObj } from 'react-fold-calendar/types/date';

interface IDateProps {
  dateObj: IDateObj;
  hasMark: boolean;
}

const Date = ({ dateObj, hasMark }: IDateProps) => {
  const { selectedDate, setSelectedDate } = useGlobalContext()!;
  const { date, day } = dateObj || {};
  const todayDateObj = setDateObj();
  const isToday = compareDateObj(dateObj, todayDateObj);
  const isSelectedDate = compareDateObj(dateObj, selectedDate);

  const handleClick = useCallback(() => {
    setSelectedDate(dateObj);
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
