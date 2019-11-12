import { ApolloServer, gql } from 'apollo-server-micro';
import SB from '../../lib/SB3.json';

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
  type Query {
    chapters: [Chapter]
    chaptersByInterval(filter: [ChapterFilter]): [Chapter]
    chaptersByNum(num: Int, texts: Interval): Chapter
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
    name: String
    number: Int
    texts: [Verse]
    size: Int
  }

  type Verse {
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
  Query: {
    chaptersByNum(_, { num, texts }) {
      let chapter = SB.find(ch => num === ch.number);

      return {
        ...chapter,
        texts: texts
          ? chapter.texts.filter(txt =>
              txt.text.some(
                t => t >= texts.start && (texts.end ? t <= texts.end : true),
              ),
            )
          : chapter.texts,
      };
    },
    chapterSize(_, { num }) {
      return {
        chapter: num,
        verseCount: SB.find(ch => num === ch.number).texts.length,
      };
    },
    chapters() {
      return SB;
    },
    // chaptersByInterval(_, { filter }) {
    //   return [...SB.filter(ch => num == ch.number)];
    // },
  },
  Chapter: {
    size: root => {
      var last = root.texts[root.texts.length - 1];
      return last.text[last.text.length - 1];
    },
  },
  Verse: {
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
