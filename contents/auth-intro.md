---
title: Understanding Authorization, A Comprehensive Guide
slug: auth-intro
date: 4/26/2023
description: Authorization is an essential component of application security that ensures access control to protected resources. In this guide, we will dive into the fundamentals of authorization and provide a comprehensive understanding of how it works in the context of software development.
photo: "./blogContent/auth-intro/auth_image_sm.jpg"
banner: "../blogContent/auth-intro/auth_image.jpg"
---

# Introduction

Welcome to our comprehensive guide on authorization in the context of software development. In this blog post, we will explore the fundamentals of authorization, the difference between authentication and authorization, and the roles of the three players in the authorization process: the client, the resource server, and the authorization server. Additionally, we will discuss widely used protocols like OAuth 2.0 and OpenID Connect, different authorization flows, secure token storage, and the importance of HTTPS for secure communication. By the end of this guide, you will have a solid understanding of authorization best practices and how to effectively implement them in your software development projects.

# Authentication vs. Authorization

Before diving into the details, it is crucial to understand the difference between authentication and authorization:

Authentication: The process of verifying the identity of a user, device, or system. It typically involves checking if the provided credentials (e.g., username and password) match the stored credentials.
Authorization: The process of determining if an authenticated user, device, or system has the appropriate permissions to access a protected resource.
While authentication is about confirming identities, authorization is about granting access based on those identities.

# OAuth 2.0 and OpenID Connect

OAuth 2.0 and OpenID Connect are widely used protocols for authorization and authentication, respectively. They play an essential role in ensuring secure access to protected resources and user identity management.

## OAuth 2.0

OAuth 2.0 is an industry-standard protocol for authorization. It enables third-party applications to obtain limited access to an HTTP service on behalf of the resource owner. OAuth 2.0 focuses on client developer simplicity while providing specific authorization flows for various application scenarios, such as web applications, mobile apps, and desktop applications.

## OpenID Connect

OpenID Connect (OIDC) is a simple identity layer built on top of the OAuth 2.0 protocol. It allows clients to verify the identity of end-users based on the authentication performed by an authorization server. OIDC also enables clients to obtain basic profile information about the end-user in an interoperable and REST-like manner.

Understanding these protocols is crucial for grasping the concepts of authorization and authentication in modern web applications. In the following sections, we will dive deeper into the authorization process and discuss how it's implemented using various authorization flows.

# OAuth 2.0 Authorization Flows

OAuth 2.0 defines several authorization flows for different types of applications and clients. These flows describe the process of obtaining an access token from an authorization server, which can then be used to access protected resources. The most common OAuth 2.0 flows include:

## Authorization Code Flow

This flow is suitable for web applications where the client (application) can securely store a client secret. The user is redirected to the authorization server for authentication, and upon successful authentication, an authorization code is returned. The client exchanges this code for an access token using its client secret.

## Implicit Flow

The Implicit Flow is designed for clients that cannot securely store a client secret, such as single-page applications running in a browser. In this flow, the access token is returned directly to the client after the user is authenticated, without the need for an authorization code or client secret.

## Client Credentials Flow

The Client Credentials Flow is used by clients to access protected resources on their own behalf, without the need for user interaction. The client authenticates itself with the authorization server using its client credentials (client ID and secret), and an access token is issued directly.

### Resource Owner Password Credentials Flow

This flow allows clients to obtain an access token by providing the user's credentials (username and password) directly to the authorization server. This flow should only be used in scenarios where the client is trusted, such as internal applications or legacy systems that cannot support other authorization flows. This is a less common flow and should only be used when the client can be trusted.

By understanding these different OAuth 2.0 authorization flows, you can choose the most suitable flow for your application and ensure a secure and efficient authorization process.

# The Three Players in the Authorization Process

1. Client: The application or service requesting access to protected resources.

2. Resource Server: The server hosting the protected resources.

3. Authorization Server: The server responsible for issuing tokens with the necessary permissions to access protected resources.

# JWT Bearer Tokens in Authorization

