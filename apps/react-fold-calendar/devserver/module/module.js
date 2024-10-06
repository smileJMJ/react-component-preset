import ReactFoldCalendar from './dist/index.js';

const appModule = document.querySelector('#app-module');
const root = ReactDOM.createRoot(appModule);
root.render(ReactFoldCalendar.render({}));
