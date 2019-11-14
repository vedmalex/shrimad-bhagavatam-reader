import withApollo from 'next-with-apollo';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
// Update the GraphQL endpoint to any instance of GraphQL that you like
// Export a HOC from next-with-apollo
// Docs: https://www.npmjs.com/package/next-with-apollo
const api = process.env.BACKEND_API;
// const host = 'http://localhost:3000';
export default withApollo(
  // You can get headers and ctx (context) from the callback params
  // e.g. ({ headers, ctx, initialState })
  ({ initialState }) =>
    new ApolloClient({
      uri: `${api}/api/graphql`,
      cache: new InMemoryCache()
        //  rehydrate the cache using the initial data passed from the server:
        .restore(initialState || {})
    }),
  {
    getDataFromTree: 'always'
  }
);
