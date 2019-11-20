import { Typography, Card, CardContent } from '@material-ui/core';
import { Fragment, Suspense } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { SEARCH_VERSE } from '../lib/queries';
import { SearchText } from './SearchText';

export default async ({ query }) => {
  const client = useApolloClient();
  const data = await client
    .query({
      query: SEARCH_VERSE,
      variables: {
        text: query,
      },
    })
    .then(data => data.search);
  return (
    <Card>
      <CardContent>
        {data.map((t, tI) => (
          <SearchText key={tI} text={t} />
        ))}
      </CardContent>
    </Card>
  );
};

export default ({ query }) => <Result query={query} />;
