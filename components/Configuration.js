import {
  FormControl,
  FormGroup,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Slider,
  Select,
  InputLabel,
  MenuItem,
  Link
} from '@material-ui/core';
import { OpenInNew, Search } from '@material-ui/icons';
import { useQuery } from '@apollo/react-hooks';
import { ALL_CHAPTERS_QUERY } from '../lib/queries';
export const Configuration = ({ classes, show, changeShow }) => {
  const change = item => e => {
    e.preventDefault();
    changeShow({
      ...show,
      [item]: e.currentTarget.checked
    });
  };
  const changeVerses = (e, newValue) => {
    e.preventDefault();
    changeShow({
      ...show,
      verseStart: newValue[0],
      verseEnd: newValue[1]
    });
  };
  const changeChapter = event => {
    changeShow({
      ...show,
      chapterStart: event.target.value,
      verseStart: 1,
      verseEnd: 100
    });
  };
  const wordsChange = event => {
    changeShow({
      ...show,
      words: event.target.value
    });
  };
  let {
    data: allChaptersData,
    loading: allChapterLoading,
    error: allChaptersError
  } = useQuery(ALL_CHAPTERS_QUERY);
  let allChapters =
    !allChapterLoading && !allChaptersError
      ? allChaptersData.chapters
      : undefined;
  return (
    <FormControl component="fieldset" className={classes.root}>
      <FormLabel component="legend">Что смотреть</FormLabel>
      <FormGroup aria-label="position" row>
        <FormControlLabel
          checked={!!show.sanskrit}
          control={<Checkbox color="primary" />}
          label="Санскрит"
          onChange={change('sanskrit')}
        />
        <FormControlLabel
          checked={!!show.wbw}
          control={<Checkbox color="primary" />}
          label="Пословный перевод"
          onChange={change('wbw')}
        />
        <FormControlLabel
          checked={!!show.translation}
          control={<Checkbox color="primary" />}
          label="Перевод"
          onChange={change('translation')}
        />
        <FormControlLabel
          checked={!!show.purport}
          control={<Checkbox color="primary" />}
          label="Комментарии"
          onChange={change('purport')}
        />
        <Link
          href={`${global.window ? window.location : '/'}?chapter=${
            show.chapterStart
          }&start=${show.verseStart}&end=${show.verseEnd}&noconfig=1`}
          target="_blank"
        >
          <OpenInNew />
        </Link>
        <Link href={`/search`} target="_blank">
          <Search />
        </Link>
      </FormGroup>
      <FormGroup aria-label="position" column>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Глава</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={show.chapterStart}
            onChange={changeChapter}
          >
            {allChapterLoading ? (
              <MenuItem value={show.chapterStart}>Глава</MenuItem>
            ) : (
              allChapters.map((ch, index) => (
                <MenuItem key={index} value={ch.number}>
                  {ch.number}. {ch.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Slider
          className={classes.slider}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          value={[show.verseStart, show.verseEnd]}
          label="Тексты"
          valueLabelDisplay="on"
          onChange={changeVerses}
          min={1}
          max={show.textCount}
        />
      </FormGroup>
    </FormControl>
  );
};
