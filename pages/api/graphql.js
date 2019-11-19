import { ApolloServer, gql } from 'apollo-server-micro';
import SB from '../../lib/SB3-chapters.json';
import sbIndex from '../../lib/SB3-index.json';
import sbIndexResults from '../../lib/SB3-search-results.json';
import SBTexts from '../../lib/SB3-texts.json';
import lunr from 'lunr';

import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
require('lunr-languages/lunr.stemmer.support')(lunr);
require('lunr-languages/lunr.ru')(lunr);

var idx = lunr.Index.load(sbIndex);

function getTextSize(t) {
  var sanskrit = 0;
  var wbw = 0;
  var translation = 0;
  var purport = 0;
  var footnote = 0;

  sanskrit = t.sanskrit.reduce((res, cur) => {
    res += cur.split(/[\-\s]/).length;
    return res;
  }, 0);

  wbw = t.wbw.reduce((res, cur) => {
    res += cur[0].split(/[\-\s]/).length;
    res += cur[1].split(/[\-\s]/).length;
    return res;
  }, 0);

  if (t.purport) {
    purport = t.purport.reduce((res, cur) => {
      res += cur.split(/[\-\s]/).length;
      return res;
    }, 0);
  }

  translation = t.translation.split(/[\-\s]/).length;

  if (t.footnote) {
    footnote = t.footnote.reduce((res, cur) => {
      res += cur.split(/[\-\s]/).length;
      return res;
    }, 0);
  }

  return {
    sanskrit,
    wbw,
    translation,
    purport,
    footnote,
    overall: sanskrit + wbw + translation + (purport || 0) + (footnote || 0),
  };
}

const typeDefs = gql`
  scalar JSON
  scalar JSONObject

  type Query {
    search(text: String): [VerseSearch]
    chapters: [Chapter]
    chaptersByNum(num: Int): Chapter
    chapterSize(num: Int!): ChapterSize
  }

  input Interval {
    start: Int!
    end: Int
  }

  input ChapterFilter {
    chapter: Int!
    texts: Interval
  }

  type ChapterSize {
    chapter: Int
    verseCount: Int
  }

  type verseSize {
    sanskrit: Int
    wbw: Int
    translation: Int
    purport: Int
    footnote: Int
    overall: Int
  }

  input VerseDisplayOptions {
    sanskrit: Boolean!
    wbw: Boolean!
    translation: Boolean!
    purport: Boolean!
    footnote: Boolean!
  }

  type Chapter {
    id: String!
    name: String
    number: Int
    texts(Interval: Interval): [Verse]
    size: Int
  }

  type Verse {
    id: String!
    chapNo: Int
    chapter: Chapter
    text: [Int!]
    name: String
    sanskrit: [String]
    wbw: [[String]]
    translation: String
    purport: [String]
    footnote: String
    wordsCount: verseSize
  }
  type VerseSearch {
    score: Float
    metadata: JSON
    id: String!
    chapNo: Int
    chapter: Chapter
    text: [Int!]
    name: String
    sanskrit: [String]
    wbw: [[String]]
    translation: String
    purport: [String]
    footnote: String
    wordsCount: verseSize
  }
`;

const resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  Query: {
    // env: () => JSON.stringify(process.env),
    chaptersByNum(_, { num }) {
      return SB.find(ch => num === ch.number);
    },
    chapterSize(_, { num }) {
      const texts = SBTexts.filter(t => num === t.chapter);
      const last = texts[texts.length - 1];
      const verse = last.text[last.text.length - 1];
      return {
        chapter: num,
        verseCount: verse,
      };
    },
    chapters() {
      return SB;
    },
    search(_, { text }) {
      if (text) {
        return idx.search(text).map(res => ({
          ...sbIndexResults[res.ref],
          score: res.score,
          metadata: res.matchData.metadata,
        }));
      } else {
        return [];
      }
    },
    // chaptersByInterval(_, { filter }) {
    //   return [...SB.filter(ch => num == ch.number)];
    // },
  },
  Chapter: {
    id: item => `3.${item.number}`,
    size: root => {
      var last = root.texts[root.texts.length - 1];
      return last.text[last.text.length - 1];
    },
    texts: root => SBTexts.filter(t => t.chapter == root.number),
  },
  Verse: {
    id: item => `3.${item.chapter}.${item.name}`,
    chapNo: root => root.chapter,
    chapter: root => SB.find(ch => ch.number == root.chapter),
    wordsCount: verse => {
      return getTextSize(verse);
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
//https://medium.com/@tomanagle/create-a-server-side-rendering-graphql-client-with-next-js-and-apollo-client-acd397f70c64
