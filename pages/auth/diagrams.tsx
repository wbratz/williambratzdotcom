// pages/mermaidDiagram.tsx
import React from 'react';
import Layout from "../../src/components/Layout";
import Mermaid from 'react-mermaid'

const MermaidDiagram: React.FC = () => {
  const diagram = `
    graph LR
      A[Client] -- Request token --> B[Authorization Server]
      B -- Issue token --> A
      A -- Access protected resource with token --> C[Resource Server]
      C -- Validate token --> B
      B -- Token validation result --> C
      C -- Return protected resource if token is valid --> A
  `;

  return (
    <Layout>
      <h1>Mermaid Diagram</h1>
      <Mermaid chart={diagram} />
    </Layout>
  );
};

export default MermaidDiagram;
