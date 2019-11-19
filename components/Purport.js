import { Typography } from '@material-ui/core';
import { Fragment } from 'react';
export const Purport = ({ text, config }) =>
  config.purport && text.purport ? (
    <Fragment>
      <Typography variant="h6">Комментарий</Typography>
      {text.purport.map((s, pI) => (
        <Typography paragraph key={`${pI}`}>
          {s}
        </Typography>
      ))}
      {text.footnote ? <Typography>{text.footnote}</Typography> : ''}
    </Fragment>
  ) : (
    ''
  );
