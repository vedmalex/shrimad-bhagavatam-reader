import Typography from '@material-ui/core/Typography';
import { Fragment } from 'react';
import verseTime from '../lib/verseTime';
export const TextToolTip = ({ text, config }) =>
  text.wordsCount ? (
    <Fragment>
      <Typography variant="h5">Статистика</Typography>
      <Typography paragraph>
        Слов в фрагменте <strong>{text.wordsCount.overall}</strong>
      </Typography>
      <Typography paragraph>
        Слов в показанном фрагменте{' '}
        <strong>{verseTime(text.wordsCount, config)}</strong>
      </Typography>
    </Fragment>
  ) : null;
