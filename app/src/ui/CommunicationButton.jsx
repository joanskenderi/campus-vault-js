const CommunicationButton = ({ children, onClick }) => {
  return (
    <button
      className="bg-light-blue hover:bg-dark-blue text-light-primary font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CommunicationButton;
