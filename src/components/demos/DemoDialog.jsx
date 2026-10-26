import Modal from "../ui/Modal";
import InsuranceDemo from "./InsuranceDemo";
import MathDemo from "./MathDemo";
import SoundsDemo from "./SoundsDemo";
import OrderDemo from "./OrderDemo";
import AppointmentDemo from "./AppointmentDemo";
import CalorieDemo from "./CalorieDemo";
import SubnetDemo from "./SubnetDemo";
import PasswordDemo from "./PasswordDemo";
import PlannerDemo from "./PlannerDemo";
import N8nDemo from "./N8nDemo";
import BugHuntDemo from "./BugHuntDemo";
import SecurityScoutDemo from "./SecurityScoutDemo";

const registry = {
  insurance: InsuranceDemo,
  math: MathDemo,
  sounds: SoundsDemo,
  order: OrderDemo,
  appointment: AppointmentDemo,
  calorie: CalorieDemo,
  subnet: SubnetDemo,
  password: PasswordDemo,
  planner: PlannerDemo,
  n8n: N8nDemo,
  bughunt: BugHuntDemo,
  securityscout: SecurityScoutDemo,
};

// Lazy-loaded by the Projects section so the demo code stays out of the main bundle.
export default function DemoDialog({ id, title, onClose }) {
  const Demo = registry[id];
  return (
    <Modal title={title} onClose={onClose}>
      {Demo ? <Demo /> : null}
      <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500 dark:border-white/10 dark:text-slate-400">
        Runs entirely in your browser. Production versions of these ideas would connect to
        the database schema included with this project, or to a live n8n instance.
      </p>
    </Modal>
  );
}
