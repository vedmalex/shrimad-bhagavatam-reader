import SB from '../../lib/SB3-chapters.json';
import orderBy from 'lodash/orderBy';

export default (req, res) => {
  const {
    query: { n, start, end },
  } = req;
  if (n) {
    const chapNo = Array.isArray(n)
      ? n.map(ch => parseInt(ch, 10))
      : parseInt(n, 10);
    if (chapNo) {
      if (Array.isArray(chapNo)) {
        let chapter = SB.filter(ch => chapNo.indexOf(ch.number) > -1);
        res.setHeader('Cache-Control', 'public, max-age=31557600');
        // console.log('1', chapter);
        res.json(orderBy(chapter, ['index'], ['asc']));
      } else {
        let chapter = SB.find(ch => chapNo === ch.number);
        res.setHeader('Cache-Control', 'public, max-age=31557600');
        // console.log('2', chapter);
        res.json(chapter);
      }
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31557600');
      res.json([]);
    }
  } else {
    res.setHeader('Cache-Control', 'public, max-age=31557600');
    res.json(SB);
  }
};
