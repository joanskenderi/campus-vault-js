const Breadcrumb = ({ pageName }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-3xl font-semibold text-dark-primary dark:text-light-primary">
        {pageName}
      </h2>
    </div>
  );
};

export default Breadcrumb;
