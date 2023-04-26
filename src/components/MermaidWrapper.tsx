import dynamic from 'next/dynamic';

const MermaidDiagram = dynamic(
  () => import('./MermaidDiagram').then((mod) => mod.default),
  { ssr: false }
);

export default MermaidDiagram;
