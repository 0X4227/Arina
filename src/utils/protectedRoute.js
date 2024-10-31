import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { NearContext } from '@/context';
import { useLocalStorage } from 'usehooks-ts';

const protectedPage = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { signedAccountId } = useContext(NearContext);
    const [user, setUser] = useLocalStorage('user', null);


    useEffect(() => {
      if (!signedAccountId && user != [] ) {

        router.push('/');
      }
    }, [signedAccountId,user]);

    if (!signedAccountId  && user != []) {

      return <p>Redirecting...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default protectedPage;