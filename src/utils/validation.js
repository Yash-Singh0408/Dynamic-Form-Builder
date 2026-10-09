const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(field, value) {
  const errors = [];
  const rules = field.validation || {};
  const empty = field.type === "checkbox"
    ? value !== true
    : value === undefined || value === null || String(value).trim() === "";

  if (field.required && empty) {
    errors.push(field.type === "checkbox"
      ? "This checkbox must be selected."
      : `${field.label} is required.`);
    return errors;
  }

  // Optional empty values do not need other rules applied.
  if (empty) return errors;

  if (field.type === "email" && !EMAIL_PATTERN.test(String(value))) {
    errors.push("Enter a valid email address.");
  }

  if (["text", "textarea", "email"].includes(field.type)) {
    const length = String(value).length;
    if (rules.minLength !== undefined && length < rules.minLength) {
      errors.push(`Use at least ${rules.minLength} characters.`);
    }
    if (rules.maxLength !== undefined && length > rules.maxLength) {
      errors.push(`Use no more than ${rules.maxLength} characters.`);
    }
  }

  if (field.type === "number") {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      errors.push("Enter a valid number.");
    } else {
      if (rules.min !== undefined && number < rules.min) {
        errors.push(`Value must be at least ${rules.min}.`);
      }
      if (rules.max !== undefined && number > rules.max) {
        errors.push(`Value must be no more than ${rules.max}.`);
      }
    }
  }

  const pattern = rules.pattern ?? rules.regex;
  if (pattern !== undefined && !new RegExp(pattern).test(String(value))) {
    errors.push("Value does not match the required format.");
  }

  return errors;
}

export function validateForm(schema, values) {
  const nextErrors = {};
  schema.fields.forEach((field) => {
    const fieldErrors = validateField(field, values[field.name]);
    if (fieldErrors.length) nextErrors[field.name] = fieldErrors;
  });
  return nextErrors;
}

export function hasErrors(errors) {
  return Object.values(errors).some((fieldErrors) => fieldErrors.length > 0);
}