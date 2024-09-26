const FormField = ({ label, type, name, value, onChange }) => (
  <div>
    <label className="mb-3 block text-sm font-medium text-dark-primary dark:text-light-primary">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded border bg-light-primary py-3 pl-2 pr-4.5 text-dark-primary dark:bg-dark-secondary dark:text-light-primary focus:outline-none border-light-tertiary dark:border-dark-secondary"
    />
  </div>
);

export default FormField;
