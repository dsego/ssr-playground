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
}) {
  return (
    <div class={cx("input-field", !!errorMsg && "input-error")}>
      <label for={name}>{label}</label>
      <input
        id={`input-field-${name}`}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
      />
      {!!errorMsg && <span>{errorMsg}</span>}
    </div>
  );
}
