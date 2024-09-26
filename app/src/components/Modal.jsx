import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ children, closeModal }) => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  // close on ESC key press
  useEffect(() => {
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // close on click outside
  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-dark-primary bg-opacity-50"
      onClick={handleClickOutside}
    >
      <div className="bg-light-primary shadow-lg rounded-md max-w-screen-lg w-auto mx-4 my-8 relative p-6">
        <button
          className="absolute top-2 right-2 text-dark-quinary hover:text-dark-secondary"
          onClick={closeModal}
        >
          <FaTimes className="w-4 h-4 text-dark-red" />
        </button>

        <div className="flex items-center justify-center h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
