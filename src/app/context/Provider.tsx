"use client";
import React, { useContext, useReducer } from "react";
import { createContext } from "react";

import reducer from "./reducer";
import { IProduct } from "../types/product";

import { IOrder } from "../types/order";
import { IItem } from "../types/cart";

interface ContextType extends Record<string, any> {}

export const Context = createContext<ContextType>({} as ContextType);

type ProviderProps = {
  children: React.ReactNode;
};

export interface InitialState {
  mode: string;
  cart: IItem[];
  token: null;
  order: IOrder | {};
}

export const ContextProvider = ({ children }: ProviderProps) => {
  const initialState: InitialState = {
    token: null,
    mode: "light",
    cart: [],
    order: {},
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
