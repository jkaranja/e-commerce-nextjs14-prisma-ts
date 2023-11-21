"use client";
import { useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

const useSetSearchParams = () => {
  const searchParams = useSearchParams()!;
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, encodeURIComponent(value));

      return params.toString();
    },
    [searchParams]
  );

  return createQueryString;
};

export default useSetSearchParams;
