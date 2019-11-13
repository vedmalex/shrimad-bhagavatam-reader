export default function verseTime(text, config) {
  return (
    (config.sanskrit ? text.sanskrit : false) +
    (config.wbw ? text.wbw : false) +
    (config.translation ? text.translation : false) +
    (config.purport && text.purport ? text.purport : false) +
    (config.footnote && text.footnote ? text.footnote : false)
  );
}
