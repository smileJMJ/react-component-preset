import '@rcp/config-typescript/global.d.ts';
import type { IDataItem } from '@hooks/useScheduleData';

declare global {
  interface Window {
    createReactFoldCalendar: (options: IOption) => void;
  }

  interface IOption {
    data?: IDataItem[]; // TODO. 데이터 받아서 calendar에 표시하도록
    element?: string | HTMLElement | null; // browser 버전일 때, calendar 주입할 dom element
    useInitWeekType?: boolean; // calendar 로드 시 'week' 타입으로 노출할 지 여부
    useShowContent?: boolean; // calendar 하단에 일자 별 콘텐츠 영역 노출할지 여부
  }
}
