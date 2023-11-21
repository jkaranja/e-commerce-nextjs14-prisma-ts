import { PaymentMethod, ShippingAddress } from "@prisma/client";

import { IItem } from "./cart";

export interface IOrder {
  address: ShippingAddress;
  items: IItem[]; //cart product has qty + id
  subTotal: number;
  shipping: number;
  discount: number;
  total: number; //subtotal + shipping(-minus coupon discount)
  paymentInfo: {
    method: PaymentMethod; //payment method
    phoneNumber: string; //m-pesa number
  };
}
