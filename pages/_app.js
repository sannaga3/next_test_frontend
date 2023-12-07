import dynamic from "next/dynamic";
import "../styles/globals.css";

const Layout = dynamic(() => import("../components/layout/layout"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
