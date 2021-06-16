import Head from "next/head";
import { ResetStyle } from "../styles/Reset";
import { GlobalStyle } from "../styles/Global";
import Layout from "../layout";
import { Provider } from "react-redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";
import Middleware from "../Middleware";

import store from "../redux/store";

function MyApp({ Component, pageProps }) {
  console.log(Component.renderData, "component");

  const currentView = Component?.renderData?.currentView
    ? Component.renderData.currentView
    : "";

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

      <Provider store={store}>
        <Middleware authRequired={Component?.renderData?.authRequired} />
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={LuxonUtils} locale="es">
            <Layout currentView={currentView}>
              <Component {...pageProps} />
            </Layout>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
