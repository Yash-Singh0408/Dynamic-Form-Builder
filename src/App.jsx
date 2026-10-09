import { useEffect, useMemo, useState } from "react";
import { Braces, CircleHelp, FileJson, Layers3, Sparkles } from "lucide-react";
import JsonEditor from "./components/JsonEditor";
import FormPreview from "./components/FormPreview";
import SubmissionsTable from "./components/SubmissionsTable";
import { sampleSchema } from "./data/sampleSchema";
import { getInitialValues, parseSchema } from "./utils/schema";
import { hasErrors, validateField, validateForm } from "./utils/validation";

const sampleJson = JSON.stringify(sampleSchema, null, 2);

export default function App() {
  const [jsonText, setJsonText] = useState(sampleJson);
  const [schema, setSchema] = useState(sampleSchema);
  const [schemaError, setSchemaError] = useState("");
  const [values, setValues] = useState(() => getInitialValues(sampleSchema));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const result = parseSchema(jsonText);
    if (!result.ok) {
      setSchemaError(result.error);
      return;
    }

    setSchemaError("");
    setSchema(result.schema);
    setValues((current) => {
      const next = getInitialValues(result.schema);
      result.schema.fields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(current, field.name)) {
          next[field.name] = current[field.name];
        }
      });
      return next;
    });
    setErrors((current) => {
      const next = {};
      result.schema.fields.forEach((field) => {
        if (current[field.name]) next[field.name] = current[field.name];
      });
      return next;
    });
    setTouched((current) => {
      const next = {};
      result.schema.fields.forEach((field) => {
        if (current[field.name]) next[field.name] = true;
      });
      return next;
    });
    setSuccessMessage("");
  }, [jsonText]);

  const validFieldCount = schema.fields.length;
  const requiredCount = useMemo(
    () => schema.fields.filter((field) => field.required).length,
    [schema]
  );

  function handleChange(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setSuccessMessage("");
    const field = schema.fields.find((item) => item.name === name);
    if (field && touched[name]) {
      const fieldErrors = validateField(field, value);
      setErrors((current) => {
        const next = { ...current };
        if (fieldErrors.length) next[name] = fieldErrors;
        else delete next[name];
        return next;
      });
    }
  }

  function handleBlur(name) {
    setTouched((current) => ({ ...current, [name]: true }));
    const field = schema.fields.find((item) => item.name === name);
    if (!field) return;
    const fieldErrors = validateField(field, values[name]);
    setErrors((current) => {
      const next = { ...current };
      if (fieldErrors.length) next[name] = fieldErrors;
      else delete next[name];
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm(schema, values);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(schema.fields.map((field) => [field.name, true])));
    if (hasErrors(nextErrors)) {
      setSuccessMessage("");
      return;
    }

    const data = Object.fromEntries(
      schema.fields.map((field) => [field.name, values[field.name]])
    );
    setSubmissions((current) => [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, submittedAt: new Date().toISOString(), data },
      ...current,
    ]);
    setValues(getInitialValues(schema));
    setErrors({});
    setTouched({});
    setSuccessMessage("Response submitted successfully.");
  }

  function resetSchema() {
    setJsonText(sampleJson);
    setSuccessMessage("");
  }

  function exportCsv() {
    if (!submissions.length) return;
    const headers = ["Submitted at", ...schema.fields.map((field) => field.label)];
    const escapeCell = (value) => {
      const text = value === null || value === undefined ? "" : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };
    const rows = submissions.map((submission) => [
      new Date(submission.submittedAt).toLocaleString(),
      ...schema.fields.map((field) => submission.data[field.name] ?? ""),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "form-submissions.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen theme-dark">
      <header className="app-header">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="brand-mark"><Layers3 size={22} /></div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">Dynamic Form Studio</h1>
                  </div>
                </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
          <span className="text-slate-400">v1.0.0</span>
            Json workspace
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8 lg:py-9">
        <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
        
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your form, defined by data.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Edit the JSON schema and see your form update instantly. Validate responses and review every submission in one workspace.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Stat icon={<FileJson size={17} />} label="Fields" value={validFieldCount} />
            <Stat icon={<CircleHelp size={17} />} label="Required" value={requiredCount} />
            <Stat icon={<Braces size={17} />} label="Responses" value={submissions.length} />
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
          <JsonEditor value={jsonText} error={schemaError} onChange={setJsonText} onReset={resetSchema} />
          <FormPreview
            schema={schema}
            values={values}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
            successMessage={successMessage}
          />
        </div>

        <div className="mt-5">
          <SubmissionsTable schema={schema} submissions={submissions} onExport={exportCsv} />
        </div>

        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row">
          <span>Dynamic Form Studio · React + Vite + Tailwind CSS</span>
          <span>Responses stay in memory for this browser session.</span>
        </footer>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="min-w-24 rounded-xl border border-slate-200 bg-white px-3 py-3 sm:min-w-28 sm:px-4">
      <div className="mb-2 flex items-center gap-2 text-slate-400">{icon}<span className="text-xs">{label}</span></div>
      <p className="text-xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}