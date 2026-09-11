import { useEffect, useRef } from "react";

function useProctorMode({ onViolation }) {
  const violationCount = useRef(0);

  useEffect(() => {
    // ================= FULLSCREEN LOCK =================
    const enableFullscreen = async () => {
      try {
        const el = document.documentElement;
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen failed:", err);
      }
    };

    enableFullscreen();

    // ================= DETECT TAB SWITCH =================
    const handleVisibilityChange = () => {
      if (document.hidden) {
        violationCount.current += 1;
        onViolation("Tab switch detected");
      }
    };

    // ================= WINDOW BLUR =================
    const handleBlur = () => {
      violationCount.current += 1;
      onViolation("Window focus lost");
    };

    // ================= COPY / PASTE BLOCK =================
    const blockCopy = (e) => {
      e.preventDefault();
      onViolation("Copy attempt detected");
    };

    // ================= RIGHT CLICK BLOCK =================
    const blockContextMenu = (e) => {
      e.preventDefault();
      onViolation("Right click blocked");
    };

    // ================= KEYBOARD BLOCK =================
    const blockKeys = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        onViolation("Developer tools blocked");
      }

      // Ctrl+Shift+I / Ctrl+U / Ctrl+S
      if (
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
        (e.ctrlKey && e.keyCode === 85) ||
        (e.ctrlKey && e.keyCode === 83)
      ) {
        e.preventDefault();
        onViolation("Keyboard shortcut blocked");
      }
    };

    // ================= EVENTS =================
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", blockCopy);
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
    };
  }, [onViolation]);
}

export default useProctorMode;