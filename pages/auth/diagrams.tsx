import React from 'react';
import Layout from '../../src/components/Layout';
import Mermaid from '../../src/components/Mermaid';

const Diagrams: React.FC = () => {
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
      <div style={{ width: '100%', height: '800px' }}>
        <Mermaid chart={diagram} />
      </div>
      <style jsx>{`
        .node rect,
        .node circle,
        .node polygon,
        .node ellipse,
        .node path {
          fill: #f2f2f2;
          stroke: #333;
          stroke-width: 1.5px;
        }

        .node text {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
          fill: #333;
        }

        .link {
          stroke: #333;
          stroke-width: 1.5px;
        }
      `}</style>
    </Layout>
  );
};

export default Diagrams;
