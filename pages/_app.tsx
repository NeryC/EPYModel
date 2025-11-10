import { appWithTranslation } from "next-i18next";
import { config } from "@fortawesome/fontawesome-svg-core";
import { wrapper } from "../store/store";
import { Provider } from "react-redux";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { AppProps } from "next/app";

config.autoAddCss = false;

function MyApp({ Component, ...rest }: AppProps) {
  // Modern pattern for next-redux-wrapper 8
  const { store, props } = wrapper.useWrappedStore(rest);
  
  return (
    <Provider store={store}>
      <Component {...props.pageProps} />
    </Provider>
  );
}

export default appWithTranslation(MyApp);
