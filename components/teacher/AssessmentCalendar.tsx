import { AssessmentRow } from "@/components/teacher/AssessmentRow";
import { setAssessment } from "@/app/actions/classes";
import { plannedMonday, totalWeight, type AssessmentTask } from "@/lib/plans/assessments";
import type { AssessmentSetting } from "@/lib/auth-types";

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function weekOf(monday?: string): string {
  if (!monday) return "";
  const [, m, d] = monday.split("-").map(Number);
  return ` (week of ${d} ${MONTH[m - 1]})`;
}

/** The class's assessment calendar: all tasks with weights, a proposed date and a switch for students. */
export function AssessmentCalendar({
  classId,
  courseSlug,
  tasks,
  settings,
  classCode,
}: {
  classId: string;
  courseSlug: string;
  tasks: AssessmentTask[];
  settings: Record<string, AssessmentSetting>;
  classCode?: string;
}) {
  const shown = tasks.filter((x) => settings[x.id]?.visible !== false).length;
  return (
    <div>
      <h3 className="text-base font-semibold">Assessment calendar 2027</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {tasks.length} tasks, {totalWeight(tasks)}% in total. Students see this calendar from day one, in date order with a running total. Until you enter a date, each task
        shows its planned term and week. Enter a date and it replaces that, and you can change it any time. Students are
        told dates are proposed and may change. {shown} of {tasks.length} tasks shown.
      </p>
      {classCode && (
        <a
          href={`/${classCode}/assessments`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
        >
          See what students see →
        </a>
      )}
      <div className="mt-4 space-y-3">
        {tasks.map((x) => (
          <AssessmentRow
            key={x.id}
            no={x.no}
            name={x.name}
            type={x.type}
            weight={x.weight}
            planned={`Term ${x.term}, Week ${x.week}${weekOf(plannedMonday(courseSlug, x))}`}
            tbc={x.tbc}
            covers={x.covers}
            initialVisible={settings[x.id]?.visible !== false}
            initialDate={settings[x.id]?.dueDate ?? ""}
            onSave={setAssessment.bind(null, classId, x.id)}
          />
        ))}
      </div>

    </div>
  );
}
