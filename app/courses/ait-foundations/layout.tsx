import { FoundationsThemeRoot } from "@/components/course/foundations/FoundationsThemeRoot";
import { atkinson } from "@/components/course/foundations/font";

export default function FoundationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FoundationsThemeRoot fontVariable={atkinson.variable}>
      {children}
    </FoundationsThemeRoot>
  );
}
