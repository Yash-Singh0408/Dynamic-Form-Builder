# Dynamic Form Studio

A complete React + Vite + Tailwind CSS single-page application for creating JSON-driven forms, previewing them live, validating responses, and reviewing submissions.

## Requirements

- Node.js 18+ (Node.js 20+ recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
dynamic-form-studio/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   └── sampleSchema.js
    ├── components/
    │   ├── FormField.jsx
    │   ├── JsonEditor.jsx
    │   ├── FormPreview.jsx
    │   └── SubmissionsTable.jsx
    └── utils/
        ├── schema.js
        └── validation.js
```

## JSON schema format

The root object contains a `fields` array. Every field supports `name`, `label`, `type`, `required`, `placeholder`, and optional `validation` rules. Dropdowns use `options`.

```json
{
  "title": "Contact form",
  "description": "Tell us how to reach you.",
  "submitLabel": "Send response",
  "fields": [
    {
      "name": "fullName",
      "label": "Full name",
      "type": "text",
      "required": true,
      "placeholder": "Jane Doe",
      "validation": {
        "minLength": 2,
        "maxLength": 80
      }
    },
    {
      "name": "email",
      "label": "Email address",
      "type": "email",
      "required": true,
      "placeholder": "jane@example.com"
    },
    {
      "name": "department",
      "label": "Department",
      "type": "dropdown",
      "required": true,
      "options": ["Engineering", "Design", "Marketing"]
    }
  ]
}
```

Supported types: `text`, `number`, `email`, `dropdown`, `checkbox`, `textarea`, and `date`.

Validation rules:
- `minLength`, `maxLength`: text length bounds
- `min`, `max`: numeric bounds
- `pattern`: JavaScript regular expression string
- `regex`: also accepted as an alias for `pattern`

## Behaviour and notes

- The editor parses JSON as you type. Valid schemas immediately update the preview without a page reload.
- Invalid JSON displays an error and keeps the last valid schema active.
- Fields validate on blur and on submit. Once a field has been touched, its errors update as the value changes.
- Submitted responses are kept in React memory only. Refreshing the page clears the submissions.
- Checkbox responses are stored as booleans. Each submission gets an ID and timestamp.
- The form renderer and results columns are generated from the current schema; no individual form fields are hardcoded.
