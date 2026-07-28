---
title: "Understanding Authorization: A Practical Guide"
slug: auth-intro
date: 2023-04-26
updated: 2026-07-28
description: A practical introduction to authorization, OAuth, OpenID Connect, tokens, scopes, and the decisions behind protecting application resources.
photo: "./blogContent/auth-intro/authorization-system.svg"
banner: "../blogContent/auth-intro/authorization-system.svg"
imageAlt: A diagram showing a client receiving bounded authority from an authorization server before a resource server validates the token and applies policy.
topics:
  - Security
  - Architecture
featured: false
---

Authorization answers a deceptively simple question:

> Is this caller allowed to perform this action on this resource?

The difficult part is that “caller,” “action,” and “resource” can each mean several things. The caller might be a person, a service, or a background job. Permission might come from a role, a scope, ownership, a business rule, or all of them at once.

This guide builds a practical mental model for those decisions and explains where OAuth 2.0, OpenID Connect, access tokens, scopes, and application policy fit.

## Authentication and authorization are different decisions

**Authentication** establishes who or what is making a request.

**Authorization** determines what that identity may do.

A user can authenticate successfully and still be forbidden from reading a particular account. A service can present a valid access token and still lack permission to call a specific endpoint. Authentication supplies identity evidence. Authorization evaluates that evidence against policy and the resource being requested.

Keeping the decisions separate prevents a common mistake: treating “logged in” as equivalent to “allowed.”

## The actors in an OAuth system

An OAuth deployment usually involves these roles:

1. **Resource owner:** The party capable of granting access, often the end user.
2. **Client:** The application requesting access.
3. **Authorization server:** The system that authenticates relevant parties, obtains authorization, and issues tokens.
4. **Resource server:** The API that owns the protected data and enforces access.

The client presents an access token to the resource server:

```http
Authorization: Bearer <access-token>
```

The resource server validates that the token was issued by a trusted authority, was intended for this resource server, has not expired, and carries sufficient authority for the operation. It must still apply its own domain rules.

## OAuth and OpenID Connect solve different problems

[OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749) is an authorization framework. It lets a client obtain limited access to a protected resource.

[OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html) adds an identity layer on top of OAuth 2.0. It gives a client a standardized way to authenticate an end user and receive identity claims in an ID token.

The token types are not interchangeable:

- An **access token** is presented to a resource server to call an API.
- An **ID token** tells an OpenID Connect client about an authentication event and the user it authenticated.
- A **refresh token** lets a client request new access tokens under controlled conditions.

An API should not accept an ID token as though it were an access token.

## Choose the flow by the caller

The safest flow depends on whether a user is present and whether the client can protect credentials.

### User-facing applications

Use the **authorization code flow with PKCE** for browser, mobile, desktop, and server-rendered user-facing applications.

At a high level:

1. The client creates a one-time PKCE verifier and challenge.
2. The browser is redirected to the authorization server.
3. The user authenticates and approves access.
4. The client receives a short-lived authorization code.
5. The client exchanges the code and verifier for tokens.

PKCE binds the authorization code to the client instance that started the flow, reducing the value of a stolen code.

Current OAuth security guidance says clients should not use the implicit grant because it exposes access tokens in the authorization response and creates additional leakage and replay risks. The resource owner password credentials grant must not be used because it asks the client to collect the user’s password and does not fit modern authentication such as passkeys and multifactor flows. See [RFC 9700, OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700).

### Service-to-service access

Use the **client credentials grant** when a service acts on its own behalf and no user is involved.

The resulting token represents the client application, not a person. Do not manufacture a user identity for a machine-to-machine call. If downstream policy needs both the service and an initiating user, use a delegation design that preserves both identities explicitly.

## Access tokens are capabilities

Anyone holding a bearer token can generally use it until it expires or is otherwise rejected. Treat access tokens as credentials, not harmless serialized user profiles.

An access token may be opaque or formatted as a JWT. OAuth does not require JWTs.

With an opaque token, the resource server may use introspection or another shared state mechanism to learn whether the token is active and what it permits.

With a JWT access token, the resource server can often validate locally. It must do more than decode the payload:

