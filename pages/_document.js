import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@800&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        </Head>
        <script type="text/javascript" src="/assets/js/script.js"></script>
        <body className="font-titleFont">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument