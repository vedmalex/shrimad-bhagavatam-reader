import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { useRouter } from 'next/router';

import { useQuery } from '@apollo/react-hooks';
import { SELECTED_TEXTS } from '../lib/queries';
import { cloneDeep } from 'lodash';
import Head from 'next/head';
import verseTime from '../lib/verseTime';
import { Chapter } from '../components/Chapter';
import { Configuration } from '../components/Configuration';

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

  return (
    <>
      <Head>
        <title>
          Ш́рӣмад-бха̄гаватам. Песнь 3. Глава {chapterStart}, тексты {verseStart}-
          {verseEnd}{' '}
        </title>
      </Head>
      {!clean ? (
        <Configuration classes={classes} show={show} changeShow={changeShow} />
      ) : (
        undefined
      )}
      {chapterLoading && !result ? (
        'Вспоминаем'
      ) : (
        <Chapter
          result={result}
          config={{
            purport,
            wbw,
            translation,
            sanskrit,
            footnote: purport,
          }}
        />
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