JSON Web Tokens (JWT) are commonly used in the authorization process. A JWT Bearer Token is an encoded token containing a set of claims or scopes and a signature.

Here's a high-level overview of how JWT Bearer Tokens play into authorization:

1. The client reaches out to an authorization server and authenticates itself, usually by providing a clientId, clientSecret, grantType, and scope.

2. The authorization server returns a JWT bearer token that is encoded and contains a set of claims or scopes, and a signature.

3. The client then uses the Bearer token in an HTTP request header, typically in the format Authorization: Bearer {Token}.

4. Once the resource server receives the request, it validates the bearer token by checking the token's signature, issuer, audience, and expiration. If the token is valid, it processes the request and allows the client to access the protected resource.

## Scopes

### Incoming Scopes

Incoming scopes are used when your application acts as the resource server and is validating a token passed by a client as part of an HTTP request in the authorization header. Incoming scopes are registered in the application's configuration settings.

### Outgoing Scopes

Outgoing scopes are used when your application acts as a client and, via an HTTP request, attempts to access a protected resource from a resource server. Outgoing scopes are tied to your application in the authorization system, allowing your application to request a token containing these scopes.

## Roles

Roles are used similarly to scopes but are used when users request a token. Roles can be used to limit access to applications that use login and allow access based on their role.

## Token Revocation and Expiration

When working with access tokens, it is essential to consider token revocation and expiration for security purposes. These mechanisms help prevent unauthorized access to protected resources in case an access token is compromised or an authenticated user's privileges change.

### Token Expiration

Access tokens have a limited lifetime, typically ranging from a few minutes to several hours. Once an access token expires, it can no longer be used to access protected resources. The client must obtain a new access token by re-authenticating with the authorization server or, in some cases, by using a refresh token.

Setting an appropriate expiration time for access tokens is a balance between security and usability. Shorter expiration times reduce the risk of unauthorized access but can lead to more frequent user authentication, potentially affecting the user experience.

### Token Revocation

Token revocation allows you to invalidate an access token before it expires. This is useful in situations where a user's access rights have changed, such as when they are no longer authorized to access a resource or when their account is disabled or deleted.

To revoke an access token, the authorization server typically provides a revocation endpoint that can be called by the client or resource server. When a token is revoked, it can no longer be used to access protected resources, even if it has not yet expired.

Implementing token revocation and expiration mechanisms in your authorization system helps to maintain a secure environment and protect sensitive data from unauthorized access.

# Stateful vs. Stateless Authorization

When designing an authorization system, it's essential to understand the differences between stateful and stateless authorization and choose the appropriate approach based on your application's requirements.

## Stateful Authorization

In stateful authorization, the authorization server maintains a record of each issued access token, along with its associated user information and permissions. When a resource server receives an access token, it communicates with the authorization server to verify the token's validity and retrieve the associated user data and permissions.

Stateful authorization has the advantage of allowing real-time token revocation and more granular control over user access rights. However, it can be more resource-intensive and can introduce latency, as the resource server needs to communicate with the authorization server for each request.

## Stateless Authorization

In stateless authorization, the access token itself contains all the necessary information about the user and their permissions, without the need for the authorization server to maintain a record of issued tokens. JSON Web Tokens (JWTs) are commonly used for stateless authorization, as they can securely encode user data and permissions directly in the token.

Stateless authorization offers better performance and scalability, as the resource server can validate and process access tokens independently, without the need to communicate with the authorization server. 

When choosing between stateful and stateless authorization, consider the performance, scalability, and security requirements of your application and select the approach that best meets your needs.

# Secure Token Storage

Properly handling and storing access tokens is crucial for ensuring the security of your application and protecting user data. Storing access tokens insecurely can lead to unauthorized access and data breaches, so it's essential to follow best practices when handling tokens.

## Token Storage Best Practices

Here are some best practices for secure token storage:

