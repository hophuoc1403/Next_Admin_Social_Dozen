import type {ReactElement, ReactNode} from 'react';
import type {NextPage} from 'next';
import type {AppProps} from 'next/app';
import "../src/styles/app.css"
import Head from 'next/head';
import Router, {useRouter} from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {CacheProvider, EmotionCache} from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import {persistor, store} from "@/redux/store";
import {Provider} from "react-redux";
import AppProvider from "@/contexts/AppProvider";
import InnerAppProvider from "@/contexts/InnerAppProvider";
import {PersistGate} from "redux-persist/integration/react";

const clientSideEmotionCache = createEmotionCache();

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
  pageProps: any;
}

function TokyoApp(props: MyAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  nProgress.configure({ showSpinner: false });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>Social Dozen</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
          </Head>
          <AppProvider>
            {router.pathname.startsWith("/app") ? <InnerAppProvider>
              {getLayout(<Component {...pageProps} />)}
            </InnerAppProvider> : getLayout(<Component {...pageProps} />)}
          </AppProvider>
        </CacheProvider>
      </PersistGate>
    </Provider>
  );
}

export default TokyoApp;

export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
  }
  if (metric.label === 'custom') {
  }
}