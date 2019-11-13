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
  query getTexts($chapter: Int!) {
    size: chapterSize(num: $chapter) {
      chapter
      verseCount
    }
    chapters: chaptersByNum(num: $chapter) {
      name
      number
      texts {
        text
        name
        sanskrit
        wbw
        translation
        purport
        footnote
        wordsCount {
          sanskrit
          wbw
          translation
          purport
          footnote
          overall
        }
      }
    }
  }
`;
