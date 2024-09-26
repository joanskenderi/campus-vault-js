const DataField = ({ field, formData, editable, handleInputChange }) => {
  return (
    <div className="w-full relative">
      <label
        className="mb-3 block text-sm font-medium text-dark-primary dark:text-light-primary"
        htmlFor={field.name}
      >
        {field.label}
      </label>
      <input
        className={`w-full rounded border bg-light-primary py-3 pl-2 pr-4.5 text-dark-primary dark:bg-dark-secondary dark:text-light-primary focus:outline-none ${
          editable
            ? 'border-light-blue'
            : 'border-light-tertiary dark:border-dark-secondary'
        }`}
        type={field.type}
        name={field.name}
        id={field.name}
        value={formData[field.name]}
        onChange={handleInputChange}
        readOnly={!editable}
      />
    </div>
  );
};

export default DataField;
