import { useEffect, useRef } from "react";

function useAntiCheat(onViolation) {
  const violations = useRef(0);

  useEffect(() => {
    const addViolation = (reason) => {
      violations.current += 1;

      console.log("ANTI-CHEAT:", reason);

      if (onViolation) {
        onViolation({
          count: violations.current,
          reason,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation("Tab switch detected");
      }
    };

    const handleBlur = () => {
      addViolation("Window lost focus");
    };

    const preventCopy = (e) => {
      e.preventDefault();
      addViolation("Copy attempt");
    };

    const preventPaste = (e) => {
      e.preventDefault();
      addViolation("Paste attempt");
    };

    const preventContextMenu = (e) => {
      e.preventDefault();
      addViolation("Right click attempt");
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener("blur", handleBlur);

    document.addEventListener("copy", preventCopy);
    document.addEventListener("paste", preventPaste);
    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener("blur", handleBlur);

      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("paste", preventPaste);
      document.removeEventListener(
        "contextmenu",
        preventContextMenu
      );
    };
  }, [onViolation]);
}

export default useAntiCheat;