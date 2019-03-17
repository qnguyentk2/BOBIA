import 'react-app-polyfill/ie9';
import React from 'react';
// import { whyDidYouUpdate } from 'why-did-you-update';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'unstated';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import Common from 'components/common';
import client from 'apollo';
import Routes from 'routes';
import 'translations/i18n';
import * as serviceWorker from 'utils/serviceWorker';
import 'assets/styles/_App.scss';

// if (process.env.NODE_ENV === 'development') {
//   whyDidYouUpdate(React, {
//     exclude: ['Track', 'PrevArrow', 'NextArrow', 'InnerSlider', 'Dots']
//   });
// }

ReactDOM.render(
  <ApolloProvider client={client}>
    <Common.commonComps.ErrorBoundary>
      <BrowserRouter>
        <Provider>
          <Routes />
        </Provider>
      </BrowserRouter>
      {process.env.NODE_ENV !== 'development' && (
        <MessengerCustomerChat
          pageId="1945351215489572"
          appId="2030954623901199"
          htmlRef={window.location.pathname}
        />
      )}
    </Common.commonComps.ErrorBoundary>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
