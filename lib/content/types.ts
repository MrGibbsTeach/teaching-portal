export interface QuizQuestion {
  id?: string | number;
  questionType: "mcq" | "true_false" | "matching" | "short_answer" | "extended";
  text: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: boolean;
  pairs?: { term: string; definition: string }[];
  marks?: number;
  explanation?: string;
}

export type Block =
  | { type: "heading"; text: string; level?: number }
  | { type: "paragraph"; text: string }
  | { type: "richText"; heading?: string; html: string }
  | { type: "list"; style?: "bullet" | "numbered"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "keyTerm"; term: string; definition: string }
  | { type: "keyTerms"; items: { term: string; definition: string }[] }
  | { type: "callout"; variant?: string; heading?: string; text: string }
  | { type: "divider" }
  | { type: "video"; youtubeId: string; title?: string; caption?: string }
  | {
      type: "grid";
      title?: string;
      items: { icon?: string; photo?: string; label: string; description: string }[];
    }
  | { type: "comparison"; title?: string; items: { label: string; points: string[] }[] }
  | {
      type: "softwareExamples";
      title?: string;
      apps: { name: string; logo?: string; licence?: string; note: string }[];
    }
  | {
      type: "formulaBreakdown";
      title?: string;
      functionName?: string;
      args: { name: string; description: string }[];
    }
  | {
      type: "formulaBuilder";
      title?: string;
      instruction?: string;
      context?: string;
      template: string;
    }
  | {
      type: "scenarioChallenge";
      title?: string;
      scenario?: string;
      questions: { question: string; marks?: number }[];
    }
  | {
      type: "spotTheThreat";
      title?: string;
      instruction?: string;
      emails: {
        isPhishing: boolean;
        from: string;
        subject: string;
        body: string;
        redFlags?: { element: string; detail: string }[];
      }[];
    }
  | { type: "codePreview"; title?: string; defaultCode: string; challenge?: string }
  | { type: "task"; title: string; software?: string; intro?: string; steps: string[] }
  | { type: "quizQuestion"; question: QuizQuestion }
  | {
      type: "activity";
      title?: string;
      instruction?: string;
      pairs?: { term: string; definition: string }[];
      orderedItems?: string[];
      categories?: { label: string; items: string[] }[];
      answer?: string;
      explanation?: string;
    };

export interface Lesson {
  id: string;
  title: string;
  estimatedMinutes?: number;
  blocks: Block[];
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Unit {
  id: string;
  title: string;
  subtitle?: string;
  status: "available" | "coming_soon";
  topics: Topic[];
}

export interface CourseContent {
  slug: string;
  title: string;
  units: Unit[];
}
