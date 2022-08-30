import { ClassRelationship, ClassRelationshipsImpl } from "./class-relationship";
import { edgeDecoratorForTest } from "../edge-decorator";

describe('ClassRelationship', () => {
  it('ASSOCIATION', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.ASSOCIATION);
    const result = edgeDecoratorForTest(decorator);
    expect(result).toBe("─────>");
  });

  it('INHERITANCE', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.INHERITANCE);
    const result = edgeDecoratorForTest(decorator);
    expect(result).toBe("─────▷");
  });

  it('REALIZATION', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.REALIZATION);
    const result = edgeDecoratorForTest(decorator);
    expect(result).toBe("-----▷");
  });

  it('IMPLEMENTATION', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.IMPLEMENTATION);
    const result = edgeDecoratorForTest(decorator);
    expect(result).toBe("-----▷");
  });

  it('DEPENDENCY', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.DEPENDENCY);
    const result = edgeDecoratorForTest(decorator);
    expect(result).toBe("----->");
  });

  it('AGGREGATION', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.AGGREGATION);
    const result = edgeDecoratorForTest(decorator);
    expect(result).toBe("─────◇");
  });

  it('COMPOSITION', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.COMPOSITION);
    const result = edgeDecoratorForTest(decorator);
    expect(result).toBe("─────◆");
  });
});
