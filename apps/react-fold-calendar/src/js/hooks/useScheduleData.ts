import { useEffect, useState, useCallback } from 'react';
import { getAllDateArr, setDateObj } from 'react-fold-calendar/utils/date';
import { CATEGORY } from 'react-fold-calendar/constants/data';
import type { IDateObj } from 'react-fold-calendar/types/date';

export interface IDataItem {
  startDate: string | number; // string: ISO, number: timestamp
  endDate: string | number;
  title: string;
  id?: string | number;
  description?: string;
  category?: string; // 카테고리. (shedule(default): 일정, holiday: 공휴일 등, 개인 커스텀 가능)
  period?: number; // 반복 주기 (0(default): 반복 없음, 1 ~ : 해당 일수만큼 반복)
}

// 데이터 가공 - 년도별 월/일에 해당하는 데이터 목록
export interface IDataByDateMap {
  [year: number]: string[][][];
}

// 데이터 가공 - 원본 데이터를 별도 id를 붙인 데이터로 가공
export interface IDataMap {
  [id: string]: IDataItem | null;
}

export interface IScheduleData {
  dataMap: IDataMap; // api 응답 데이터를 {['카테고리id-아이템id']: 데이터} 해시맵 구조로 변경한 데이터
  dataByDateMap: IDataByDateMap; // 일별 노출할 데이터의 키값을 모아둔 배열 데이터
  setDataMap: React.Dispatch<React.SetStateAction<IDataMap>>;
  setDataByDateMap: React.Dispatch<React.SetStateAction<IDataByDateMap>>;
  resetData: () => void;
  getScheduleData: (selectedDate: IDateObj, dataMap: IDataMap, dataByDateMap: IDataByDateMap) => IDataItem[][] | null;
}

