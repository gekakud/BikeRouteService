import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
// import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
// import { ThemeProvider } from 'react-bootstrap';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Loader from './components/Loader/Loader';

import '@fortawesome/fontawesome-svg-core/styles.css' 

import './i18n'


ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<Loader fullViewport />}>
      {/* <ThemeProvider dir="rtl" lang="he" > */}
        <App />
      {/* </ThemeProvider> */}
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
