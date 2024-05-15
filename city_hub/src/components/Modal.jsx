import React from 'react'

const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-md p-6 w-80">
      <p className="text-primary text-lg font-semibold mb-4">{ message}</p>
      <button onClick={onClose} className="block w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition duration-300 focus:outline-none">
        Cerrar
      </button>
    </div>
  </div>
);

export default Modal;
