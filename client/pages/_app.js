import React, { useState, useEffect } from "react";
import Head from "next/head";
import { ResetStyle } from "../styles/Reset";
import { GlobalStyle } from "../styles/Global";
import Layout from "../layout";
import { Provider } from "react-redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Middleware from "../Middleware";
import { PagePreloader } from "../components/PagePreloader";
import Router from "next/router";
import { ApolloProvider } from "@apollo/client";
import { client } from "../apollo";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import store from "../redux/store";

function MyApp({ Component, pageProps }) {
  const [preload, setPreload] = useState(true);

  const currentView = Component?.renderData?.currentView
    ? Component.renderData.currentView
    : "Dashboard";
  const headerVisibility = Component?.renderData?.header ? Component.renderData.header : "true";

  // Listen page change
  Router.events.on("routeChangeStart", () => {
    setPreload(true);
  });
  Router.events.on("routeChangeComplete", () => {
    setPreload(false);
    window.scrollTo(0, 0);
  });
  Router.events.on("routeChangeError", () => {
    setPreload(false);
  });

  useEffect(() => {
    setPreload(false);
  }, []);

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#1e1e1e",
      },
      secondary: {
        main: "#ffff01",
      },
    },
  });

  return (
    <>
      <Head>
        <title>School App</title>
      </Head>
      <GlobalStyle />
      <ResetStyle />
      <PagePreloader visible={preload} />

      <Provider store={store}>
        <Middleware authRequired={Component?.renderData?.authRequired} />
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Layout currentView={currentView} headerVisibility={headerVisibility}>
                <Component {...pageProps} />
              </Layout>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </ApolloProvider>
      </Provider>
    </>
  );
}

export default MyApp;
