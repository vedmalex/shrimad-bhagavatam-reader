import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Fragment } from 'react';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import makeStyles from '@material-ui/core/styles/makeStyles';
import translite from '../lib/transilte';

const useStyles = makeStyles({
  highlight: {
    backgroundColor: 'yellow',
    fontStyle: 'italic',
  },
});

const Word = ({ children, found, classes }) => {
  const list = children.split(' ');
  if (list.length > 1) {
    return list.map((item, i) => (
      <Word key={i} found={found} classes={classes}>
        {item}
      </Word>
    ));
  } else {
    const sample = translite(children);
    if (found && sample.match(found)) {
      return <span className={classes.highlight}>{children} </span>;
    } else {
      return <>{children} </>;
    }
  }
};

const Sanskrit = ({ text, config, found, classes }) => {
  if (config.sanskrit && text.sanskrit) {
    return (
      <Typography paragraph>
        <strong>
          {text.sanskrit.map((s, sI) => (
            <Fragment key={`${sI}`}>
              <Word key={sI} found={found} classes={classes}>
                {s}
              </Word>
              <br />
            </Fragment>
          ))}
        </strong>
      </Typography>
    );
  } else return null;
};
export const WordByWord = ({ text, config, found, classes }) => {
  if (config.wbw) {
    return (
      <Fragment>
        <Typography paragraph>
          {text.wbw.map((wbw, wI) => (
            <Fragment key={`${wI}`}>
              {' '}
              <strong>
                <Word key={wI} found={found} classes={classes}>
                  {wbw[0]}
                </Word>
              </strong>{' '}
              -{' '}
              <Word key={wI} found={found} classes={classes}>
                {wbw[1]}
              </Word>
              {wI < text.wbw.length - 1 ? ';' : ''}
            </Fragment>
          ))}
        </Typography>
      </Fragment>
    );
  } else {
    return null;
  }
};
export const Translation = ({ text, config, found, classes }) =>
  config.translation ? (
    <Fragment>
      <Typography paragraph>
        <strong>
          <Word found={found} classes={classes}>
            {text.translation}
          </Word>
        </strong>
      </Typography>
    </Fragment>
  ) : (
    ''
  );
export const Purport = ({ text, config, found, classes }) =>
  config.purport && text.purport ? (
    <Fragment>
      <Typography variant="h6">Комментарий</Typography>
      {text.purport.map((s, pI) => (
        <Typography paragraph key={`${pI}`}>
          <Word key={pI} found={found} classes={classes}>
            {s}
          </Word>
        </Typography>
      ))}
      {text.footnote ? <Typography>{text.footnote}</Typography> : ''}
    </Fragment>
  ) : (
    ''
  );
export const TextHeader = ({ text, config, found, classes }) => (
  <>
    <Typography variant="body2">
      <sup>результативность {text.score}</sup>
    </Typography>
    <Typography variant="h6">
      {' '}
      <Link href={`/search/${text.id}`}>Текст {text.id}</Link>
    </Typography>
  </>
);
export const SearchText = ({ text }) => {
  const config = {
    wbw: false,
    translation: false,
    purport: false,
    sanskrit: false,
    footnotes: false,
  };

  const classes = useStyles();
  const found = text.metadata
    ? RegExp(keys(text.metadata).join('|'), 'ig')
    : null;

  forEach(text.metadata, word => {
    forEach(keys(word), item => {
      config[item] = true;
    });
  });
  return (
    <Fragment>
      <TextHeader text={text} config={config} found={found} classes={classes} />
      <Sanskrit text={text} config={config} found={found} classes={classes} />
      <WordByWord text={text} config={config} found={found} classes={classes} />
      <Translation
        text={text}
        config={config}
        found={found}
        classes={classes}
      />
      <Purport text={text} config={config} found={found} classes={classes} />
    </Fragment>
  );
};
