import React from "react";

interface ErrorModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ open, message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white z-50 p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-2 text-red-600">Error</h2>
        <p className="mb-4 text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
