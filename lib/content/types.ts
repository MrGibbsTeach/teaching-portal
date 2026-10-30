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

/** A self-contained 3D animation (an HTML file in /public/animations) shown in an iframe. */
export interface Animation3DBlock {
  type: "animation3d";
  /** Path to the animation file, e.g. "/animations/packet-journey.html". */
  src: string;
  title: string;
  /** Why this animation is here, tied to the lesson. */
  caption?: string;
  /** Pause-and-check questions, one per stage of the animation, with model answers. */
  pauseQuestions?: { stage: string; question: string; answer: string }[];
}

/** Tone used to colour a card. */
export type CardTone = "green" | "red" | "blue" | "amber" | "purple" | "slate";

export interface InfoCard {
  icon?: string;
  heading: string;
  text: string;
  tone?: CardTone;
}

export interface SorterItem {
  text: string;
  /** Index into `categories`. */
  category: number;
  /** Shown after the learner places the item, right or wrong. */
  why: string;
}

export interface BranchChoice {
  text: string;
  correct: boolean;
  feedback: string;
}

export interface BranchStep {
  situation: string;
  prompt: string;
  choices: BranchChoice[];
}

export type Block =
  | { type: "heading"; text: string; level?: number }
  | { type: "infoCards"; title?: string; intro?: string; columns?: 1 | 2 | 3; cards: InfoCard[] }
  | { type: "flipCards"; title?: string; instruction?: string; cards: { front: string; back: string; tag?: string }[] }
  | { type: "sorter"; title?: string; instruction?: string; categories: string[]; items: SorterItem[] }
  | { type: "sequence"; title?: string; instruction?: string; items: string[]; explanation?: string }
  | { type: "branchingScenario"; title?: string; intro?: string; steps: BranchStep[] }
  | {
      type: "placer";
      title?: string;
      instruction?: string;
      /** Trusted authored SVG of the plan; the spots are drawn over it by the component. */
      planSvg: string;
      alt: string;
      spots: { id: string; label: string }[];
      devices: { name: string; correctSpot: string; why: string }[];
    }
  | {
      type: "fileSizeLab";
      title?: string;
      instruction?: string;
      /** Original photo size in pixels. */
      width: number;
      height: number;
      /** What the image is used for, shown in the verdict ("website", "email"...). */
      useCase?: string;
    }
  | { type: "svgFigure"; title?: string; caption?: string; alt: string; svg: string }
  | {
      type: "videoSlot";
      title: string;
      /** YouTube ID once a video is chosen. Leave unset to show the placeholder card. */
      youtubeId?: string;
      /** What the video should show, so whoever sources or films it knows the brief. */
      brief: string;
      minutes?: number;
      watchFor?: string[];
    }
  | Animation3DBlock
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
      svgContent?: string;
      hotspots?: { id: string; label: string; x: number; y: number }[];
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
