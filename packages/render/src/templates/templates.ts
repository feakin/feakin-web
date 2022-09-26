import { SupportedFileType } from "@feakin/exporter";

import { FkTemplate } from "./fk-template";
import { SupportedCodeLang } from "../type";

export const templates: FkTemplate[] = [
  {
    name: 'concept-map',
    label: 'Concept Map',
    template: {
      sourceType: SupportedFileType.GRAPHVIZ,
      language: SupportedCodeLang.dot,
      compiledContent: '',
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
      compiledContent: '',
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
  },
  {
    name: 'ddd-booking',
    label: 'DDD Booking',
    template: {
      sourceType: SupportedFileType.Feakin,
      language: SupportedCodeLang.fkl,
      compiledContent: '',
      content: `ContextMap TicketBooking {
  Reservation -> Cinema;
  Reservation -> Movie;
  Reservation -> User;
}

Context Reservation {
  Aggregate Reservation;
}

Aggregate Reservation {
  Entity Ticket, Reservation;
}

Entity Reservation  {
  Struct {
    id: String;
    token: UUID;
    status: ReservationStatus = ReservationStatus.OPEN;
    expiresAt: LocalDateTime;
    createdAt: LocalDateTime;
    screeningId: String;
    screeningStartTime: LocalDateTime;
    name: String;
    surname: String;
    tickets: Set<Ticket>;
    totalPrice: BigDecimal;
  }
}

Entity Ticket  {}

Context Cinema {
  Aggregate Cinema;
}

Aggregate Cinema {
  Entity Cinema, ScreeningRoom, Seat;
}

Entity Cinema { }
Entity ScreeningRoom { }
Entity Seat { }

Context Movie {
  Aggregate Movie;
}

Aggregate Movie {
  Entity Movie, Actor, Publisher;
}

Entity Movie { }
Entity Actor { }
Entity Publisher { }

Context User {
  Aggregate User;
}

Aggregate User {
  Entity User;
}

Entity User {
  Struct {
    id: UUID;
    mobile: String;
    email: String;
    username: String;
    password: String;
    address: String;
  }
}

Entity Payment {
  Struct {
    id: UUID;
    amount: BigDecimal;
    currency: Currency;
    status: PaymentStatus;
    createdAt: LocalDateTime;
  }
}

ValueObject Price { }
ValueObject Notifications { }
`
    }
  }
]
