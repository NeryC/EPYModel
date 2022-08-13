// import "../styles/globals.css";
// import { config } from "@fortawesome/fontawesome-svg-core";
// import GlobalState from "../context/globalStore";
// import "@fortawesome/fontawesome-svg-core/styles.css";

// config.autoAddCss = false;

// function MyApp({ Component, pageProps }) {
//   return (
//     <GlobalState>
//       <Component {...pageProps} />
//     </GlobalState>
//   );
// }

// export default MyApp;

import "../styles/globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { wrapper } from "../store/store";

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default wrapper.withRedux(MyApp);
