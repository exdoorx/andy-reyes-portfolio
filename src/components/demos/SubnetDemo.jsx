import { useState } from "react";
import { calculateSubnet } from "../../lib/subnet";
import { demoInput, demoLabel } from "./demoStyles";

export default function SubnetDemo() {
  const [value, setValue] = useState("192.168.1.10/24");
  const [rows, setRows] = useState(() => calculateSubnet("192.168.1.10/24").rows);
  const [error, setError] = useState("");

  const calculate = (input) => {
    try {
      const result = calculateSubnet(input);
      setRows(result.rows);
      setError("");
    } catch (caught) {
      setError(caught.message);
      setRows(null);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    calculate(value);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="space-y-2">
        <label htmlFor="subnet-input" className={demoLabel}>
          IPv4 address / prefix length
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="subnet-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className={demoInput}
            placeholder="192.168.1.1/24"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="btn btn-primary shrink-0 px-6">
            Calculate
          </button>
        </div>
      </form>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10" aria-live="polite">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/5">
              <tr>
                <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Field
                </th>
                <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {rows?.map(([label, fieldValue]) => (
                <tr key={label}>
                  <th scope="row" className="px-4 py-2.5 text-left font-medium text-slate-600 dark:text-slate-400">
                    {label}
                  </th>
                  <td className="px-4 py-2.5 font-mono text-slate-950 dark:text-white">{fieldValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Handles common cases including /31 (point-to-point) and /32.
      </p>
    </div>
  );
}
