import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: `${process.env.urlApi}/graphql`,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});
