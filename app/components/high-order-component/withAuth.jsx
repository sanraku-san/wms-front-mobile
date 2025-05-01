import {useSelector} from 'react-redux';
import { Redirect } from 'expo-router';

const withAuth = (WrappedComponent) => {
  return function WithAuth() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
      return <Redirect href="/index" />; 
    }
    return <WrappedComponent />;
  }
}

export default withAuth;