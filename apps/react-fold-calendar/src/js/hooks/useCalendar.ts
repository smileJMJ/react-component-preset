import { useState } from 'react';
import { CAL_TYPE } from '@rfc/constants/calendar';
import { setDateObj } from '@rfc/utils/date';
import { setOption } from '@rfc/utils/ui';
import useDevice, { type IDevice } from '@rcp/react-common-preset/hooks/useDevice';
import { getLanguage } from '@rcp/react-common-preset/utils/ui';
import l10nKo from '@rfc/l10n/ko.json';
import l10nEn from '@rfc/l10n/en.json';
import type { IOption } from '@rfc/types/index';
import type { IDateObj } from '@rfc/types/date';

export interface ICalendar {
  type: (typeof CAL_TYPE)[keyof typeof CAL_TYPE];
  selectedDate: IDateObj;
  drawDate: IDateObj;
  l10n: { [key: string]: { [key: string]: string } };
  device: IDevice['device'];
  isPc: IDevice['isPc'];
  option: IOption;
  setType: (state: (typeof CAL_TYPE)[keyof typeof CAL_TYPE]) => void;
  setSelectedDate: (state: IDateObj) => void;
  setDrawDate: (state: IDateObj) => void;
}

const useCalendar = ({ options }: { options: IOption }): ICalendar => {
  const option = setOption(options);
  const initialDate = setDateObj();
  const lang = getLanguage();
  const [type, setType] = useState<ICalendar['type']>(option?.useInitWeekType ? CAL_TYPE.WEEK : CAL_TYPE.MONTH);
  const [selectedDate, setSelectedDate] = useState<ICalendar['selectedDate']>(initialDate);
  const [drawDate, setDrawDate] = useState<ICalendar['drawDate']>(initialDate);
  const [l10n] = useState<ICalendar['l10n']>(lang === 'ko' ? l10nKo : l10nEn);
  const { device, isPc } = useDevice();

  return {
    type,
    setType,
    selectedDate,
    setSelectedDate,
    drawDate,
    setDrawDate,
    l10n,
    device,
    isPc,
    option,
  };
};

export default useCalendar;
