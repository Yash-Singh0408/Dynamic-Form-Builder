import { AlertCircle } from "lucide-react";

export default function FormField({ field, value, errors = [], onChange, onBlur }) {
  const common = {
    id: field.name,
    name: field.name,
    required: Boolean(field.required),
    onBlur: () => onBlur(field.name),
    "aria-invalid": errors.length > 0,
    "aria-describedby": errors.length ? `${field.name}-error` : undefined,
  };

  let control;
  switch (field.type) {
    case "textarea":
      control = (
        <textarea
          {...common}
          className="form-control min-h-28 resize-y"
          placeholder={field.placeholder || ""}
          value={value ?? ""}
          maxLength={field.validation?.maxLength}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
      );
      break;
    case "dropdown":
      control = (
        <select
          {...common}
          className="form-control"
          value={value ?? ""}
          onChange={(event) => onChange(field.name, event.target.value)}
        >
          <option value="">{field.placeholder || "Select an option"}</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
      break;
    case "checkbox":
      control = (
        <label className="checkbox-control" htmlFor={field.name}>
          <input
            {...common}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(field.name, event.target.checked)}
          />
          <span>{field.label}{field.required && <span className="required-mark"> *</span>}</span>
        </label>
      );
      break;
    default:
      control = (
        <input
          {...common}
          className="form-control"
          type={field.type}
          placeholder={field.placeholder || ""}
          value={value ?? ""}
          min={field.type === "number" ? field.validation?.min : undefined}
          max={field.type === "number" ? field.validation?.max : undefined}
          minLength={["text", "email"].includes(field.type) ? field.validation?.minLength : undefined}
          maxLength={["text", "email"].includes(field.type) ? field.validation?.maxLength : undefined}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
      );
  }

  return (
    <div className="field-group">
      {field.type !== "checkbox" && (
        <label className="field-label" htmlFor={field.name}>
          {field.label}
          {field.required && <span className="required-mark"> *</span>}
        </label>
      )}
      {control}
      {field.type === "text" && field.validation?.maxLength && (
        <div className="mt-1 text-right text-xs text-slate-400">
          {String(value ?? "").length}/{field.validation.maxLength}
        </div>
      )}
      {errors.length > 0 && (
        <div id={`${field.name}-error`} role="alert" className="field-error">
          <AlertCircle size={14} />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}