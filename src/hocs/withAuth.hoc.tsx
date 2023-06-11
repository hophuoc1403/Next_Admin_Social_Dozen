import {ComponentType, useEffect} from "react";
import { useRouter } from "next/router";

function withAuth<T extends Record<string, unknown>>(WrappedComponent: ComponentType<T>) {
  // eslint-disable-next-line react/display-name
  return (hocProps: T) => {
    const router = useRouter();
    const isLoggedIn = true;
    useEffect(function onMount() {
      if (!isLoggedIn) {
        router.push('/auth/sign-in');
      }
    }, []);
    return <WrappedComponent {...hocProps as T} />;
  };
}

export default withAuth;