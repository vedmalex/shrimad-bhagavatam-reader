import React from 'react';

import SB from '../lib/SB3.json';

import { useRouter } from 'next/router';

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
    <div>
      {result.map(ch => (
        <div>
          {ch.number} - {ch.name}
          <div>
            {ch.texts.map(t => (
              <>
                <div key={`${ch.number}${t.number}`}>{t.text.join('—')}</div>
                <div>{sanskrit && t.sanskrit.map(s => <div>{s}</div>)}</div>
                {wbw ? (
                  <div>
                    <div>пословный перевод</div>
                    {t.wbw.map((wbw, index) => (
                      <span>
                        {' '}
                        {wbw[0]} - {wbw[1]}
                        {index < t.wbw.length - 1 ? ';' : ''}
                      </span>
                    ))}
                  </div>
                ) : (
                  ''
                )}
                {translation ? (
                  <>
                    <div>Перевод</div>
                    <div>{t.translation}</div>
                  </>
                ) : (
                  ''
                )}
                {purport && t.purport ? (
                  <>
                    <div>Комментарий</div>
                    <div>
                      {t.purport.map(s => (
                        <div>{s}</div>
                      ))}
                    </div>
                  </>
                ) : (
                  ''
                )}
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
