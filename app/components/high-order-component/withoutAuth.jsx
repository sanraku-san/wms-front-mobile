import { useSelector } from 'react-redux';
import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';

const withoutAuth = (WrappedComponent) => {
  return function WithoutAuth() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();

    console.log('WithoutAuth: Rendering with isAuthenticated =', isAuthenticated);

    useEffect(() => {
      console.log('WithoutAuth: isAuthenticated changed to', isAuthenticated);
      if (isAuthenticated) {
        console.log('WithoutAuth: Redirecting to /(drawer)/(tabs) with a delay...');
        setTimeout(() => {
          <Redirect href="/(drawer)/(tabs)"/>
          console.log('WithoutAuth: Navigation to /(drawer)/(tabs) attempted.');
        }, 100); 
      }
    }, [isAuthenticated, router]);

    if (isAuthenticated) {
      return null;
    }
    return <WrappedComponent />;
  };
};

export default withoutAuth;