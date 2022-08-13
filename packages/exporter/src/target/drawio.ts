import { FeakinExporter } from './exporter';

export class DrawioExporter implements FeakinExporter {
  export(_x: string): string {
    return '';
  }

  footer(): string {
    return '';
  }

  header(): string {
    return '';
  }
}
