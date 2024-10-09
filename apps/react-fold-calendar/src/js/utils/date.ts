import { setZeroPad } from '../../../../../packages/react-common-preset/src/js/utils/string';
import { DAY_LENGTH, CALC_DIR, MAX_MONTH, MIN_MONTH } from '@constants/calendar';
import type { IDateObj } from '@type/date';

// year값에 따른 월별 총 일수 반환 (윤달 계산)
export const getAllDateArr = (year: number) => {
  const isYoundal = (year % 4 == 0 && year % 100 !== 0) || year % 400 == 0;

  return [31, isYoundal ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};

// 해당 월 1일 yy-mm-dd로 변환
export const getYMDFirstDate = (year: number, month: number) => {
  return `${year}-${setZeroPad(month)}-${setZeroPad(1)}`;
};

// 해당 월 마지막일 yy-mm-dd로 변환
export const getYMDLastDate = (year: number, month: number) => {
  const lastDate = month >= 1 ? getAllDateArr(year)[month - 1] : 0;
  return `${year}-${setZeroPad(month)}-${setZeroPad(lastDate)}`;
};

// 요일 반환
const getDay = (value: IDateObj) => {
  const { year, month, date } = value || {};
  return year && month && date ? new Date(`${year}/${month}/${date}`)?.getDay() : 0;
};

// 주 계산
const getWeek = (ymdDateObj: Omit<IDateObj, 'day' | 'week'>) => {
  const { year, month, date } = ymdDateObj || {};
  const firstDay = getFirstDay(year, month);
  return Math.ceil((date + firstDay) / DAY_LENGTH); // 해당 월의 1일의 요일을 더해서 나눠야 달력 그릴 때 오차가 생기지 않음
};

// dateObj로 변환
export const setDateObj = (value?: string | number) => {
  const d = !value ? new Date() : new Date(value);
  const year = d?.getFullYear();
  const month = d?.getMonth() + 1;
  const date = d?.getDate();
  const day = d?.getDay();

  return {
    year,
    month,
    date,
    day,
  };
};

// 동일한 날짜인지 dateObj 비교
export const compareDateObj = (dateObjA: IDateObj, dateObjB: IDateObj) => {
  const dateA = `${dateObjA?.year}.${dateObjA?.month}.${dateObjA?.date}`;
  const dateB = `${dateObjB?.year}.${dateObjB?.month}.${dateObjB?.date}`;
  return dateA === dateB;
};

// 해당 월 1일 요일 인덱스 반환
const getFirstDay = (year: number, month: number) => {
  if (!year || !month) {
    return 0;
  }

  return new Date(year, month - 1, 1)?.getDay();
};

// 달력 그리기(주, 일요일부터 시작)
export const setWeekDateArr = (value: IDateObj, week?: number) => {
  const { year, month } = value;
  const allDateCount = getAllDateArr(year)[month - 1];
  const firstDay = getFirstDay(year, month);
  const weekDateArr: number[] = [];

  week = week || getWeek(value);

  for (let day = 0; day < DAY_LENGTH; day++) {
    // 일(date)
    const weekDate = 1 + (week - 1) * DAY_LENGTH - firstDay + day;
    weekDateArr[day] = weekDate < 1 || weekDate > allDateCount ? 0 : weekDate;
  }

  return weekDateArr;
};

// 달력 그리기(월)
export const setMonthDateArr = (value: IDateObj) => {
  const { year, month } = value;
  const allDateCount = getAllDateArr(year)[month - 1];
  const allWeek = getWeek({ year, month, date: allDateCount });
  const monthDateArr: number[][] = [];

  for (let week = 1; week <= allWeek; week++) {
    // 주(week)
    monthDateArr[week - 1] = setWeekDateArr(value, week);
  }

  return monthDateArr;
};

// 월 +/- 계산
export const setCalcMonthDateObj = (value: IDateObj, dir: (typeof CALC_DIR)[keyof typeof CALC_DIR]) => {
  const { year, month } = value;
  let calcYear = year;
  let calcMonth = dir === CALC_DIR.MINUS ? month - 1 : month + 1;

  if (calcMonth > MAX_MONTH) {
    calcYear++;
    calcMonth = MIN_MONTH;
  } else if (calcMonth < MIN_MONTH) {
    calcYear--;
    calcMonth = MAX_MONTH;
  }

  return {
    ...value,
    year: calcYear,
    month: calcMonth,
    date: 1,
  };
};

// 주 +/- 계산
export const setCalcWeekDateObj = (value: IDateObj, dir: (typeof CALC_DIR)[keyof typeof CALC_DIR]) => {
  const { year, month, date } = value;
  const day = getDay(value);
  let calcYear = year;
  let calcMonth = month;
  let allDateCount = getAllDateArr(year)[month - 1];
  let calcDate = dir === CALC_DIR.MINUS ? date - DAY_LENGTH : date + DAY_LENGTH;
  const weekFirstDate = calcDate - day;

  if (calcDate > allDateCount) {
    calcDate = allDateCount;

    if (weekFirstDate > allDateCount) {
      // 다음달로 변경
      calcMonth++;
      if (calcMonth > MAX_MONTH) {
        calcYear++;
        calcMonth = MIN_MONTH;
      }
      calcDate = 1;
    }
  } else if (calcDate < 1) {
    calcDate = 1;

    if (weekFirstDate < 1) {
      // 이전달로 변경
      calcMonth--;
      if (calcMonth < MIN_MONTH) {
        calcYear--;
        calcMonth = MAX_MONTH;
      }
      allDateCount = getAllDateArr(calcYear)[calcMonth - 1];
      calcDate = allDateCount;
    }
  }

  return {
    ...value,
    year: calcYear,
    month: calcMonth,
    date: calcDate,
  };
};
