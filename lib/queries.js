import gql from 'graphql-tag';
export const ALL_CHAPTERS_QUERY = gql`
  {
    chapters {
      name
      number
    }
  }
`;

export const SELECTED_TEXTS = gql`
  query getTexts(
    $chapter: Int!
    $verseStart: Int!
    $verseEnd: Int
    $sanskrit: Boolean!
    $wbw: Boolean!
    $translation: Boolean!
    $purport: Boolean!
    $footnote: Boolean!
  ) {
    size: chapterSize(num: $chapter) {
      chapter
      verseCount
    }
    chapters: chaptersByNum(
      num: $chapter
      texts: { start: $verseStart, end: $verseEnd }
    ) {
      name
      number
      texts {
        text
        name
        sanskrit @include(if: $sanskrit)
        wbw @include(if: $wbw)
        translation @include(if: $translation)
        purport @include(if: $purport)
        footnote @include(if: $footnote)
        wordsCount {
          sanskrit @include(if: $sanskrit)
          wbw @include(if: $wbw)
          translation @include(if: $translation)
          purport @include(if: $purport)
          footnote @include(if: $footnote)
          overall
        }
      }
    }
  }
`;
