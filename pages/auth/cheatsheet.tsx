import Layout from "../../src/components/Layout";
import React from "react";
import ReactMarkdown from 'react-markdown';
import DownloadButton from './downloadButton';

export default function CheatSheet() {
  const content = `## 1. What is Authorization?

- The process of granting or denying access to specific resources based on a user's or service's privileges.

## 2. Authentication vs. Authorization

- Authentication: Verifying the identity of a user or service.
- Authorization: Determining the level of access a user or service has to specific resources.

## 3. Three Players in Authorization

- Client: Requests a token and uses it to access a protected resource.
- Resource Server: Hosts the protected resource and validates the token from the client.
- Authorization Server: Issues tokens to clients.

## 4. JWT Bearer Tokens

- Used for authorization in underwriting applications.
- Contains claims or scopes and a signature.
- Lifetime-limited; clients need to request new tokens when they expire.

## 5. Scopes and Roles

- Scopes: Define access levels for incoming (resource server) and outgoing (client) interactions.
- Roles: Define access levels based on user roles, e.g., admin or engineering.

## 6. Setting Up Authorization in a New Application

- Register your application in Valet or Auth Admin.
- Create new Auth client, add name, scopes, and submit.
- Add scopes and roles to your application configuration.

## 7. Adding a New Resource to an Existing Application

- Identify the required scopes for the new resource.
- Add them to your client in Valet or Auth Admin.
- Update your application configuration.

## 8. Authorization Hierarchy

- Write scope has higher hierarchy than read scope.
- A token with a write scope can access both read and write resources.

## 9. Handling Large Dependencies

- Consider refactoring your application if it is too large or has too many dependencies.
- Register future gateways with only the scopes they need.`;

  return (
    <Layout>
        <div>
          <ReactMarkdown>{content}</ReactMarkdown>
          <DownloadButton filename="Cheatsheet.md" content={content} />
        </div>
    </Layout>
  );
}
