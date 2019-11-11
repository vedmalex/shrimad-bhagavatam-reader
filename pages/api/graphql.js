import { ApolloServer, gql } from 'apollo-server-micro';
import SB from '../../lib/SB3.json';

const typeDefs = gql`
  type Query {
    chaptersByInterval(filter: [ChapterFilter]): [Chapter]
    chaptersByNum(num: Int, texts: Interval): Chapter
  }

  input Interval {
    start: Int!
    end: Int
  }

  input ChapterFilter {
    chapter: Int!
    texts: Interval
  }

  input VerseDisplayOptions {
    sanskrit: Boolean
    wbw: Boolean
    translation: Boolean
    purport: Boolean
    footnote: Boolean
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
  }
`;

const resolvers = {
  Query: {
    chaptersByNum(_, { num, texts }) {
      let chapter = SB.find(ch => num == ch.number);

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
    // chaptersByInterval(_, { filter }) {
    //   return [...SB.filter(ch => num == ch.number)];
    // },
  },
  // Chapter: {
  //   size: root => {

  //     var last = root.texts[root.texts.length - 1];
  //     return last.text[last.text.length - 1];
  //   },
  // },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
