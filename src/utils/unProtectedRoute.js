import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { NearContext } from '@/context';
import { useLocalStorage } from 'usehooks-ts';

const unProtectedPage = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { signedAccountId } = useContext(NearContext);
    const [user, setUser] = useLocalStorage('user', null);

    useEffect(() => {
      if (signedAccountId && user == []) {
        router.push('/user/');
      }
    }, [signedAccountId,user]);
    

    if (signedAccountId &&  user == []) {
      return <p>Redirecting...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default unProtectedPage;