import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TablePagination from '@material-ui/core/TablePagination';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { useState, Fragment, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { SEARCH_VERSE } from '../../lib/queries';
import { SearchText } from '../../components/SearchText';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
  root: {
    margin: 10,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  slider: {
    marginTop: 30,
    marginBottom: 30,
  },
});

const Result = ({ query }) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(3);
  const [count, setCount] = useState(0);
  let { data, loading, error } = useQuery(SEARCH_VERSE, {
    variables: {
      text: query,
      limit,
      from: page * limit,
    },
  });

  useEffect(() => {
    if (data) {
      setCount(data.search.count);
    } else {
      setCount(0);
    }
  }, [data]);
  // console.log(data);

  return (
    <Card>
      <CardContent>
        <TablePagination
          rowsPerPageOptions={[1, 3, 5, 10, 25, 50]}
          component="div"
          count={count || 0}
          rowsPerPage={limit}
          page={page}
          labelRowsPerPage={'шлок на странице'}
          backIconButtonProps={{
            'aria-label': 'предыдущая',
          }}
          nextIconButtonProps={{
            'aria-label': 'следующая',
          }}
          onChangePage={(e, page) => setPage(page)}
          onChangeRowsPerPage={event => {
            setLimit(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
        {!loading && !error && data.search.count > 0 ? (
          <Fragment>
            <Typography variant="body2">
              <sub>
                найдено текстов:
                {count}
              </sub>
            </Typography>
            {data.search.data.map((t, tI) => (
              <SearchText
                key={tI}
                text={t}
                config={{
                  translation: true,
                  wbw: true,
                  purport: true,
                  footnote: true,
                  sanskrit: true,
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

const SearchPanel = ({ q, setQuery, classes }) => {
  const [search, setSearch] = useState(q || 'Уддхава увача сказал');

  return (
    <FormControl component="fieldset" className={classes.root}>
      <FormLabel component="legend">Поиск по третьей песне</FormLabel>
      <FormGroup aria-label="position">
        <FormControl className={classes.formControl}>
          <TextField
            value={search}
            label="запрос"
            onChange={e => setSearch(e.target.value)}
            onKeyUp={event => {
              if (event.keyCode == 13) {
                setQuery(search);
              }
            }}
          />
        </FormControl>
      </FormGroup>
    </FormControl>
  );
};

export default () => {
  const q = useRouter().query;
  const classes = useStyles();
  const [query, setQuery] = useState(q.q || 'Уддхава увача сказал');

  return (
    <Fragment>
      <SearchPanel setQuery={setQuery} classes={classes} q={query} />
      <Result query={query} />
    </Fragment>
  );
};
