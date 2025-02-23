
import React from "react";

const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-secondary/10 backdrop-blur-sm backdrop-filter bg-opacity-100"
        onClick={onClose}
      ></div>
      <div
        className={
          "!z-[9999] bg-white rounded p-secondary shadow-lg border border-primary" +
          ` ${className}`
        }
      >
        {children}
      </div>
    </section>
  );
};

export default Modal;
