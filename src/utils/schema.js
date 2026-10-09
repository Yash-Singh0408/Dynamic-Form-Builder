export const FIELD_TYPES = [
  "text",
  "number",
  "email",
  "dropdown",
  "checkbox",
  "textarea",
  "date"
];

export function parseSchema(jsonText) {
  let schema;
  try {
    schema = JSON.parse(jsonText);
  } catch (error) {
    return { ok: false, error: `Invalid JSON: ${error.message}` };
  }

  const issue = validateSchemaShape(schema);
  if (issue) return { ok: false, error: issue };
  return { ok: true, schema };
}

export function validateSchemaShape(schema) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return "Schema must be a JSON object.";
  }
  if (!Array.isArray(schema.fields)) {
    return 'Schema must contain a "fields" array.';
  }

  const names = new Set();
  for (let i = 0; i < schema.fields.length; i += 1) {
    const field = schema.fields[i];
    const position = `Field ${i + 1}`;

    if (!field || typeof field !== "object" || Array.isArray(field)) {
      return `${position} must be an object.`;
    }
    if (typeof field.name !== "string" || !field.name.trim()) {
      return `${position} needs a non-empty "name".`;
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(field.name)) {
      return `${position} name "${field.name}" must start with a letter or underscore and contain only letters, numbers, underscores, or hyphens.`;
    }
    if (names.has(field.name)) {
      return `Duplicate field name "${field.name}". Field names must be unique.`;
    }
    names.add(field.name);

    if (typeof field.label !== "string" || !field.label.trim()) {
      return `${position} (${field.name}) needs a non-empty "label".`;
    }
    if (!FIELD_TYPES.includes(field.type)) {
      return `${position} (${field.name}) has an unsupported type. Use: ${FIELD_TYPES.join(", ")}.`;
    }
    if (field.required !== undefined && typeof field.required !== "boolean") {
      return `${position} (${field.name}): "required" must be true or false.`;
    }
    if (field.type === "dropdown") {
      if (!Array.isArray(field.options) || field.options.length === 0 ||
          !field.options.every((option) => typeof option === "string")) {
        return `${position} (${field.name}) is a dropdown and needs a non-empty "options" array of strings.`;
      }
    }
    const rules = field.validation;
    if (rules !== undefined && (!rules || typeof rules !== "object" || Array.isArray(rules))) {
      return `${position} (${field.name}): "validation" must be an object.`;
    }
    if (rules) {
      for (const key of ["minLength", "maxLength", "min", "max"]) {
        if (rules[key] !== undefined && (typeof rules[key] !== "number" || !Number.isFinite(rules[key]))) {
          return `${position} (${field.name}): validation "${key}" must be a number.`;
        }
      }
      const pattern = rules.pattern ?? rules.regex;
      if (pattern !== undefined) {
        if (typeof pattern !== "string") {
          return `${position} (${field.name}): validation "pattern" must be a string.`;
        }
        try {
          new RegExp(pattern);
        } catch {
          return `${position} (${field.name}): "${pattern}" is not a valid regular expression.`;
        }
      }
    }
  }
  return null;
}

export function getInitialValues(schema) {
  return Object.fromEntries(
    schema.fields.map((field) => [field.name, field.type === "checkbox" ? false : ""])
  );
}