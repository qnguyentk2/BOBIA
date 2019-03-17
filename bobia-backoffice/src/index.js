import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './utils/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'unstated';
import 'react-sortable-tree/style.css';
import 'assets/App.scss';
import Common from 'components/common';
import client from 'apollo';
import Routes from 'routes';
import * as serviceWorker from 'utils/serviceWorker';

ReactDOM.render(
  <ApolloProvider client={client}>
    <Common.commonComps.ErrorBoundary>
      <BrowserRouter>
        <Provider>
          <Routes />
        </Provider>
      </BrowserRouter>
    </Common.commonComps.ErrorBoundary>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
