import dynamic from 'next/dynamic';

const Admin = dynamic(() => import('../components/admin/App'), { ssr: false });

export default () => <Admin />;
