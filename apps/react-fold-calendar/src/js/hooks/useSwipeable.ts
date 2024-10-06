import { useSwipeable as useSwipableHooks, type SwipeCallback } from 'react-swipeable';

const useSwipeable = ({ onSwipedLeft, onSwipedRight }: { onSwipedLeft: SwipeCallback; onSwipedRight: SwipeCallback }) => {
  return useSwipableHooks({
    delta: 10,
    preventScrollOnSwipe: true,
    trackTouch: true, // track touch input
    trackMouse: true,
    onSwipedLeft,
    onSwipedRight,
  });
};

export default useSwipeable;
