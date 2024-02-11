import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "../src/components/Layout";
import Loading from "../src/components/Loading";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Layout>
          <React.Suspense fallback={<Loading />}>
            <Component {...pageProps} />
          </React.Suspense>
        </Layout>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
