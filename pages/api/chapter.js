import SB from '../../lib/SB3-texts.json';
import orderBy from 'lodash/orderBy';

export default (req, res) => {
  const {
    query: { n }
  } = req;

  const chapNo = Array.isArray(n)
    ? n.map(ch => parseInt(ch, 10))
    : parseInt(n, 10);
  if (chapNo) {
    if (Array.isArray(chapNo)) {
      let chapter = SB.filter(ch => chapNo.indexOf(ch.chapter) > -1);
      res.setHeader('Cache-Control', 'public, max-age=31557600');
      res.json(orderBy(chapter, ['index'], ['asc']));
    } else {
      let chapter = SB.filter(ch => chapNo === ch.chapter);
      res.setHeader('Cache-Control', 'public, max-age=31557600');
      res.json(orderBy(chapter, ['index'], ['asc']));
    }
  } else {
    res.setHeader('Cache-Control', 'public, max-age=31557600');
    res.json([]);
  }
};
