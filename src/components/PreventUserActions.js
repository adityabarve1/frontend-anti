import { useEffect } from "react";

const PreventUserActions = () => {
  useEffect(() => {
    // Function to prevent right-click
    const handleContextMenu = (event) => event.preventDefault();

    // Function to prevent certain keyboard shortcuts
    const handleKeyDown = (event) => {
      if (
        event.ctrlKey &&
        ["c", "v", "x", "u", "s", "p", "r"].includes(event.key.toLowerCase()) || // Prevent Ctrl + R, Ctrl + U, etc.
        event.key === "F5" || // Prevent F5
        event.key === "F12" || // Prevent F12 (DevTools)
        (event.key === "I" && event.ctrlKey) // Prevent Ctrl + I (DevTools)
      ) {
        event.preventDefault();
      }
    };

    // Function to prevent reload/close with a warning
    const handleBeforeUnload = (event) => {
      const message = "You have an ongoing test. Are you sure you want to leave?";
      event.preventDefault();
      event.returnValue = message;  // Standard for modern browsers
      return message;  // For older browsers
    };

    // Attach event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default PreventUserActions;
