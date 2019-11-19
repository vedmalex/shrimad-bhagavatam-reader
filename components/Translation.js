import { Typography } from '@material-ui/core';
import { Fragment } from 'react';
export const Translation = ({ text, config }) =>
  config.translation ? (
    <Fragment>
      <Typography paragraph>
        <strong>{text.translation}</strong>
      </Typography>
    </Fragment>
  ) : (
    ''
  );
