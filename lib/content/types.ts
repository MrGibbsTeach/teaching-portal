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

/** Interactive diagram kinds rendered by DiagramRunner. */
export type DiagramKind = "slider" | "drag-arrange" | "connect" | "toggle-state";

export interface InteractiveDiagramBlock {
  type: "interactiveDiagram";
  title?: string;
  instruction?: string;
  kind: DiagramKind;
  /** Kind-specific setup (items, ranges, nodes, ...). Validated by DiagramRunner. */
  config: Record<string, unknown>;
  /** State the learner must reach for the diagram to resolve. */
  goalState: Record<string, unknown>;
  explanation?: string;
}

/** A check run against the learner's rendered HTML/CSS. */
export type CodeTest =
  | { type: "exists"; selector: string; description: string }
  | { type: "count"; selector: string; min: number; description: string }
  | { type: "text"; selector: string; contains: string; description: string }
  | { type: "attr"; selector: string; name: string; contains?: string; description: string }
  | { type: "style"; selector: string; property: string; value: string; description: string };

export interface CodeExerciseBlock {
  type: "codeExercise";
  title: string;
  brief: string;
  starterHtml: string;
  starterCss: string;
  tests: CodeTest[];
  /** Skill credited in the mastery tree when every test passes. */
  skillId?: string;
}

/** A pause point in a video. Playback cannot continue until `block` is answered. */
export interface VideoCheckpoint {
  /** Seconds into the video, or "end" to require the whole video to be watched first. */
  atSeconds: number | "end";
  block: Extract<Block, { type: "quizQuestion" | "activity" | "interactiveDiagram" }>;
}

export type Block =
  | { type: "heading"; text: string; level?: number }
  | { type: "checkpointVideo"; youtubeId: string; title?: string; checkpoints: VideoCheckpoint[] }
  | InteractiveDiagramBlock
  | CodeExerciseBlock
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
  /** Which interaction mode a mastery-tree node opens into (General). */
  mode?: "diagram" | "video";
  blocks: Block[];
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  /** Mastery-tree identity; defaults to the topic id. */
  skillId?: string;
  /** skillIds that must be mastered before this topic unlocks in the tree. */
  prerequisites?: string[];
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
