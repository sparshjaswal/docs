import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveDocRedirect } from '../../src/utils/docRedirect.ts';
const routes = JSON.parse(
  readFileSync(new URL('../system-design-redirects.json', import.meta.url), 'utf8'),
);

test('existing redirect behavior preserves query and fragment', () => {
  assert.equal(
    resolveDocRedirect('/DSA/graphs', '?q=one', '#example'),
    '/DSA/graphs?q=one#example',
  );
});
test('consolidated handbook sections route to their canonical lesson', () => {
  const r = routes['/system-design/README 2'];
  assert.ok(r);
  assert.match(
    resolveDocRedirect(r.to, '?from=bookmark', '#url-shortener', r.hashTargets),
    /^\/system-design\/url-shortener\?from=bookmark(?:#|$)/,
  );
  assert.match(
    resolveDocRedirect(r.to, '', '#oauth-20-and-openid-connect-oidc', r.hashTargets),
    /^\/system-design\/authentication(?:#|$)/,
  );
});
test('unknown and malformed old fragments fall back without invalid anchors', () => {
  const map = { 'old title': '/lesson#new-section' };
  assert.equal(
    resolveDocRedirect('/course', '?q=x', '#old%20title', map),
    '/lesson?q=x#new-section',
  );
  assert.equal(resolveDocRedirect('/course', '', '#missing', map), '/course');
  assert.equal(resolveDocRedirect('/course', '', '#%zz', map), '/course');
  assert.equal(resolveDocRedirect('/course', '', '#toString', map), '/course');
});
