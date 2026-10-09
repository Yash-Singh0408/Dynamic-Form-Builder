import { ClipboardList, Send } from "lucide-react";
import FormField from "./FormField";

export default function FormPreview({
  schema,
  values,
  errors,
  onChange,
  onBlur,
  onSubmit,
  successMessage,
}) {
  return (
    <section className="panel preview-panel overflow-hidden">
      <div className="panel-heading">
        <div className="flex items-center gap-3">
          <div className="icon-tile icon-tile-yellow"><ClipboardList size={19} /></div>
          <div>
            <h2 className="section-title">Live form preview</h2>
            <p className="section-subtitle">Try the form as a respondent</p>
          </div>
        </div>
        <span className="live-pill"><span /> LIVE</span>
      </div>

      <div className="preview-content">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Form preview</p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            {schema.title || "Untitled form"}
          </h3>
          {schema.description && (
            <p className="mt-2 text-sm leading-6 text-slate-500">{schema.description}</p>
          )}
          <p className="mt-4 text-xs text-slate-400"><span className="required-mark">*</span> Required fields</p>
        </div>

        {schema.fields.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={30} />
            <p className="mt-3 font-semibold text-slate-700">No fields yet</p>
            <p className="mt-1 text-sm text-slate-500">Add field definitions to the JSON schema.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="space-y-5">
              {schema.fields.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  errors={errors[field.name] || []}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              ))}
            </div>
            <button type="submit" className="primary-button mt-7 w-full">
              <Send size={16} />
              {schema.submitLabel || "Submit response"}
            </button>
            {successMessage && (
              <div role="status" className="success-message">{successMessage}</div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}