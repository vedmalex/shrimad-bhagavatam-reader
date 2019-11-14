import {
  Typography,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Slider,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  Button,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState, Fragment } from 'react';
import { useRouter } from 'next/router';

import { useQuery } from '@apollo/react-hooks';
import { ALL_CHAPTERS_QUERY, SELECTED_TEXTS } from '../lib/queries';
import { cloneDeep } from 'lodash';
import Head from 'next/head';
import verseTime from '../lib/verseTime';

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

const Home = () => {
  const router = useRouter();
  const {
    chapter,
    start,
    end,
    noconfig,
    sans,
    w2w,
    purp,
    trans,
  } = router.query;
  let classes = useStyles();
  const [show, changeShow] = useState({
    chapterStart: chapter ? parseInt(chapter, 10) : 1,
    chapterEnd: 1,
    verseStart: start ? parseInt(start, 10) : 1,
    verseEnd: end ? parseInt(end, 10) : 100,
    sanskrit: sans ? !!parseInt(sans, 10) : true,
    wbw: w2w ? !!parseInt(w2w, 10) : true,
    translation: trans ? !!parseInt(trans, 10) : true,
    purport: purp ? !!parseInt(purp, 10) : true,
    words: 1800,
    useWordsCount: 0,
    textCount: 100,
    clean: noconfig ? !!parseInt(noconfig, 10) : false,
    originalData: undefined,
  });

  const {
    chapterStart,
    chapterEnd,
    verseStart,
    verseEnd,
    purport,
    wbw,
    translation,
    sanskrit,
    words,
    useWordsCount,
    textCount,
    clean,
  } = show;

  let {
    data: chapterData,
    loading: chapterLoading,
    error: chapterError,
  } = useQuery(SELECTED_TEXTS, {
    variables: {
      chapter: chapterStart,
    },
  });

  let result;

  if (chapterData) {
    result = cloneDeep(chapterData.chapter);
    result.texts = result.texts.filter(t =>
      t.text.some(n => n >= verseStart && n <= verseEnd),
    );
    result.wordsCount = result.texts.reduce((res, cur) => {
      res += cur.wordsCount.overall;
      return res;
    }, 0);
    result.viewableWordsCount = result.texts.reduce((res, cur) => {
      res += verseTime(cur.wordsCount, {
        purport,
        wbw,
        translation,
        sanskrit,
        footnote: purport,
      });
      return res;
    }, 0);
  }

  if (
    !chapterLoading &&
    !chapterError &&
    textCount != chapterData.size.verseCount
  ) {
    changeShow({
      ...show,
      textCount: chapterData.size.verseCount,
    });
  }

  let {
    data: allChaptersData,
    loading: allChapterLoading,
    error: allChaptersError,
  } = useQuery(ALL_CHAPTERS_QUERY);

  let allChapters =
    !allChapterLoading && !allChaptersError
      ? allChaptersData.chapters
      : undefined;

  // let [allSizes, allSizesLoading] = useFetch(
  //   useWordsCount
  //     ? `/api/sizes?chapter=${chapterStart}&verse=${verseStart}&words=${words}`
  //     : `/api/sizes?chapter=${chapterStart}&verse=${verseStart}`
  // );

  // if (
  //   useWordsCount &&
  //   !allSizesLoading &&
  //   allSizes[allSizes.length - 1].text[0] !== verseEnd
  // ) {
  //   changeShow({
  //     ...show,
  //     verseEnd: allSizes[allSizes.length - 1].text[0]
  //   });
  // }

  const change = item => e => {
    e.preventDefault();
    changeShow({
      ...show,
      [item]: e.currentTarget.checked,
    });
  };

  const changeVerses = (e, newValue) => {
    e.preventDefault();
    changeShow({
      ...show,
      verseStart: newValue[0],
      verseEnd: newValue[1],
    });
  };

  const changeChapter = event => {
    changeShow({
      ...show,
      chapterStart: event.target.value,
      verseStart: 1,
      verseEnd: 100,
    });
  };

  const wordsChange = event => {
    changeShow({
      ...show,
      words: event.target.value,
    });
  };

  return (
    <>
      <Head>
        <title>
          Ш́рӣмад-бха̄гаватам. Песнь 3. Глава {chapterStart}, тексты {verseStart}-
          {verseEnd}{' '}
        </title>
      </Head>
      {!clean ? (
        <FormControl component="fieldset" className={classes.root}>
          <FormLabel component="legend">Что смотреть</FormLabel>
          <FormGroup aria-label="position" row>
            <FormControlLabel
              checked={!!show.sanskrit}
              control={<Checkbox color="primary" />}
              label="Санскрит"
              onChange={change('sanskrit')}
            />
            <FormControlLabel
              checked={!!show.wbw}
              control={<Checkbox color="primary" />}
              label="Пословный перевод"
              onChange={change('wbw')}
            />
            <FormControlLabel
              checked={!!show.translation}
              control={<Checkbox color="primary" />}
              label="Перевод"
              onChange={change('translation')}
            />
            <FormControlLabel
              checked={!!show.purport}
              control={<Checkbox color="primary" />}
              label="Комментарии"
              onChange={change('purport')}
            />
            <FormControlLabel
              checked={!!show.useWordsCount}
              control={<Checkbox color="primary" />}
              label="использовать количество слов"
              onChange={change('useWordsCount')}
            />
            <TextField
              id="words count"
              label="Количество слов"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              value={words}
              onChange={wordsChange}
            />
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Глава</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={chapterStart}
                onChange={changeChapter}
              >
                {allChapterLoading ? (
                  <MenuItem value={chapterStart}>Глава</MenuItem>
                ) : (
                  allChapters.map((ch, index) => (
                    <MenuItem key={index} value={ch.number}>
                      {ch.number}. {ch.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (useWordsCount) {
                  changeShow({
                    ...show,
                    verseStart: verseEnd + 1,
                  });
                }
              }}
            >
              Следующий
            </Button>
            <Slider
              className={classes.slider}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              value={[show.verseStart, show.verseEnd]}
              label="Тексты"
              valueLabelDisplay="on"
              onChange={changeVerses}
              min={1}
              max={textCount}
            />
          </FormGroup>
        </FormControl>
      ) : (
        undefined
      )}
      {chapterLoading && !result ? (
        'Вспоминаем'
      ) : (
        <Card>
          <CardContent>
            <Typography variant="subtitle2"></Typography>
            <Tooltip
              title={
                <Fragment>
                  <Typography variant="h6">Статистика</Typography>
                  <Typography paragraph>
                    Слов в фрагменте <strong>{result.wordsCount}</strong>
                  </Typography>
                  <Typography paragraph>
                    Слов в показанном фрагменте{' '}
                    <strong>{result.viewableWordsCount}</strong>
                  </Typography>
                </Fragment>
              }
            >
              <Typography variant="h4">
                Глава {result.number} "{result.name}"
              </Typography>
            </Tooltip>
            {result.texts.map((t, tI) => (
              <Fragment key={`${tI}`}>
                <Tooltip
                  title={
                    <Fragment>
                      <Typography variant="h5">Статистика</Typography>
                      <Typography paragraph>
                        Слов в фрагменте <strong>{t.wordsCount.overall}</strong>
                      </Typography>
                      <Typography paragraph>
                        Слов в показанном фрагменте{' '}
                        <strong>
                          {verseTime(t.wordsCount, {
                            purport,
                            wbw,
                            translation,
                            sanskrit,
                            footnote: purport,
                          })}
                        </strong>
                      </Typography>
                    </Fragment>
                  }
                >
                  <Typography variant="h6" key={`${tI}`}>
                    {' '}
                    Текст {t.text.join('—')}
                  </Typography>
                </Tooltip>
                <Typography paragraph key={`${tI}sans`}>
                  <strong>
                    {sanskrit && t.sanskrit
                      ? t.sanskrit.map((s, sI) => (
                          <Fragment key={`${tI}${sI}`}>
                            {s}
                            {sI < s.length - 1 ? <br /> : ''}
                          </Fragment>
                        ))
                      : ''}
                  </strong>
                </Typography>
                {wbw ? (
                  <Fragment key={`${tI}wbw`}>
                    <Typography
                      paragraph
                      key={`${result.name}-пословный перевод`}
                    >
                      {t.wbw.map((wbw, wI) => (
                        <Fragment key={`${tI}wbw${wI}`}>
                          {' '}
                          <strong>{wbw[0]}</strong> - {wbw[1]}
                          {wI < t.wbw.length - 1 ? ';' : ''}
                        </Fragment>
                      ))}
                    </Typography>
                  </Fragment>
                ) : (
                  ''
                )}
                {translation ? (
                  <Fragment key={`${tI}tr`}>
                    <Typography paragraph key={`${result.name}-перевод`}>
                      <strong>{t.translation}</strong>
                    </Typography>
                  </Fragment>
                ) : (
                  ''
                )}
                {purport && t.purport ? (
                  <>
                    <Typography variant="h6" key={`${tI}-комменатарий`}>
                      Комментарий
                    </Typography>
                    <>
                      {t.purport.map((s, pI) => (
                        <Typography paragraph key={`${tI}-комментарий-${pI}`}>
                          {s}
                        </Typography>
                      ))}
                      {t.footnote ? <Typography>{t.footnote}</Typography> : ''}
                    </>
                  </>
                ) : (
                  ''
                )}
              </Fragment>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
};

// Home.getInitialProps = ctx => {
//   const apolloClient = ctx.apolloClient;
// здесь вернуть данные какие нужны
// };
// посмотреть https://docs.react-async.com/guide/async-components

export default Home;
