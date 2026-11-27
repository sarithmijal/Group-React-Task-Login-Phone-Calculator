// ============================================================================
// IMPORTS SECTION
// ============================================================================
// 'useState' is a built-in React Hook that lets this component remember data
// between re-renders (for example, storing the submitted form data to show a
// confirmation summary on screen).
import { useState } from 'react';

// 'useFormik' is a React Hook from the Formik library. It automatically manages
// form state (input values, validation errors, whether a field was touched,
// and form submission) so we do not have to write repetitive state logic by hand.
import { useFormik } from 'formik';

// 'z' is the main object from the Zod library. We use it to define a
// "validation schema" — a set of rules describing what valid form data looks like.
import { z } from 'zod';

// Importing the component's CSS file applies all the visual styles (card layout,
// spacing, colors, error highlights, and confirmation box) to this screen.
import './FormScreen.css';

// ============================================================================
// ZOD VALIDATION SCHEMA
// ============================================================================
// A schema acts like a blueprint or checklist for our form fields.
// Each key in this object MUST match the 'name' attribute of an input in our form.
const registrationSchema = z.object({
  // Full Name validation:
  // - .string(): must be text
  // - .trim(): removes accidental spaces at the beginning or end
  // - .min(1, ...): cannot be empty
  // - .min(3, ...): must be at least 3 characters long
  // - .max(50, ...): cannot exceed 50 characters
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required.')
    .min(3, 'Full name must be at least 3 characters long.')
    .max(50, 'Full name cannot exceed 50 characters.'),

  // Email Address validation:
  // - .email(...): checks that the text follows a standard email pattern
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address (e.g., user@example.com).'),

  // User Role validation (Radio Buttons):
  // - .min(1, ...): ensures the user picked one of the radio options
  role: z
    .string()
    .min(1, 'Please select a user role (Student, Instructor, or Guest).'),

  // Program / Subject validation (Dropdown Select):
  // - .min(1, ...): ensures the user did not leave the default empty option
  program: z
    .string()
    .min(1, 'Please select a program or subject from the dropdown.'),

  // Comments / Description validation (Textarea):
  // - .min(10, ...): encourages a meaningful description
  // - .max(300, ...): keeps the text within a reasonable length
  comments: z
    .string()
    .trim()
    .min(1, 'Comments or description are required.')
    .min(10, 'Description must be at least 10 characters long.')
    .max(300, 'Comments cannot exceed 300 characters.'),
});

// ============================================================================
// TYPESCRIPT TYPES & INTERFACES
// ============================================================================
// z.infer<typeof registrationSchema> automatically creates a TypeScript type
// from our Zod schema so we never have to duplicate field definitions.
// Equivalent to:
// { fullName: string; email: string; role: string; program: string; comments: string; }
type FormValues = z.infer<typeof registrationSchema>;

// 'keyof FormValues' is a union of all valid field names:
// 'fullName' | 'email' | 'role' | 'program' | 'comments'
type FormField = keyof FormValues;

// 'Partial<Record<FormField, string>>' represents an object where any subset
// of our form fields may map to an error message string.
type FormErrors = Partial<Record<FormField, string>>;

// Defines the props (inputs) that the parent component (App.tsx) must pass
// into FormScreen. Here, 'onBack' is a function taking no arguments and returning nothing.
interface FormScreenProps {
  onBack: () => void;
}

