export type CourseStatus = "placeholder" | "active";

export interface Course {
  slug: string;
  title: string;
  yearLevel: string;
  description: string;
  status: CourseStatus;
  sourceProject?: string;
}

export const courseGroups: { heading: string; courses: Course[] }[] = [
  {
    heading: "Years 7–10",
    courses: [
      {
        slug: "year-7-digital-technologies",
        title: "Digital Technologies",
        yearLevel: "Year 7",
        description: "Introductory digital technologies curriculum.",
        status: "placeholder",
      },
      {
        slug: "year-8-digital-technologies",
        title: "Digital Technologies",
        yearLevel: "Year 8",
        description: "Continuing digital technologies curriculum.",
        status: "placeholder",
      },
      {
        slug: "year-9-digital-innovations",
        title: "Digital Innovations",
        yearLevel: "Year 9",
        description: "Digital innovations elective.",
        status: "placeholder",
      },
      {
        slug: "year-10-digital-enterprise",
        title: "Digital Enterprise",
        yearLevel: "Year 10",
        description: "Digital enterprise elective.",
        status: "placeholder",
      },
    ],
  },
  {
    heading: "AIT Foundations",
    courses: [
      {
        slug: "ait-foundations",
        title: "AIT Foundations",
        yearLevel: "Year 11 & 12",
        description: "Foundation course in Applied Information Technology.",
        status: "active",
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
        sourceProject: "11-ait-general-course",
      },
      {
        slug: "year-12-applied-it-general",
        title: "Applied IT — General",
        yearLevel: "Year 12",
        description: "WACE Applied Information Technology, General course.",
        status: "active",
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
        sourceProject: "11-ait-atar-course",
      },
      {
        slug: "year-12-applied-it-atar",
        title: "Applied IT — ATAR",
        yearLevel: "Year 12",
        description: "WACE Applied Information Technology, ATAR course.",
        status: "placeholder",
      },
    ],
  },
];

export const courses: Course[] = courseGroups.flatMap((g) => g.courses);

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
