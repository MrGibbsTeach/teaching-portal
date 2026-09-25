export type CourseStatus = "placeholder" | "active";

/**
 * Which of the five visual tiers a course belongs to. Drives the `theme-{tier}`
 * class applied via TierTheme (see components/course/shared/TierTheme.tsx) and
 * the accent colour tokens in app/globals.css.
 */
export type CourseTier = "y7-8" | "y9-10" | "foundations" | "general" | "atar";

export interface Course {
  slug: string;
  title: string;
  yearLevel: string;
  description: string;
  status: CourseStatus;
  tier: CourseTier;
  sourceProject?: string;
}

export const courseGroups: { heading: string; courses: Course[] }[] = [
  {
    heading: "Years 7–8",
    courses: [
      {
        slug: "year-7-digital-technologies",
        title: "Digital Technologies",
        yearLevel: "Year 7",
        description: "Introductory digital technologies curriculum.",
        status: "placeholder",
        tier: "y7-8",
      },
      {
        slug: "year-8-digital-technologies",
        title: "Digital Technologies",
        yearLevel: "Year 8",
        description: "Continuing digital technologies curriculum.",
        status: "placeholder",
        tier: "y7-8",
      },
    ],
  },
  {
    heading: "Years 9–10 — Electives",
    courses: [
      {
        slug: "year-9-digital-innovations",
        title: "Digital Innovations",
        yearLevel: "Year 9",
        description: "Digital innovations elective.",
        status: "placeholder",
        tier: "y9-10",
      },
      {
        slug: "year-10-digital-enterprise",
        title: "Digital Enterprise",
        yearLevel: "Year 10",
        description: "Digital enterprise elective.",
        status: "placeholder",
        tier: "y9-10",
      },
    ],
  },
  {
    heading: "AIT Foundations",
    courses: [
      {
        slug: "year-11-ait-foundations",
        title: "AIT Foundations",
        yearLevel: "Year 11",
        description: "Foundation course in Applied Information Technology: computer basics and everyday applications.",
        status: "active",
        tier: "foundations",
        sourceProject: "ait-foundations-course",
      },
      {
        slug: "year-12-ait-foundations",
        title: "AIT Foundations",
        yearLevel: "Year 12",
        description: "Foundation course in Applied Information Technology: applied digital skills, online ethics and multimedia.",
        status: "active",
        tier: "foundations",
        sourceProject: "ait-foundations-course",
      },
    ],
  },
  {
    heading: "Applied IT — General",
    courses: [
      {
        slug: "year-11-applied-it-general",
        title: "Applied IT — General",
        yearLevel: "Year 11",
        description: "WACE Applied Information Technology, General course.",
        status: "active",
        tier: "general",
        sourceProject: "11-ait-general-course",
      },
      {
        slug: "year-12-applied-it-general",
        title: "Applied IT — General",
        yearLevel: "Year 12",
        description: "WACE Applied Information Technology, General course.",
        status: "active",
        tier: "general",
      },
    ],
  },
  {
    heading: "Applied IT — ATAR",
    courses: [
      {
        slug: "year-11-applied-it-atar",
        title: "Applied IT — ATAR",
        yearLevel: "Year 11",
        description: "WACE Applied Information Technology, ATAR course.",
        status: "active",
        tier: "atar",
        sourceProject: "11-ait-atar-course",
      },
      {
        slug: "year-12-applied-it-atar",
        title: "Applied IT — ATAR",
        yearLevel: "Year 12",
        description: "WACE Applied Information Technology, ATAR course.",
        status: "placeholder",
        tier: "atar",
      },
    ],
  },
];

export const courses: Course[] = courseGroups.flatMap((g) => g.courses);

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
