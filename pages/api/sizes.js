import SB from '../../lib/SB3-sizes.json';

import verseTime from '../../lib/verseTime';

export default (req, res) => {
  let {
    query: {
      chapter,
      verse,
      sanskrit,
      wbw,
      translation,
      purport,
      footnote,
      words
    }
  } = req;
  verse = parseInt(verse, 10);
  chapter = parseInt(chapter, 10);
  if (chapter && verse && words) {
    const config = {
      sanskrit: sanskrit || true,
      wbw: wbw || true,
      translation: translation || true,
      purport: purport || true,
      footnote: footnote || true
    };
    const first = SB.find(t => {
      return t.chapter == chapter && t.text.indexOf(verse) > -1;
    });
    const result = [first];
    let size = verseTime(first, config);
    for (let i = first.index + 1; i < SB.length && size < words; i++) {
      const item = SB[i];
      size += verseTime(item, config);
      result.push(item);
    }

    res.setHeader('Cache-Control', 'public, max-age=31557600');
    res.json(result);
  } else if (chapter && verse) {
    const first = SB.find(
      t => t.chapter == chapter && t.text.indexOf(verse) > -1
    );

    res.setHeader('Cache-Control', 'public, max-age=31557600');
    res.json([first]);
  } else {
    res.setHeader('Cache-Control', 'public, max-age=31557600');
    res.json([]);
  }
};

// передавать конфиг для приложения
// отвалились названия глав
//
