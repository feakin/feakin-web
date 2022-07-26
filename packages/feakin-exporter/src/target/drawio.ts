import { FeakinExporter } from "./exporter";

export class DrawioExporter implements FeakinExporter {
  export(x: string): string {
    return "";
  }

  footer(): string {
    return "";
  }

  header(): string {
    return "";
  }

}
