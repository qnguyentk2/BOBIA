import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from 'apollo-utilities';

let httpUri = '';
let wsUri = '';

if (
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_SERVER_MODE === 'local'
) {
  httpUri = `${window.location.protocol}//${window.location.hostname}:${
    process.env.REACT_APP_LOCAL_SERVER_PORT
  }/graphql`;
  wsUri = `ws://${window.location.hostname}:${
    process.env.REACT_APP_LOCAL_SERVER_PORT
  }/graphql`;
} else {
  httpUri = `https://${process.env.REACT_APP_SERVER_PATH}/graphql`;
  wsUri = `wss://${process.env.REACT_APP_SERVER_PATH}/graphql`;
}

const httpLink = createUploadLink({
  uri: httpUri,
  credentials: 'include'
});

const wsLink = new WebSocketLink(
  new SubscriptionClient(wsUri, {
    reconnect: true
  })
);

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          // eslint-disable-next-line
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      // eslint-disable-next-line
      if (networkError) console.error(`[Network error]: ${networkError}`);
    }),
    terminatingLink
  ]),
  cache: new InMemoryCache()
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: 'cache-and-network'
  //   },
  //   query: {
  //     fetchPolicy: 'no-cache'
  //   }
  // }
});

export default client;
