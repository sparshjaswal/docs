---
title: Authentication & Authorization
description: JWT, OAuth 2.0, OpenID Connect, sessions, and cookies — securing your APIs end-to-end.
---

# Authentication & Authorization 🔐

Authentication verifies **who you are**. Authorization determines **what you can do**. Together they form the security backbone of every API.

---

## JWT (JSON Web Token)

JWT is a compact, URL-safe token format for representing claims between two parties. It's self-contained — the payload carries all necessary user information, eliminating server-side session storage.

### Structure

```
eyJhbGciOi.eyJzdWIiOiI.SflKxwRJS
│           │            │
Header      Payload      Signature
```

**Header** — algorithm & token type:
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload** — claims about the user:
```json
{
  "sub": "1234567890",       // subject (user ID)
  "name": "Alice",
  "role": "admin",
  "iat": 1710000000,         // issued at
  "exp": 1710003600          // expiration
}
```

**Signature** — prevents tampering:
```
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### Best Practices

- **Short-lived access tokens** — 15–60 minutes. Use refresh tokens for longer sessions.
- **Store securely**: access token in memory (variable/closure), refresh token in `HttpOnly; Secure; SameSite=Strict` cookie.
- **Never store tokens in `localStorage`** — it's accessible to any JavaScript on the page (XSS vulnerable).
- **Use RS256** (asymmetric) for distributed systems — services can verify with the public key without sharing a secret.
- **Validate all claims**: `exp` (expiry), `iss` (issuer), `aud` (audience), `nbf` (not before).
- **Include only what's needed** in the payload — don't stuff the token with data the server already knows.

### Access Token + Refresh Token Flow

```
1. POST /login { email, password }
2. Server returns { accessToken, refreshToken }
3. Client sends accessToken in Authorization: Bearer <token>
4. When accessToken expires (401) → POST /refresh { refreshToken }
5. Server returns new { accessToken, refreshToken }
6. If refreshToken expired/revoked → redirect to login
```

### Token Validation Middleware (Express)

```javascript
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

---

## OAuth 2.0 🛡️

An open standard for **access delegation** — allows users to grant third-party applications access to their resources without sharing their credentials.

### Grant Types

| Flow | Use Case | Security |
| --- | --- | --- |
| **Authorization Code + PKCE** | SPAs, mobile apps, native apps | ✅ Most secure for public clients |
| **Client Credentials** | Machine-to-machine, service accounts | ✅ No user involved |
| **Authorization Code** | Server-rendered apps (confidential clients) | ✅ Requires client secret |
| **Device Code** | TVs, IoT devices with limited input | ✅ Secure for input-constrained devices |
| **Implicit** | Legacy SPAs | ❌ Deprecated — use PKCE instead |
| **Password** | Migrating legacy systems | ❌ Deprecated — anti-pattern |

### Authorization Code + PKCE Flow

```
1. Client generates code_verifier (random string) and code_challenge (SHA256 hash)
2. GET /authorize?response_type=code&client_id=...&code_challenge=...&code_challenge_method=S256
3. User authenticates at authorization server
4. Browser redirects to callback with ?code=abc123
5. POST /token { code, code_verifier, grant_type: 'authorization_code' }
6. Server returns { access_token, refresh_token, id_token (if OpenID Connect) }
```

---

## OpenID Connect (OIDC) 🆔

An identity layer built **on top of OAuth 2.0**. It adds **authentication** (who you are) to OAuth's **authorization** (what you can access).

**Key additions over OAuth 2.0:**
- **ID Token** — a JWT containing user identity claims (`sub`, `name`, `email`, `preferred_username`)
- **UserInfo endpoint** — `GET /userinfo` returns current user's claims
- **Standardized scopes**: `openid` (required), `profile`, `email`, `address`, `phone`

---

## Sessions & Cookies 🍪

Server-side session management stores user state on the server, identified by a session ID sent via a cookie.

### How It Works

```
1. POST /login { email, password }
2. Server creates session → stores { userId, role, createdAt } in Redis/DB
3. Server responds with Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax
4. Browser automatically sends cookie on every subsequent request
5. Server looks up session → attaches user object to request
6. POST /logout → server deletes session → clears cookie
```

### Security Flags

| Flag | Purpose |
| --- | --- |
| `HttpOnly` | Prevents JavaScript access (`document.cookie`) — mitigates XSS |
| `Secure` | Cookie only sent over HTTPS |
| `SameSite=Strict` | No cross-site requests — strongest CSRF protection |
| `SameSite=Lax` | Allows top-level navigation GET requests — good balance for most apps |
| `SameSite=None` | Cross-site requests allowed (must also have `Secure`) — use for iframe/auth flows |
| `Domain` | Restrict to specific domain (omit for exact-host-only) |
| `Path` | Restrict to specific path (default `/`) |

### Session Storage

| Backend | Pros | Cons |
| --- | --- | --- |
| **Redis** | Fast, TTL built-in, clustering | Data in memory (volatile unless persisted) |
| **Memory (dev only)** | Zero setup | Lost on restart, doesn't scale horizontally |
| **Database (Postgres/MySQL)** | Durable, existing infra | Slower, sessions aren't relational data |

### Session vs JWT Trade-offs

| Criteria | Session | JWT |
| --- | --- | --- |
| **State** | Stateful (server stores) | Stateless (token contains all data) |
| **Revocation** | Instant — delete session | Requires blocklist or short expiry |
| **Horizontal scaling** | Requires shared session store (Redis) | Any server can verify with public key |
| **Payload size** | Cookie is just an ID | Token carries claims (larger header) |
| **Mobile/native support** | Cookie handling varies | Works everywhere (Bearer header) |
| **Logout of all devices** | Delete all sessions for user | Rotate signing key or use blocklist |

[← Back to Backend Engineering](../README.md) · © sparshjaswal
