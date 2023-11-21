//get discount as a percentage of initial price
const calculateDiscount = (price: number, discountedPrice: number) => {
  const discount = price - discountedPrice;

  return Math.round((discount * 100) / price);
};

export default calculateDiscount;
