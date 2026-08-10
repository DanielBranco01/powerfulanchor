"use client";

import { useCatalogue } from "./context";

export default function Toast() {
  const { toastMsg, toastShow } = useCatalogue();

  return (
    <div className={`toast${toastShow ? " show" : ""}`}>
      <span className="tico">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span>{toastMsg}</span>
    </div>
  );
}
