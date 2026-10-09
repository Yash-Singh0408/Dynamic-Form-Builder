import { AlertCircle, Braces, CheckCircle2, RotateCcw } from "lucide-react";

export default function JsonEditor({ value, error, onChange, onReset }) {
  return (
    <section className="panel flex min-h-[600px] flex-col overflow-hidden">
      <div className="panel-heading">
        <div className="flex items-center gap-3">
          <div className="icon-tile"><Braces size={19} /></div>
          <div>
            <h2 className="section-title">JSON schema</h2>
            <p className="section-subtitle">Define fields and validation rules</p>
          </div>
        </div>
        <button type="button" className="icon-button" onClick={onReset} title="Restore sample schema">
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      <div className="editor-status">
        {error ? (
          <span className="status-error"><AlertCircle size={15} /> Schema needs attention</span>
        ) : (
          <span className="status-success"><CheckCircle2 size={15} /> Valid schema</span>
        )}
        <span className="text-xs text-slate-500">JSON</span>
      </div>

      <textarea
        aria-label="JSON schema editor"
        spellCheck="false"
        className={`json-editor flex-1 ${error ? "json-editor-invalid" : ""}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <div role="alert" className="schema-error">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Unable to apply schema</p>
            <p className="mt-1 break-words">{error}</p>
            <p className="mt-2 text-xs opacity-80">Your last valid preview is still available. Fix the JSON to update it.</p>
          </div>
        </div>
      )}
      <div className="editor-footer">
        <span>Tip: field names must be unique.</span>
        <span>{value.length.toLocaleString()} characters</span>
      </div>
    </section>
  );
}