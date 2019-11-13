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
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import verseTime from '../lib/verseTime';
import { useFetch } from '../lib/useFetch';
import { ALL_CHAPTERS_QUERY, SELECTED_TEXTS } from '../lib/queries';
import { isEqual } from 'lodash';

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

const Home = () => {
  let classes = useStyles();
  const [show, changeShow] = useState({
    chapterStart: 1,
    verseStart: 1,
    chapterEnd: 1,
    verseEnd: 5,
    sanskrit: true,
    wbw: true,
    translation: true,
    purport: true,
    words: 1800,
    useWordsCount: 0,
    textCount: 100,
    result: []
  });

  let {
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
    result
  } = show;

  let {
    data: chapterData,
    loading: chapterLoading,
    error: chapterError
  } = useQuery(SELECTED_TEXTS, {
    variables: {
      chapter: chapterStart,
      verseStart,
      verseEnd,
      purport,
      wbw,
      translation,
      sanskrit,
      footnote: true
    }
  });

  if (
    !chapterLoading &&
    !chapterError &&
    !isEqual(result, chapterData.chapters)
  ) {
    changeShow({
      ...show,
      result: [chapterData.chapters]
    });
  }
  if (
    !chapterLoading &&
    !chapterError &&
    textCount != chapterData.size.verseCount
  ) {
    changeShow({
      ...show,
      textCount: chapterData.size.verseCount
    });
  }

  let {
    data: allChaptersData,
    loading: allChapterLoading,
    error: allChaptersError
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
      [item]: e.currentTarget.checked
    });
  };

  const changeVerses = (e, newValue) => {
    e.preventDefault();
    changeShow({
      ...show,
      verseStart: newValue[0],
      verseEnd: newValue[1]
    });
  };

  const changeChapter = event => {
    changeShow({
      ...show,
      chapterStart: event.target.value,
      verseStart: 1,
      verseEnd: 100
    });
  };

  const wordsChange = event => {
    changeShow({
      ...show,
      words: event.target.value
    });
  };

  return (
    <>
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
              shrink: true
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
                  verseStart: verseEnd + 1
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
      {chapterLoading ? (
        'Вспоминаем'
      ) : (
        <Card>
          <CardContent>
            <Typography variant="subtitle2"></Typography>
            {result.map((ch, chI) => (
              <div key={chI}>
                <Typography variant="h4" key={`${chI}-глава`}>
                  Глава {ch.number} "{ch.name}"
                </Typography>
                {ch.texts.map((t, tI) => (
                  <div key={`${chI}${tI}`}>
                    <Typography variant="h5" key={`${chI}${tI}`}>
                      {' '}
                      Текст {t.text.join('—')}
                    </Typography>
                    <Typography paragraph key={`${chI}${tI}sans`}>
                      <strong>
                        {sanskrit
                          ? t.sanskrit.map((s, sI) => (
                              <span key={`${chI}${tI}${sI}`}>
                                {s}
                                {sI < s.length - 1 ? <br /> : ''}
                              </span>
                            ))
                          : ''}
                      </strong>
                    </Typography>
                    {wbw ? (
                      <div key={`${chI}${tI}wbw`}>
                        <Typography
                          paragraph
                          key={`${ch.name}-пословный перевод`}
                        >
                          {t.wbw.map((wbw, wI) => (
                            <span key={`${chI}${tI}wbw${wI}`}>
                              {' '}
                              <strong>{wbw[0]}</strong> - {wbw[1]}
                              {wI < t.wbw.length - 1 ? ';' : ''}
                            </span>
                          ))}
                        </Typography>
                      </div>
                    ) : (
                      ''
                    )}
                    {translation ? (
                      <div key={`${chI}${tI}tr`}>
                        <Typography paragraph key={`${ch.name}-перевод`}>
                          <strong>{t.translation}</strong>
                        </Typography>
                      </div>
                    ) : (
                      ''
                    )}
                    {purport && t.purport ? (
                      <>
                        <Typography
                          variant="h6"
                          key={`${chI}${tI}-комменатарий`}
                        >
                          Комментарий
                        </Typography>
                        <>
                          {t.purport.map((s, pI) => (
                            <Typography
                              paragraph
                              key={`${chI}${tI}-комментарий-${pI}`}
                            >
                              {s}
                            </Typography>
                          ))}
                          {t.footnote ? (
                            <Typography>{t.footnote}</Typography>
                          ) : (
                            ''
                          )}
                        </>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                ))}
              </div>
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
