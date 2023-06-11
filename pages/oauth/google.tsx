import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import {useEffect} from 'react';
import {useAppDispatch} from "@/hooks/redux.hook";
import {useRequest} from "@/hooks/useRequest";
import LoadingScreen from "@/content/Applications/LoadingScreen";
import {authService} from "@/services/auth.service";
import jwt_decode from "jwt-decode";
import LocalStorageService from "@/services/storage.service";
import {AUTH_KEYS} from "@/configs/keys.config";
import {useAuthContext} from "@/contexts/AuthContext";

interface GooglePageProps {
  authorizationCode: string
}

function GooglePage(props: GooglePageProps) {
  const {TOKEN, ACCESS_TOKEN, REFRESH_TOKEN, ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_EXPIRES_AT} = AUTH_KEYS;
  const {setAccount} = useAuthContext();
  const {authorizationCode} = props;
  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();

  const [executeLogin] = useRequest<string>({
    request: authorizationCode => authService.loginWithSSO({
      grantType: "authorization_code",
      redirectUri: "http://localhost:3000/oauth/google",
      authorizationCode: authorizationCode,
      service: "google"
    }),
    onResolve: (response: any) => {
      const {access_token, refresh_token, access_token_expires_in} = response;
      const {exp}: any = jwt_decode(access_token);
      LocalStorageService.set(TOKEN, {
        [ACCESS_TOKEN]: access_token,
        [REFRESH_TOKEN]: refresh_token,
        [ACCESS_TOKEN_EXPIRES_IN]: access_token_expires_in,
        [ACCESS_TOKEN_EXPIRES_AT]: exp,
      })
      setAccount({
        data: response?.account
      });
      router.replace("/app/dashboards");
    },
    onReject: () => {
      enqueueSnackbar('Login failed', {
        variant: 'error',
      });
    },
  });

  useEffect(function handleLoginWithGoogle() {
    executeLogin(authorizationCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <LoadingScreen/>
}

export const getServerSideProps = async ({query}) => {
  if (query.code) {
    return {
      props: {
        authorizationCode: query.code,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
      props: {},
    };
  }
};
export default GooglePage;