const useScheduleData = ({ data }: { data: IDataItem[] }): IScheduleData => {
  // TODO. 지금은 옵션 필드로 data를 받고 있으나, 추후에 fetch 기능 추가하기
  const [dataMap, setDataMap] = useState<IScheduleData['dataMap']>({});
  const [dataByDateMap, setDataByDateMap] = useState<IScheduleData['dataByDateMap']>({});

  console.log('== dataMap ==', dataMap);
  console.log('== dataByDateMap ==', dataByDateMap);

  useEffect(() => {
    const { dataMap, dataByDateMap } = setDataByDate(data);
    setDataMap(dataMap);
    setDataByDateMap(dataByDateMap);
  }, []);

  // dataMap & dataByDateMap 초기화
  const resetData = useCallback(() => {
    setDataMap({});
    setDataByDateMap({});
  }, []);

  // data 가공
  const setItemData = useCallback((item: IDataItem) => {
    return item && typeof item === 'object' ? { ...item, period: item?.period ?? 0, category: item?.category ?? CATEGORY.SCHEDULE } : ({} as IDataItem);
  }, []);

  // 컨텐츠 중 현재 월에 해당하는 데이터 추출 및 가공
  const setYearEmptyData = useCallback((year: number) => {
    if (!year) {
      return [];
    }

    const allDate = getAllDateArr(year);
    const yearEmptyData: string[][][] = [];

    allDate?.forEach((dateLng) => {
      const stringArr = new Array(dateLng).fill([]);
      yearEmptyData?.push(stringArr);
    });

    return yearEmptyData;
  }, []);

  const setUniqueItemId = useCallback((data: IDataItem) => {
    const { startDate, endDate, title } = data ?? {};
    return `${startDate}-${endDate}-${title}`;
  }, []);

  /*
        월 데이터에 contentItem object를 전부 복사해서 넣지 말고, 
        SCHEDULE-{고유id값} 과 같이 {category}-{고유id값} 로 id값을 만들어,
        해당 id값의 배열을 월 데이터에 넣어서 해시맵으로 만들기

        (ex) 2024.10월 데이터 = [[], [], ... [['SCHEDULE-id1', 'SCHEDULE-id12']... 31일], ...] // 12개월
            content데이터 가공 = 원본 데이터 -> {'SCHEDULE-id1': {}}
*/
  const setDataId = useCallback((depth1Id: string, depth2Id?: string) => {
    return `${depth1Id}${typeof depth2Id === 'string' ? `-${depth2Id}` : ''}`;
  }, []);

  // 년/월/일 단위의 array 구조로 가공함
  const addDateByDataMap = useCallback(({ dataByDateMap, mapId, startDate, endDate, period }: { dataByDateMap: IDataByDateMap; mapId: string } & IDataItem) => {
    if (!dataByDateMap || !mapId) {
      return dataByDateMap;
    }

    const { year: startDateYear, month: startDateMonth, date: startDateDate } = setDateObj(startDate);
    const { year: endDateYear, month: endDateMonth, date: endDateDate } = setDateObj(endDate);

    for (let y = startDateYear; y <= endDateYear; y++) {
      if (!dataByDateMap[y]) {
        dataByDateMap[y] = setYearEmptyData(y);
      }

      const startMonthInThisYear = startDateYear === y ? startDateMonth : 1;
      const endMonthInThisYear = endDateYear === y ? endDateMonth : 12;

      for (let m = startMonthInThisYear; m <= endMonthInThisYear; m++) {
        const scheduleStartDate = startDateYear === y && m === startDateMonth ? startDateDate : 1;
        const scheduleEndDate = endDateYear === y && m === endDateMonth ? endDateDate : dataByDateMap[y][m - 1]?.length;

        for (let d = scheduleStartDate; d <= scheduleEndDate; d++) {
          const gap = d - scheduleStartDate;
          if (period! > 2 && gap % period! !== 0) {
            continue;
          }

          dataByDateMap[y][m - 1][d - 1] = [...dataByDateMap[y][m - 1][d - 1], mapId];
        }
      }
    }

    return dataByDateMap;
  }, []);

  // 일정 데이터를 달력에 쉽게 표기하기 위해 데이터 가공함
  const setDataByDate = useCallback((originData: IDataItem[], prevDataMap?: IDataMap, prevDataByDateMap?: IDataByDateMap): { dataMap: IDataMap; dataByDateMap: IDataByDateMap } => {
    const dataMap: IDataMap = prevDataMap && typeof prevDataMap === 'object' ? { ...prevDataMap } : {};
    let dataByDateMap: IDataByDateMap = prevDataByDateMap && typeof prevDataByDateMap === 'object' ? { ...prevDataByDateMap } : {};

    if (Array.isArray(originData) && originData?.length > 0) {
      originData?.forEach((item) => {
        const itemData = setItemData(item); // 데이터 가공
        const { category, startDate, endDate, title, id } = itemData;

        if (!startDate || !endDate || !title) {
          console.error('startDate, endDate, title 값은 필수값입니다.');
          return;
        }

        const itemId = id ? `${id}` : setUniqueItemId(itemData);
        const mapId = setDataId(category!, itemId);

        if (!dataMap[mapId]) {
          dataMap[mapId] = itemData;

          dataByDateMap = addDateByDataMap({
            dataByDateMap,
            mapId,
            ...itemData,
          });
        }
      });
    }

    return {
      dataByDateMap,
      dataMap,
    };
  }, []);

  // 콘텐츠 데이터 추출
  const getScheduleData = useCallback((selectedDate: IDateObj, dataMap: IDataMap, dataByDateMap: IDataByDateMap) => {
    if (!dataMap || !selectedDate || !dataByDateMap) {
      return null;
    }

    const { year, month, date } = selectedDate || {};
    const dataByDate = year && month && date && dataByDateMap[year] && dataByDateMap[year][month - 1][date - 1];
    let scheduleData: IDataItem[][] = [];

    if (Array.isArray(dataByDate) && dataByDate?.length > 0) {
      let prevCategory: string | null = null;
      scheduleData = dataByDate?.reduce((acc, curVal) => {
        const curCategory = curVal?.split('-')[0];
        if (!prevCategory || prevCategory !== curCategory) {
          acc.push([]);
        }

        acc[acc.length - 1].push(dataMap[curVal] as IDataItem);
        prevCategory = curCategory;

        return acc;
      }, scheduleData);
    }

    return scheduleData;
  }, []);

  return {
    dataMap,
    dataByDateMap,
    setDataMap,
    setDataByDateMap,
    resetData,
    getScheduleData,
  };
};

export default useScheduleData;
