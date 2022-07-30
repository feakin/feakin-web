export interface Layout {
  run: () => Layout;
}

export interface LayoutOptions {
  elements: object[];
}

export class SimpleLayout implements Layout {
  private options: object;

  constructor(options: LayoutOptions) {
    this.options = options;
  }

  run(): Layout {
    return this;
  }
}
