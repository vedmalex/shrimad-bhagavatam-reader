import { Typography } from '@material-ui/core';
import { Fragment } from 'react';
export const WordByWord = ({ text, config }) =>
  config.wbw ? (
    <Fragment>
      <Typography paragraph>
        {text.wbw.map((wbw, wI) => (
          <Fragment key={`${wI}`}>
            {' '}
            <strong>{wbw[0]}</strong> - {wbw[1]}
            {wI < text.wbw.length - 1 ? ';' : ''}
          </Fragment>
        ))}
      </Typography>
    </Fragment>
  ) : (
    ''
  );
