import Typography from '@material-ui/core/Typography';
import { Fragment } from 'react';
export const ChapterTooltip = ({ chapter }) => (
  <Fragment>
    <Typography variant="h6">Статистика</Typography>
    <Typography paragraph>
      Слов в фрагменте <strong>{chapter.wordsCount}</strong>
    </Typography>
    <Typography paragraph>
      Слов в показанном фрагменте <strong>{chapter.viewableWordsCount}</strong>
    </Typography>
  </Fragment>
);
