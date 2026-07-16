import Head from '@docusaurus/Head';

export default function JsonLd({ data }: { data: unknown }) {
  return (
    <Head>
      <script type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
    </Head>
  );
}
