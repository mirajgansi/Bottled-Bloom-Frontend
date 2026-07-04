"use client";

import { ToastContainer } from "react-toastify";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      closeOnClick
      pauseOnHover
      draggable
      newestOnTop
      limit={3}
    />
  );
}
