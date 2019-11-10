export default function verseTime(text, config) {
  return (
    (config.sanskrit ? text.sanskrit : 0) +
    (config.wbw ? text.wbw : 0) +
    (config.translation ? text.translation : 0) +
    (config.purport && text.purport ? text.purport : 0) +
    (config.footnote && text.footnote ? text.footnote : 0)
  );
}
