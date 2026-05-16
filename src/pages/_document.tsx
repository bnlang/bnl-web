import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";

type Props = DocumentInitialProps & { lang: string };

function detectLang(pathname?: string): string {
  if (!pathname) return "bn";
  const seg = pathname.split("/")[1]?.toLowerCase();
  if (seg === "en" || seg === "en-us" || seg === "en-gb") return "en";
  return "bn";
}

export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext): Promise<Props> {
    const initialProps = await Document.getInitialProps(ctx);
    const lang = detectLang(ctx.asPath || ctx.pathname);
    return { ...initialProps, lang };
  }

  render() {
    return (
      <Html lang={this.props.lang}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
