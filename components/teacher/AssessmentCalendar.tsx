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
}: {
  classId: string;
  courseSlug: string;
  tasks: AssessmentTask[];
  settings: Record<string, AssessmentSetting>;
}) {
  const shown = tasks.filter((x) => settings[x.id]?.visible).length;
  return (
    <div>
      <h3 className="text-base font-semibold">Assessment calendar 2027</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        All {tasks.length} tasks, {totalWeight(tasks)}% in total. Students see only the tasks you switch on, with the
        proposed date you enter, and they are told dates may change. {shown} of {tasks.length} shown to students now.
      </p>
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
            initialVisible={!!settings[x.id]?.visible}
            initialDate={settings[x.id]?.dueDate ?? ""}
            onSave={setAssessment.bind(null, classId, x.id)}
          />
        ))}
      </div>

    </div>
  );
}