1. Avoid storing tokens in insecure locations: Do not store access tokens in easily accessible locations, such as browser local storage or client-side cookies, as these can be vulnerable to attacks like cross-site scripting (XSS) and cross-site request forgery (CSRF).

2. Use secure cookies for token storage: If you need to store tokens client-side, use secure, HttpOnly cookies, which help prevent XSS attacks and ensure that tokens are only transmitted over encrypted connections.

3. Implement token encryption: Encrypt access tokens before storing them to add an additional layer of security. This helps protect token data even if an attacker gains access to the storage location.

4. Limit token lifetime: Use short-lived access tokens and implement a refresh token mechanism to minimize the potential impact of token theft. Regularly expire and rotate tokens to reduce the risk of unauthorized access.

5. Monitor token usage: Regularly audit and monitor token usage to detect potential security breaches or unauthorized access. Implement logging and alerting mechanisms to notify administrators of suspicious activity.

By following these best practices for secure token storage, you can help protect your application and user data from unauthorized access and security breaches.

# Use HTTPS for Secure Communication

Secure communication is crucial when transmitting sensitive data, such as access tokens, between the client, resource server, and authorization server. Using HTTPS (Hypertext Transfer Protocol Secure) helps ensure that your data remains secure and confidential during transmission.

## Why Use HTTPS?

Here are some reasons to use HTTPS in your application:

1. Data encryption: HTTPS encrypts data transmitted between the client and server, ensuring that it remains confidential and cannot be intercepted or tampered with by malicious third parties.

2. Authentication: HTTPS helps verify the identity of the server or client, ensuring that you're communicating with the intended party and not an imposter.

3. Integrity: HTTPS ensures data integrity by preventing unauthorized modifications to the data during transmission.

## Implementing HTTPS

To implement HTTPS in your application:

1. Obtain an SSL/TLS certificate: Obtain an SSL/TLS certificate from a trusted certificate authority (CA) to enable HTTPS on your server. This certificate helps establish a secure connection and authenticate your server's identity.

2. Configure your server: Configure your server to use the SSL/TLS certificate and enable HTTPS. Depending on your server software, this may involve editing configuration files and restarting the server.

3. Enforce HTTPS: Make sure that all sensitive data, including access tokens, is transmitted over HTTPS. Redirect HTTP requests to HTTPS, and use secure cookies to store tokens if necessary.

By using HTTPS for secure communication in your application, you can help protect sensitive data and ensure the privacy and security of your users.

# Best Practices

My authorization practices have changed a lot in the past couple of years and are likely to continue changing. For the moment, here are some best practices to consider:

## What Incoming Scopes Should an Application Have?

Patterns vary, but generally an application should have at least two scopes: a read scope and a write scope. The Read scope will control access to GET endpoints while Write scope will control access to PUT POST DELETE resources.

## Authorization is Hierarchical

This means that if you have a token with a write scope, you can access all read resources since write has a higher hierarchy than read. However, if you have a token with only a read scope, you cannot access a write resource.

Having a hierarchical authorization scope setup allows you to still be restrictive to services that only read, but give write services the ability to use one scope for all.

## Handling a Large Number of Dependencies and Scope Limitations

You may encounter situations where there is a limitation on the length of the scopes you can request, be mindful when naming your scopes. If you end up hitting the limit for the amount of scopes you can request in a single token, its usually an indicator your application is too large and is taking on too many dependencies, consider breaking your functionality apart. If breaking your application apart is not an option, consider setting up your application to request only the scope needed for a specific dependency call, although this setup is more involved and can accommodate more dependencies. 

In conclusion, understanding and implementing authorization effectively is crucial for maintaining the security of your applications and protecting sensitive data. By following the best practices we've discussed, including defining appropriate incoming and outgoing scopes, adopting a hierarchical approach to authorization, and ensuring secure token storage and communication, you can create a robust authorization system that meets the needs of your users. Remember to stay updated on the latest developments in authorization and security practices, as technology continues to evolve. By doing so, you'll be well-equipped to tackle the challenges of securing your software applications and providing a seamless, secure experience for your users.
