import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useQuery } from '@apollo/react-hooks';
import { SEARCH_VERSE_DETAIL } from '../lib/queries';
import { SearchText } from './SearchText';
import { Text } from './Text';

export default ({ verse, found }) => {
  let { data, loading, error } = useQuery(SEARCH_VERSE_DETAIL, {
    variables: {
      verse,
    },
  });
  return (
    <Card>
      <CardContent>
        {!loading && !error ? (
          <Text
            text={data.verse}
            config={{
              sanskrit: true,
              translation: true,
              purport: true,
              wbw: true,
              footnote: true,
            }}
          />
        ) : (
          'загружаем'
        )}
      </CardContent>
    </Card>
  );
};
