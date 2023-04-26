import React, { useEffect, useRef } from 'react';

type MermaidProps = {
  chart: string;
};

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mermaidScript = document.createElement('script');
    mermaidScript.src = 'https://cdn.jsdelivr.net/npm/mermaid@8.11.0/dist/mermaid.min.js';
    mermaidScript.crossOrigin = 'anonymous';
    mermaidScript.addEventListener('load', () => {
      setTimeout(() => {
        if (window.mermaid) {
          window.mermaid.initialize({ startOnLoad: false });
          renderMermaid();
        } else {
          console.error('Mermaid object not available');
        }
      }, 100);
    });
    mermaidScript.addEventListener('error', (err) => {
      console.error('Mermaid script failed to load:', err);
    });
    document.body.appendChild(mermaidScript);

    return () => {
      document.body.removeChild(mermaidScript);
    };
  }, [chart]);

  const renderMermaid = () => {
    if (containerRef.current && window.mermaid) {
      (window.mermaid.render as any)(
        'mermaid-svg',
        chart,
        (svgCode: string) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svgCode;
          }
        }
      );
    }
  };

  return <div ref={containerRef} />;
};

export default Mermaid;
