const StaticCard = ({ children, title, actionButton = null }) => {
  return (
    <div className="rounded-xl border border-light-secondary bg-light-primary px-5 pt-6 pb-2.5 shadow-xl dark:border-dark-secondary dark:bg-dark-primary sm:px-7.5 xl:pb-1 mb-5">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xl font-semibold text-dark-primary dark:text-light-primary">
          {title}
        </h4>
        {actionButton}
      </div>
      {children}
    </div>
  );
};

export default StaticCard;
