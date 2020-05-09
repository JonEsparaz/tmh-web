import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import App from './App'
import { createBrowserHistory, History } from "history";
import { CookiesProvider } from 'react-cookie';

Sentry.init({dsn: "https://38e8f0bc706a4d968e1ff3ebf638a090@o390245.ingest.sentry.io/5231570"});

var history: History<any> = createBrowserHistory()


render((
  <Router history={history}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </Router>),
  document.querySelector('#root')
)


