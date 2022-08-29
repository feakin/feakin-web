import { ClassRelationship, ClassRelationshipsImpl } from "./class-relationship";
import { EdgeDecorator } from "./edge-decorator";
import { ArrowType } from "./arrow-type";
import { LineStyle } from "./line-style";

function testRenderClassRelationship(ClassRelationship: ClassRelationship): string {
  switch (ClassRelationship) {
    case 'association':
      return "─────>"
    case 'inheritance':
      return "────▷"
    case 'realization':
      return "-----▷"
    case 'implementation':
      return "-----▷"
    case 'dependency':
      return "----->"
    case 'aggregation':
      return "────◇"
    case 'composition':
      return "────◆"
    default:
      return "";
  }
}

function edgeDecoratorToClassRelationShipString(edgeDecorator: EdgeDecorator): string {
  let result = "";
  switch (edgeDecorator.startType) {
    case ArrowType.NONE:
      result += "";
      break;
    case ArrowType.NOTCHED:
      result += "<";
      break;
    case ArrowType.HOLLOW:
      result += "◁";
      break;
    case ArrowType.HOLLOW_CIRCLE:
      result += "○";
      break;
    case ArrowType.HOLLOW_SQUARE:
      result += "□";
      break;
    case ArrowType.HOLLOW_DIAMOND:
      result += "◇";
      break;
    case ArrowType.FILLED:
      result += "◀";
      break;
    case ArrowType.FILLED_CIRCLE:
      result += "●";
      break;
    case ArrowType.FILLED_SQUARE:
      result += "■";
      break;
    case ArrowType.FILLED_DIAMOND:
      result += "◆";
      break;
  }

  const lineRepeat = 5;
  switch (edgeDecorator.lineStyle) {
    case LineStyle.SOLID:
      result += "─".repeat(lineRepeat);
      break;
    case LineStyle.DASH:
      result += "-".repeat(lineRepeat);
      break;
    default:
      result += " ".repeat(lineRepeat);
  }

  switch (edgeDecorator.endType) {
    case ArrowType.NONE:
      result += "";
      break;
    case ArrowType.NOTCHED:
      result += ">";
      break;
    case ArrowType.HOLLOW:
      result += "▷";
      break;
    case ArrowType.HOLLOW_CIRCLE:
      result += "○";
      break;
    case ArrowType.HOLLOW_SQUARE:
      result += "□";
      break;
    case ArrowType.HOLLOW_DIAMOND:
      result += "◇";
      break;
    case ArrowType.FILLED:
      result += "▶";
      break;
    case ArrowType.FILLED_CIRCLE:
      result += "●";
      break;
    case ArrowType.FILLED_SQUARE:
      result += "■";
      break;
    case ArrowType.FILLED_DIAMOND:
      result += "◆";
      break;
  }

  return result;
}

describe('ClassRelationship', () => {
  it('ASSOCIATION', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.ASSOCIATION);
    const result = edgeDecoratorToClassRelationShipString(decorator);
    expect(result).toBe("─────>");
  });

  it('INHERITANCE', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.INHERITANCE);
    const result = edgeDecoratorToClassRelationShipString(decorator);
    expect(result).toBe("─────▷");
  });

  it('REALIZATION', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.REALIZATION);
    const result = edgeDecoratorToClassRelationShipString(decorator);
    expect(result).toBe("-----▷");
  });

  it('IMPLEMENTATION', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.IMPLEMENTATION);
    const result = edgeDecoratorToClassRelationShipString(decorator);
    expect(result).toBe("-----▷");
  });

  it('DEPENDENCY', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.DEPENDENCY);
    const result = edgeDecoratorToClassRelationShipString(decorator);
    expect(result).toBe("----->");
  });

  it('AGGREGATION', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.AGGREGATION);
    const result = edgeDecoratorToClassRelationShipString(decorator);
    expect(result).toBe("─────◇");
  });

  it('COMPOSITION', () => {
    const decorator = ClassRelationshipsImpl.relationToLineStyle(ClassRelationship.COMPOSITION);
    const result = edgeDecoratorToClassRelationShipString(decorator);
    expect(result).toBe("─────◆");
  });
});
