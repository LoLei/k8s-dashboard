import React from 'react';
import '../styles/globals.css';
import '../styles/app.scss';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}
export default MyApp;
