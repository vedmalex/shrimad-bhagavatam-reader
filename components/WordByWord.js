import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import { Fragment } from 'react';

import translite from '../lib/transilte';

export const WordByWord = ({ text, config }) =>
  config.wbw ? (
    <Fragment>
      <Typography paragraph>
        {text.wbw.map((wbw, wI) => (
          <Fragment key={`${wI}`}>
            {' '}
            <strong>
              <Link href={`/search?q=${translite(wbw[0])}`}>{wbw[0]}</Link>
            </strong>{' '}
            - {wbw[1]}
            {wI < text.wbw.length - 1 ? ';' : ''}
          </Fragment>
        ))}
      </Typography>
    </Fragment>
  ) : (
    ''
  );
