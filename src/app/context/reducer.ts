import { InitialState } from "./Provider";

type ActionType = {
  type: string;
  payload: any;
};

export const reducer = (state: InitialState, action: ActionType) => {
  switch (action.type) {
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };

    // case "UPDATE_SEARCH":
    //   return {
    //     ...state,
    //     filters: {
    //       ...state.filters,
    //       searchQuery: action.payload.toLowerCase(),
    //     },
    //   };

    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, { ...action.payload }],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QTY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, units: item.units + action.payload.count }
            : item
        ),
      };

    case "UPDATE_ORDER":
      return {
        ...state,
        order: { ...state.order, ...action.payload },
      };

    case "RESET_CART": //reset cart and order
      return {
        ...state,
        order: {},
        cart: [],
      };

    default:
      return state;
  }
};

export default reducer;
