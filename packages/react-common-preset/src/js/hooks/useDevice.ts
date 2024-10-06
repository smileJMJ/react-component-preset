import { useEffect, useState, useMemo, useCallback } from "react";
import { DEVICE_TYPE, MOBILE_USER_AGENT } from "@constants/device";

export interface IDevice {
  device: (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];
  isPc: boolean;
}

const getDeviceByUA = () => {
  const ua = navigator.userAgent.toLowerCase();
  return MOBILE_USER_AGENT?.filter((v) => ua?.includes(v))?.length > 0
    ? DEVICE_TYPE.MOBILE
    : DEVICE_TYPE.PC;
};

// TODO. breakpoint
// const getDeviceByBreakPoint = () => {

// };

const useDevice = () => {
  const [device, setDevice] = useState<IDevice["device"]>(getDeviceByUA());
  const isPc = useMemo(() => device === DEVICE_TYPE.PC, [device]);

  useEffect(() => {
    const handleResize = () => {
      const newDevice = getDeviceByUA();
      setDevice(newDevice);
    };

    handleResize();

    // resize
    window.addEventListener("resize", handleResize);

    () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    device,
    isPc,
  };
};

export default useDevice;
