declare module 'mermaid' {
  export function initialize(config: any): void;
  export function render(
    id: string,
    text: string,
    cb: (svgCode: string) => void
  ): void;
}
