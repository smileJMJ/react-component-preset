import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// make directly react-fold-calendar
export const createReactFoldCalendar = (options: IOption) => {
  try {
    const { element } = options;

    if (!element) {
      throw new Error(`There are no element in options.`);
    }

    const rootEle = typeof element === 'string' ? document.querySelector(element) : element;
    const root = createRoot(rootEle as HTMLElement);
    root.render(
      <StrictMode>
        <App {...{ options }} />
      </StrictMode>
    );
  } catch (error) {
    console.error(error);
  }
};

window.createReactFoldCalendar = createReactFoldCalendar;
