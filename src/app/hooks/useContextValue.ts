import { useContext } from "react";
import { Context } from "../context/Provider";

export const useContextValue = () => {
  return useContext(Context);
};
