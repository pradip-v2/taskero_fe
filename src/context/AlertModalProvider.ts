import { createContext, useContext } from "react";

export type AlertType = {
  type: "error" | "warning" | "success";
  message: string;
};

export type AlertModalContextType = {
  open: (alert: AlertType) => void;
};

export const AlertModalContext = createContext<AlertModalContextType>({
  open: () => {},
});

export const useAlertModal = () => {
  const context = useContext(AlertModalContext);
  return context;
};