// ============================================================================
// ZOD-TO-FORMIK VALIDATION ADAPTER
// ============================================================================
// Formik expects its 'validate' function to return a plain object where each key
// is a field name and its value is an error message string, like:
// { email: 'Email address is required.' }
//
// Zod's .safeParse(values) checks the form values against 'registrationSchema'
// without throwing an exception. Instead, it returns { success: true/false }.
// This helper converts Zod's error list into the exact format Formik needs.
const validateWithZod = (values: FormValues): FormErrors => {
  const result = registrationSchema.safeParse(values);

  // If validation failed, collect the first error message for each invalid field.
  if (!result.success) {
    const errors: FormErrors = {};
    const issues = result.error.issues || [];

    issues.forEach((issue) => {
      // issue.path[0] contains the name of the field that failed validation.
      const fieldName = issue.path[0] as FormField | undefined;
      if (fieldName && !errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    });

    return errors;
  }

  // Returning an empty object tells Formik that all fields are valid!
  return {};
};

// ============================================================================
// STATIC OPTION LISTS FOR RADIO BUTTONS AND DROPDOWN
// ============================================================================
// 'readonly string[]' ensures these constant lists cannot be accidentally modified.
// Keeping options in arrays outside the component avoids recreating them on
// every render and lets us use .map() to generate clean, repetitive JSX.
const ROLE_OPTIONS: readonly string[] = ['Student', 'Instructor', 'Guest'];

const PROGRAM_OPTIONS: readonly string[] = [
  'Computer Science',
  'Software Engineering',
  'Data Science & AI',
  'Web Development',
  'Cybersecurity & Networks',
];

// ============================================================================
// FORM SCREEN COMPONENT
// ============================================================================
// 'onBack' is destructured from FormScreenProps. When called, it tells App.tsx
// to switch the 'vista' state back to 'menu'.
export default function FormScreen({ onBack }: FormScreenProps) {
  // React state to store the validated form data after a successful submission.
  // The generic <FormValues | null> tells TypeScript this state holds either
  // a complete FormValues object or 'null' (when nothing has been submitted yet).
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  // --------------------------------------------------------------------------
  // FORMIK CONFIGURATION (useFormik Hook)
  // --------------------------------------------------------------------------
  // Passing <FormValues> to useFormik gives us full TypeScript autocomplete
  // and type checking on formik.values, formik.errors, and formik.touched.
  // Calling useFormik() creates a 'formik' controller object containing:
  // - formik.values: current text/selection in every field
  // - formik.errors: current validation error messages from validateWithZod
  // - formik.touched: tracks which fields the user has visited/blurred
  // - formik.submitCount: counts how many times the user clicked Submit
  // - formik.handleChange: updates formik.values when the user types/selects
  // - formik.handleBlur: marks a field as "touched" when it loses focus
  // - formik.handleSubmit: runs validation and calls onSubmit only if valid
  // - formik.resetForm: resets all values, errors, and touched states
  const formik = useFormik<FormValues>({
    // Initial empty values for every field in our form.
    initialValues: {
      fullName: '',
      email: '',
      role: '',
      program: '',
      comments: '',
    },

    // Connects our Zod validation adapter to Formik. Formik runs this
    // automatically on change, on blur, and before calling onSubmit.
    validate: validateWithZod,

    // This function ONLY runs if validateWithZod returns {} (zero errors).
    onSubmit: (values: FormValues) => {
      console.log('Form submitted successfully:', values);
      setSubmittedData(values);
    },
  });

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------
  // Resets both Formik's internal state (inputs, errors, touched flags) and
  // our local 'submittedData' summary box so the user can start fresh.
  const handleResetForm = (): void => {
    formik.resetForm();
    setSubmittedData(null);
  };

  // Helper function to check whether a specific field should show its error.
  // Accepting 'fieldName: FormField' prevents typos when checking field errors.
  // We only show an error if:
  // 1. The user has interacted with and left the field (touched) OR clicked Submit, AND
  // 2. There is an actual validation error message for that field.
  const hasFieldError = (fieldName: FormField): boolean =>
    Boolean(
      (formik.touched[fieldName] || formik.submitCount > 0) &&
        formik.errors[fieldName]
    );

  // --------------------------------------------------------------------------
  // JSX RENDER (USER INTERFACE)
  // --------------------------------------------------------------------------
  return (
    <div className="form-card">
      <h2>Registration Form</h2>
      <p className="form-subtitle">
        Complete all required fields below (validated with Formik &amp; Zod)
      </p>

      {/* VISUAL CONFIRMATION SUMMARY:
          Conditional rendering: this block only appears when 'submittedData'
          is not null (i.e., after a valid form submission). */}
      {submittedData && (
        <div className="summary-box" role="status" aria-live="polite">
          <div className="summary-title">
            <span>&#10003;</span> Form submitted successfully!
          </div>
          <div className="summary-item">
            <strong>Full Name:</strong> {submittedData.fullName}
          </div>
          <div className="summary-item">
            <strong>Email Address:</strong> {submittedData.email}
          </div>
          <div className="summary-item">
            <strong>User Role:</strong> {submittedData.role}
          </div>
          <div className="summary-item">
            <strong>Program / Subject:</strong> {submittedData.program}
          </div>
          <div className="summary-item">
            <strong>Comments:</strong> {submittedData.comments}
          </div>
          <button
            type="button"
            className="form-btn-reset"
            onClick={handleResetForm}
          >
            Submit Another Response
          </button>
        </div>
      )}

      {/* MAIN FORM ELEMENT:
          - onSubmit={formik.handleSubmit} intercepts the browser's default page
            reload and runs Formik's validation + submission flow instead.
          - 'noValidate' disables default browser error tooltips so our custom
            React/Zod error messages are displayed consistently. */}
      <form onSubmit={formik.handleSubmit} className="form-column" noValidate>
        {/* 1. TEXT INPUT: FULL NAME */}
        <div className="field-group">
          <label className="field-label" htmlFor="fullName">
            Full Name <span className="required-mark">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="e.g., Jane Doe"
            className={`field-input ${hasFieldError('fullName') ? 'input-error' : ''}`}
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {hasFieldError('fullName') && (
            <p className="error-message">{formik.errors.fullName}</p>
          )}
        </div>

        {/* 2. TEXT INPUT (EMAIL): EMAIL ADDRESS */}
        <div className="field-group">
          <label className="field-label" htmlFor="email">
            Email Address <span className="required-mark">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g., jane.doe@example.com"
            className={`field-input ${hasFieldError('email') ? 'input-error' : ''}`}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {hasFieldError('email') && (
            <p className="error-message">{formik.errors.email}</p>
          )}
        </div>

        {/* 3. MULTIPLE RADIO BUTTONS: USER ROLE */}
        <div className="field-group">
          <span className="field-label">
            User Role <span className="required-mark">*</span>
          </span>
          {/* All radio inputs share the same 'name="role"' so the browser groups
              them together and allows only one option to be selected at a time. */}
          <div className="radio-group" role="radiogroup" aria-label="User Role">
            {ROLE_OPTIONS.map((roleOption) => (
              <label key={roleOption} className="radio-option">
                <input
                  type="radio"
                  name="role"
                  value={roleOption}
                  checked={formik.values.role === roleOption}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span>{roleOption}</span>
              </label>
            ))}
          </div>
          {hasFieldError('role') && (
            <p className="error-message">{formik.errors.role}</p>
          )}
        </div>

        {/* 4. DROPDOWN SELECT: PROGRAM OR SUBJECT */}
        <div className="field-group">
          <label className="field-label" htmlFor="program">
            Program / Subject <span className="required-mark">*</span>
          </label>
          <select
            id="program"
            name="program"
            className={`field-select ${hasFieldError('program') ? 'input-error' : ''}`}
            value={formik.values.program}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {/* Default empty option forces the user to make an explicit choice */}
            <option value="">-- Select an option --</option>
            {PROGRAM_OPTIONS.map((programOption) => (
              <option key={programOption} value={programOption}>
                {programOption}
              </option>
            ))}
          </select>
          {hasFieldError('program') && (
            <p className="error-message">{formik.errors.program}</p>
          )}
        </div>

        {/* 5. TEXT AREA: COMMENTS OR DESCRIPTION */}
        <div className="field-group">
          <label className="field-label" htmlFor="comments">
            Comments / Description <span className="required-mark">*</span>
          </label>
          <textarea
            id="comments"
            name="comments"
            rows={3}
            placeholder="Write your comments here (at least 10 characters)..."
            className={`field-textarea ${hasFieldError('comments') ? 'input-error' : ''}`}
            value={formik.values.comments}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {hasFieldError('comments') && (
            <p className="error-message">{formik.errors.comments}</p>
          )}
        </div>

        {/* ACTION BUTTONS:
            - type="submit": triggers form submission
            - type="button": prevents accidental form submission when resetting
              or returning to the main menu */}
        <div className="form-actions">
          <button type="submit">Submit Form</button>
          <button
            type="button"
            className="form-btn-reset"
            onClick={handleResetForm}
          >
            Reset Fields
          </button>
          <button
            type="button"
            className="form-btn-secondary"
            onClick={onBack}
          >
            Return to Menu
          </button>
        </div>
      </form>
    </div>
  );
}
