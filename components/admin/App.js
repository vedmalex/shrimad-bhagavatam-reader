import React from 'react';
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest';
import texts from './../../lib/SB3-texts.json';
import chapters from './../../lib/SB3-chapters.json';
import { TextList, TextEdit } from './Texts';
import { ChapterList, ChapterEdit } from './Chapters';
const dataProvider = fakeDataProvider({
  texts,
  chapters
});

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="texts" list={TextList} edit={TextEdit} />
    <Resource name="chapters" list={ChapterList} edit={ChapterEdit} />
  </Admin>
);

export default App;
