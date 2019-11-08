import SB from '../lib/SB3.json';

import { useRouter } from 'next/router';
import { Typography, Card, CardContent } from '@material-ui/core';

const Home = () => {
  const router = useRouter();
  let chapters = router.query.ch;
  let verses = router.query.verse || '1-100';
  let purport = parseInt(router.query.purport || '1', 10);
  let wbw = parseInt(router.query.wbw || '1', 10);
  let translation = parseInt(router.query.translation || '1', 10);
  let sanskrit = parseInt(router.query.sanskrit || '1', 10);
  // подсчитать слова для вывода на экран
  // интегрировать с полнотекстовым поиском algolia или что-то подобное

  let result;
  if (chapters) {
    if (Array.isArray(chapters)) {
      chapters = chapters.map(c => parseInt(c, 10));
      result = SB.filter(ch => chapters.indexOf(ch.number) > -1);
    } else {
      chapters = parseInt(chapters, 10);
      result = SB.filter(ch => chapters === ch.number);
      let filter;
      if (Array.isArray(verses)) {
        verses = verses.map(f => parseInt(f, 10));
        filter = txt => txt.text.some(t => verses.indexOf(t) > -1);
      } else {
        verses = verses.split('-');
        if (verses.length > 1) {
          filter = txt => txt.text.some(t => t <= verses[1] && t >= verses[0]);
        } else {
          verses = verses[0];
          verses = parseInt(verses, 10);
          filter = txt => txt.text.indexOf(verses) > -1;
        }
      }
      result = [
        {
          ...result[0],
          texts: result[0].texts.filter(filter),
        },
      ];
    }
  } else {
    result = [];
  }

  return (
    <Card>
      <CardContent>
        {result.map(ch => (
          <div>
            <Typography variant="h4">
              Глава {ch.number} "{ch.name}"
            </Typography>
            <div>
              {ch.texts.map(t => (
                <>
                  <Typography variant="h5" key={`${ch.number}${t.number}`}>
                    {' '}
                    Текст {t.text.join('—')}
                  </Typography>
                  <Typography paragraph>
                    <strong>
                      {sanskrit &&
                        t.sanskrit.map((s, index) => (
                          <>
                            {s}
                            {index < s.length - 1 ? <br /> : ''}
                          </>
                        ))}
                    </strong>
                  </Typography>
                  {wbw ? (
                    <>
                      <Typography paragraph>
                        {t.wbw.map((wbw, index) => (
                          <>
                            {' '}
                            <strong>{wbw[0]}</strong> - {wbw[1]}
                            {index < t.wbw.length - 1 ? ';' : ''}
                          </>
                        ))}
                      </Typography>
                    </>
                  ) : (
                    ''
                  )}
                  {translation ? (
                    <>
                      <Typography paragraph>
                        <strong>{t.translation}</strong>
                      </Typography>
                    </>
                  ) : (
                    ''
                  )}
                  {purport && t.purport ? (
                    <>
                      <Typography variant="h6">Комментарий</Typography>
                      <>
                        {t.purport.map(s => (
                          <Typography paragraph>{s}</Typography>
                        ))}
                      </>
                    </>
                  ) : (
                    ''
                  )}
                </>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Home;
