import Head from '@docusaurus/Head';
import { Redirect, useLocation } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { resolveDocRedirect } from '../utils/docRedirect';

export default function DocRedirect({
  to,
  hashTargets,
}: {
  to: string;
  hashTargets?: Record<string, string>;
}) {
  const { search, hash } = useLocation();
  const destination = useBaseUrl(resolveDocRedirect(to, search, hash, hashTargets));

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <Redirect to={destination} />
    </>
  );
}
