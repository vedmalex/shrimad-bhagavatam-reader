import {
  FormControl,
  FormLabel,
  FormGroup,
  TextField,
  Typography,
  Card,
  CardContent
} from '@material-ui/core';
import { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { SEARCH_VERSE } from '../lib/queries';
import { SearchText } from '../components/SearchText';

const useStyles = makeStyles({
  root: {
    margin: 10,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  slider: {
    marginTop: 30,
    marginBottom: 30
  }
});

const Result = ({ query }) => {
  let { data, loading, error } = useQuery(SEARCH_VERSE, {
    variables: {
      text: query
    }
  });
  console.log(data);

  return (
    <Card>
      <CardContent>
        {!loading && !error && data.search.length > 0 ? (
          <Fragment>
            <Typography variant="body2">
              <sub>
                найдено текстов:
                {data.search.length}
              </sub>
            </Typography>
            {data.search.map((t, tI) => (
              <SearchText
                key={tI}
                text={t}
                config={{
                  translation: true,
                  wbw: true,
                  purport: true,
                  footnote: true,
                  sanskrit: true
                }}
              />
            ))}
          </Fragment>
        ) : (
          <Fragment>
            <Typography variant="body2">
              {loading ? 'Загружаем' : error ? 'Ошибка' : 'нет результатов'}
            </Typography>
          </Fragment>
        )}
      </CardContent>
    </Card>
  );
};

export default () => {
  const classes = useStyles();
  const [state, update] = useState({ query: '', editing: '' });
  const updateQuery = e => {
    e.preventDefault();
    update({
      ...state,
      editing: e.target.value
    });
  };

  return (
    <Fragment>
      <FormControl component="fieldset" className={classes.root}>
        <FormLabel component="legend">Поиск по третьей песне</FormLabel>
        <FormGroup aria-label="position">
          <FormControl className={classes.formControl}>
            <TextField
              value={state.editing}
              label="запрос"
              onChange={updateQuery}
              onKeyUp={event => {
                if (event.keyCode == 13) {
                  update({
                    ...state,
                    query: state.editing
                  });
                }
              }}
            />
          </FormControl>
        </FormGroup>
      </FormControl>
      <Result query={state.query} />
    </Fragment>
  );
};
