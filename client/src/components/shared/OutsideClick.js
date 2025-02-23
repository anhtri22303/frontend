
import { useEffect, useRef, useCallback } from "react";

const OutsideClick = ({ onOutsideClick, children, className }) => {
  const wrapperRef = useRef(null);

  const handleOutsideClick = useCallback(
    (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onOutsideClick();
      }
    },
    [onOutsideClick]
  );

  useEffect(() => {
    const handleOutsideClickEvent = (event) => handleOutsideClick(event);
    document.addEventListener("mousedown", handleOutsideClickEvent);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClickEvent);
    };
  }, [handleOutsideClick]);

  return (
    <div ref={wrapperRef} className={"z-50 mt-2" + " " + (className && className)}>
      {children}
    </div>
  );
};

export default OutsideClick;
