import { Fragment } from 'react';
import { Sanskrit } from './Sanskrit';
import { WordByWord } from './WordByWord';
import { Translation } from './Translation';
import { Purport } from './Purport';
import { TextHeader } from './TextHeader';
export const Text = ({ text, config }) => (
  <Fragment>
    <TextHeader text={text} config={config} />
    <Sanskrit text={text} config={config} />
    <WordByWord text={text} config={config} />
    <Translation text={text} config={config} />
    <Purport text={text} config={config} />
  </Fragment>
);
