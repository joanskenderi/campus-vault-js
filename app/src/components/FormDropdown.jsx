const FormDropdown = ({ label = null, name, value, onChange, options }) => (
  <div>
    <label className="mb-3 block text-sm font-medium text-dark-primary dark:text-light-primary">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded border bg-light-primary py-3 pl-2 pr-4.5 text-dark-primary dark:bg-dark-secondary dark:text-light-primary focus:outline-none border-light-tertiary dark:border-dark-secondary"
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default FormDropdown;
