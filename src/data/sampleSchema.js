export const sampleSchema = {
  title: "Student Registration",
  description: "Complete the form below to register your interest.",
  submitLabel: "Submit response",
  fields: [
    {
      name: "fullName",
      label: "Full name",
      type: "text",
      required: true,
      placeholder: "e.g. Aanya Sharma",
      validation: { minLength: 2, maxLength: 60 }
    },
    {
      name: "age",
      label: "Age",
      type: "number",
      required: true,
      placeholder: "e.g. 22",
      validation: { min: 16, max: 100 }
    },
    {
      name: "email",
      label: "Email address",
      type: "email",
      required: true,
      placeholder: "you@example.com",
      validation: { maxLength: 120 }
    },
    {
      name: "course",
      label: "Preferred course",
      type: "dropdown",
      required: true,
      placeholder: "Choose a course",
      options: ["MCA", "MBA", "MSc Computer Science", "Other"]
    },
    {
      name: "interests",
      label: "A little about your interests",
      type: "textarea",
      required: false,
      placeholder: "Share your interests (optional)",
      validation: { maxLength: 300 }
    },
    {
      name: "startDate",
      label: "Preferred start date",
      type: "date",
      required: true,
      placeholder: ""
    },
    {
      name: "updates",
      label: "I agree to receive course updates",
      type: "checkbox",
      required: true,
      placeholder: ""
    }
  ]
};