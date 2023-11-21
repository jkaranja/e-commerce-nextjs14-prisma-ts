import { useEffect, useState } from "react";

const usePersist = () => {
  const persistItem = JSON.parse(
    typeof window !== "undefined"
      ? (localStorage.getItem("persist") as string)
      : (null as any)
  );
  //default is true if first timer when localStorage has not been set=null//else use user preference
  const [persist, setPersist] = useState(
    persistItem !== null ? persistItem : true
  );

  useEffect(() => {
    if (typeof window !== "undefined") return;

    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist] as const; //infer a tuple instead of (typeof persist | typeof setPersist)[]
};
export default usePersist;
