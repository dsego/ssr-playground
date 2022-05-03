/** @jsx h */
/** @jsxFrag Fragment */

import { cx } from "../deps.js";

// TODO: auto input field (based on DTO)
// TODO: auto form (based on DTO)

export function FormField({
  name,
  label,
  type = "text",
  value,
  placeholder = "",
  errorMsg,
  options,
  children,
  ...rest
}) {
  const id = `input-field-${name}`;

  return (
    <div class={cx("form-field", !!errorMsg && "input-error-shake")}>
      <label for={name}>{label}</label>
      {type === "textarea"
        ? (
          <textarea
            id={id}
            name={name}
            value={value ?? ""}
            placeholder={placeholder}
            {...rest}
          />
        )
        : (
          <input
            id={id}
            name={name}
            type={type}
            value={value ?? ""}
            placeholder={placeholder}
            {...(options && { list: `${id}-options` })}
            {...rest}
          />
        )}
      {options && type === "text" && (
        <datalist id={`${id}-options`}>
          {options.map((opt) => <option value={opt}>{opt}</option>)}
        </datalist>
      )}
      {!!errorMsg && <span class="form-error-message">{errorMsg}</span>}
      {children}
    </div>
  );
}
