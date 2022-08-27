import { FkTemplate } from "./fk-template";
import { SupportedFileType } from "@feakin/exporter";
import { SupportedCodeLang } from "../type";

export const templates: FkTemplate[] = [
  {
    name: 'concept-map',
    label: 'Concept Map',
    template: {
      sourceType: SupportedFileType.GRAPHVIZ,
      language: SupportedCodeLang.dot,
      content: `digraph {
  "分析阶段" -> "分析方式";
  "编译前" -> ".java, .kotlin, .xml";
  "构建工具" -> "Android Studio/ADT";
  "中间表示解析" -> "ASM/Baksmali";
  "静态代码分析" -> "Android Lint";
  "分析阶段" -> "编译前";
  "分析阶段" -> "编译中";
  "分析阶段" -> "编译后";
  "分析阶段" -> "运行时";
  "分析方式" -> "静态代码分析";
  "分析方式" -> "构建工具";
  "分析方式" -> "中间表示解析";
  "多样化变体/制品" -> "分析阶段";
  "生命周期" -> "多样化变体/制品";
  "Android 依赖分析" -> "生命周期";
  "项目依赖" -> "构建工具";
  "依赖类型" -> "代码依赖";
  "依赖类型" -> "项目依赖";
  "Android 依赖分析" -> "依赖类型";
  "编译中" -> "Gradle";
  "编译后" -> "Dex/Smali";
}`
    }
  },
  {
    name: 'frontend-backend',
    label: 'Frontend-Backend',
    template: {
      sourceType: SupportedFileType.GRAPHVIZ,
      language: SupportedCodeLang.dot,
      content: `digraph {
  compound=true;
  node [ fontname="Handlee" ];
  subgraph cluster_website {
      label="*Website*";

      subgraph cluster_frontend {
          label="*Frontend*";
          React;
          Bootstrap;
      }

      subgraph cluster_backend {
          label="*Backend*";
          expressjs;
          "aws-sdk";
      }
  }

  subgraph cluster_aws {
      label="*AWS*";
      DynamoDb;
      S3;
  }

  React -> expressjs;
  expressjs -> "aws-sdk" [constraint=false];
  "aws-sdk" -> S3 [lhead=cluster_aws];
}
`
    }
  }
]
