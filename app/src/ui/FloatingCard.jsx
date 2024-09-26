const FloatingCard = ({
  children,
  title,
  actionButton = null,
  deleteButton = null,
}) => {
  return (
    <div className="rounded-xl border border-light-secondary bg-light-primary px-5 pt-6 pb-2.5 shadow-xl dark:border-dark-secondary dark:bg-dark-primary sm:px-7.5 xl:pb-1 transition transform hover:scale-105 mb-5">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-dark-primary dark:text-light-primary">
          {title}
        </h4>
        <div className="flex flex-row gap-4 pl-5">
          {actionButton} {deleteButton}
        </div>
      </div>
      {children}
    </div>
  );
};

export default FloatingCard;
