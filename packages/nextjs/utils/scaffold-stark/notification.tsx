import React from "react";
import { type Toast, ToastPosition, toast } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

type NotificationProps = {
  content: React.ReactNode;
  status: "success" | "info" | "loading" | "error" | "warning";
  duration?: number;
  icon?: string;
  position?: ToastPosition;
};

type NotificationOptions = {
  duration?: number;
  icon?: string;
  position?: ToastPosition;
};

const ENUM_STATUSES = {
  success: <CheckCircleIcon className="w-6 h-6 text-white" />,
  loading: <span className="w-5 h-5 loading loading-spinner text-white"></span>,
  error: <ExclamationCircleIcon className="w-6 h-6 text-white" />,
  info: <InformationCircleIcon className="w-6 h-6 text-white" />,
  warning: <ExclamationTriangleIcon className="w-6 h-6 text-white" />,
};

const DEFAULT_DURATION = 3000;
const DEFAULT_POSITION: ToastPosition = "top-center";

/**
 * Custom Notification
 */
const Notification = ({
  content,
  status,
  duration = DEFAULT_DURATION,
  icon,
  position = DEFAULT_POSITION,
}: NotificationProps) => {
  // Background gradients based on status
  const backgroundGradient = {
    success: "bg-gradient-to-r from-green-600 via-green-700 to-green-800",
    error: "bg-gradient-to-r from-red-500 via-red-600 to-red-700",
    info: "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700",
    warning: "bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700",
    loading: "bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700",
  };

  return toast.custom(
    (t: Toast) => (
      <div
        className={`flex flex-row items-center justify-between max-w-sm rounded-lg shadow-2xl text-white p-4 transform transition-all duration-300 ease-in-out space-x-4 ${
          backgroundGradient[status]
        } ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        style={{
          boxShadow:
            "0px 4px 15px rgba(0, 0, 0, 0.3), 0px 0px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex items-center space-x-3">
          <div>{icon ? icon : ENUM_STATUSES[status]}</div>
          <div className="text-sm font-semibold leading-tight">{content}</div>
        </div>
        <button
          className="text-white hover:text-gray-300 transition"
          onClick={() => toast.dismiss(t.id)}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    ),
    {
      duration: status === "loading" ? Infinity : duration,
      position,
    },
  );
};

export const notification = {
  success: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "success", ...options, icon: "✅" });
  },
  info: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "info", ...options });
  },
  warning: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "warning", ...options });
  },
  error: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "error", ...options });
  },
  loading: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "loading", ...options });
  },
  remove: (toastId: string) => {
    toast.remove(toastId);
  },
};
