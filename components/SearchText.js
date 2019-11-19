import { Typography } from '@material-ui/core';
import { Fragment } from 'react';
import { forEach, keys } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { converter, mapper, transliterations } from 'convert-sanskrit-to-rus';

var replacer = mapper(
  [transliterations.Unicode.index],
  transliterations.XK.index
);

var translite = converter(replacer);

const useStyles = makeStyles({
  highlight: {
    backgroundColor: 'yellow',
    fontStyle: 'italic'
  }
});

const Word = ({ children, found, classes }) => {
  debugger;
  const sample = translite(children);
  if (sample.match(found)) {
    return <span className={classes.highlight}>{children} </span>;
  } else {
    return <>{children} </>;
  }
};

const Sanskrit = ({ text, config, found, classes }) => {
  if (config.sanskrit && text.sanskrit) {
    const result = text.sanskrit.map(line => {
      return line.split(' ');
    });
    return (
      <Typography paragraph>
        <strong>
          {result.map((s, sI) => (
            <Fragment key={`${sI}`}>
              {s.map((w, i) => (
                <Word key={i} found={found} classes={classes}>
                  {w}
                </Word>
              ))}
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
              - {wbw[1]}
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
        <strong>{text.translation}</strong>
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
          {s}
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
    <Typography variant="h6"> Текст {text.id}</Typography>
  </>
);
export const SearchText = ({ text }) => {
  const config = {
    wbw: false,
    translation: false,
    purport: false,
    sanskrit: false,
    footnotes: false
  };

  const classes = useStyles();
  const found = RegExp(keys(text.metadata).join('|'), 'ig');

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
