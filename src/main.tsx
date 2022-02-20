import React from 'react';
import ReactDOM from 'react-dom';

import { Application } from '#components/Application';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Application />
  </BrowserRouter>,
  window.document.querySelector('#app')
);
