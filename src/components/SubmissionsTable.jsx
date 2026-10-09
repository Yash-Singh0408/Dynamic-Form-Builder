import { Download, Inbox } from "lucide-react";

function displayValue(value) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === "" || value === null || value === undefined) return "—";
  return String(value);
}

export default function SubmissionsTable({ schema, submissions, onExport }) {
  const fields = schema.fields;

  return (
    <section className="panel overflow-hidden">
      <div className="panel-heading">
        <div className="flex items-center gap-3">
          <div className="icon-tile"><Inbox size={19} /></div>
          <div>
            <h2 className="section-title">Submissions</h2>
            <p className="section-subtitle">Responses collected in this session</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="count-pill">{submissions.length} {submissions.length === 1 ? "response" : "responses"}</span>
          <button
            type="button"
            className="secondary-button"
            onClick={onExport}
            disabled={submissions.length === 0}
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="empty-table">
          <div className="empty-icon"><Inbox size={23} /></div>
          <p className="font-semibold text-slate-700">No submissions yet</p>
          <p className="mt-1 text-sm text-slate-500">Submit the preview form to see responses here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Submitted at</th>
                {fields.map((field) => <th key={field.name}>{field.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={submission.id}>
                  <td className="font-semibold text-slate-500">{submissions.length - index}</td>
                  <td className="whitespace-nowrap text-slate-500">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </td>
                  {fields.map((field) => (
                    <td key={field.name} className="max-w-64">
                      <span className="block truncate" title={displayValue(submission.data[field.name])}>
                        {displayValue(submission.data[field.name])}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="table-footer">Submissions are stored in memory and will clear when you refresh the page.</div>
    </section>
  );
}