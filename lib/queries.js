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
    chapter: chaptersByNum(num: $chapter) {
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

export const SEARCH_VERSE = gql`
  query search($text: String, $from: Int, $limit: Int) {
    search(text: $text, from: $from, limit: $limit) {
      count
      page
      hasNext
      data {
        score
        metadata
        translation
        purport
        wbw
        sanskrit
        text
        id
      }
    }
  }
`;