- Restrict accepted signature algorithms.
- Validate the signature using trusted key material.
- Validate the issuer.
- Validate that the audience includes this API.
- Validate expiration and any not-before constraint.
- Apply the token type and claim-validation rules expected by this API.
- Reject claims that do not belong in this security context.

[JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725) is the baseline for secure JWT validation.

## Scopes describe delegated authority

A scope is a bounded permission requested by a client and represented in an access token. Good scope names describe resources and actions:

```text
orders.read
orders.write
invoices.approve
```

Use least privilege. A token should be limited to the resource servers, resources, and actions needed for its specific use.

Avoid assuming that write permission automatically implies read permission unless that hierarchy is an explicit policy enforced consistently. `orders.write` and `orders.read` can be independent capabilities. Hidden hierarchy makes reviews and incident analysis harder.

Scopes are also not a replacement for resource-level authorization. A token with `orders.read` may permit access to the orders API while application policy still limits a user to orders from their own organization.

## Roles and policy belong to the application

Roles group permissions around a job or responsibility. They can be useful inputs to authorization, but role checks alone become brittle as systems grow.

Prefer policy that can consider:

- The authenticated subject.
- The client application.
- The requested action.
- The specific resource.
- Tenant or organization boundaries.
- Ownership and relationships.
- Time, environment, or risk signals where appropriate.

This is the difference between “the caller has the administrator role” and “this administrator may approve this invoice for this organization under the current policy.”

Centralize policy decisions where practical, but enforce them at every resource boundary that matters. A hidden user-interface control is not authorization.

## Revocation, expiration, and state are tradeoffs

Short-lived access tokens reduce the window in which a stolen token can be used. Refresh tokens extend a session without making every access token long-lived, but they require stronger protection. Public clients should use refresh-token rotation or sender-constrained refresh tokens as described by RFC 9700.

Locally validated JWTs improve availability and reduce per-request authorization-server calls, but immediate revocation is harder. Opaque tokens and introspection support central state and faster policy changes, but add a network dependency.

Neither model is universally superior. Choose based on:

- How quickly permission changes must take effect.
- The acceptable lifetime of stale authority.
- Availability and latency requirements.
- Operational ability to rotate keys and credentials.
- Audit and incident-response needs.

## Browser storage requires an explicit threat model

Do not put authentication tokens, refresh tokens, or session identifiers in `localStorage` or `sessionStorage`. JavaScript running in the origin can read them, so one cross-site scripting vulnerability can disclose them.

For traditional web applications, a backend-for-frontend or server-managed session with `HttpOnly`, `Secure`, and appropriate `SameSite` cookies often keeps tokens out of browser JavaScript.

Cookies bring their own cross-site request forgery considerations. Use same-site controls, anti-forgery protections where required, a restrictive content security policy, output encoding, and secure transport. Token storage is not a single-setting problem.

## HTTPS is mandatory, not an enhancement

Authorization codes, tokens, cookies, and credentials must travel over authenticated TLS. HTTPS protects confidentiality and integrity in transit and lets clients verify the server they reached.

Also protect the boundaries around TLS:

- Configure trusted reverse proxies carefully.
- Never log access tokens or authorization codes.
- Keep tokens out of URLs.
- Validate redirect URIs exactly.
- Rotate client credentials and signing keys.
- Restrict administrative and diagnostic endpoints.

## A practical resource-server checklist

For every protected request:

1. Extract the credential only from an allowed location.
2. Validate the token using a trusted library and explicit configuration.
3. Verify issuer, audience, lifetime, token type, and signature requirements.
4. Confirm the token grants the required action.
5. Evaluate policy for the exact resource and tenant.
6. Return `401 Unauthorized` when valid authentication credentials are absent or invalid.
7. Return `403 Forbidden` when the caller is authenticated but policy denies the action.
8. Log the decision without logging secrets.
9. Test denial paths as deliberately as success paths.

## The boundary to remember

OAuth gets a token to a client. OpenID Connect communicates an authentication result. A token carries evidence and delegated authority. The resource server still owns the final authorization decision.

Secure systems preserve those boundaries instead of asking one token, role, or framework annotation to answer every question.
