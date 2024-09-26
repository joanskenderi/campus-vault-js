const PrintPDFButton = ({ handlePrintToPDF }) => {
  return (
    <button
      className="bg-dark-quinary hover:bg-dark-tertiary text-light-primary font-bold py-2 px-4 rounded"
      onClick={handlePrintToPDF}
    >
      Print as PDF
    </button>
  );
};

export default PrintPDFButton;
