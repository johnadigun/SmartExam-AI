export const initAntiCheat = (onViolation) => {
  let switchCount = 0;

  const handleVisibility = () => {
    if (document.hidden) {
      switchCount++;
      console.log("⚠️ Tab switched:", switchCount);

      if (switchCount >= 3) {
        onViolation();
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
  };
};