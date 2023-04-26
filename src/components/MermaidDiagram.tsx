import React from 'react';
import Mermaid from 'react-mermaid2';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  return (
    <div>
      <Mermaid chart={chart} />
    </div>
  );
};

export default MermaidDiagram;
