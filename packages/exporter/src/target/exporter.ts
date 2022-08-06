export interface FeakinExporter {
  export(x: string): string;

  header(): string;

  footer(): string;
}
