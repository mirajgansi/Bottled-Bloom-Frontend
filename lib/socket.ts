"use client";

import { io as createIo } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!URL) {
  throw new Error(" NEXT_PUBLIC_BACKEND_URL is not defined");
}

export const socket = createIo(URL, {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
});
