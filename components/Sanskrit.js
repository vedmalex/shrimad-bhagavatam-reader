import Typography from '@material-ui/core/Typography';
import { Fragment } from 'react';
export const Sanskrit = ({ text, config }) =>
  config.sanskrit && text.sanskrit ? (
    <Typography paragraph>
      <strong>
        {text.sanskrit.map((s, sI) => (
          <Fragment key={`${sI}`}>
            {s}
            {sI < s.length - 1 ? <br /> : ''}
          </Fragment>
        ))}
      </strong>
    </Typography>
  ) : (
    ''
  );
