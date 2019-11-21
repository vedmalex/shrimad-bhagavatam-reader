import SearchTextDetail from '../../components/SearchTextDetail';
import { useRouter } from 'next/router';

export default () => {
  const router = useRouter();
  const verse = router.query.verse;

  return <SearchTextDetail verse={verse} />;
};
