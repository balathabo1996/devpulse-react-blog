import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/Layout";
import { CommentProvider } from "@/context/CommentContext";

import Head from "next/head";

// Main App component wrapping the application with metadata and layout.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <CommentProvider>
      <Head>
        <title>DevPulse - Developer Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CommentProvider>
  );
}
