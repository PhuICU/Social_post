import React from "react";

export default function Alert({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error" | "warning";
  onClose: () => void;
}): React.ReactElement {
  const bgColor =
    type === "success"
      ? "bg-green-50 dark:bg-green-900/20"
      : type === "error"
      ? "bg-red-50 dark:bg-red-900/20"
      : "bg-yellow-50 dark:bg-yellow-900/20";

  const borderColor =
    type === "success"
      ? "border-green-500"
      : type === "error"
      ? "border-red-500"
      : "border-yellow-500";

  const textColor =
    type === "success"
      ? "text-green-500"
      : type === "error"
      ? "text-red-500"
      : "text-yellow-500";

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center px-6 py-4 text-sm border-l-4 rounded shadow-lg ${bgColor} ${borderColor}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-6 h-6 ${textColor} stroke-current`}
        fill="none"
        viewBox="0 0 24 24"
      >
        {type === "success" ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        ) : type === "error" ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        )}
      </svg>
      <div className="ml-3">
        <div
          className={`font-bold text-left ${
            type === "success"
              ? "text-green-800 dark:text-green-200"
              : type === "error"
              ? "text-red-800 dark:text-red-200"
              : "text-yellow-800 dark:text-yellow-200"
          }`}
        >
          {message}
        </div>
      </div>
      <button
        onClick={onClose}
        title="Close alert"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
