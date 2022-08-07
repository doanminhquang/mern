import { optionselectcontact } from "./optionselectcontact";
import { optionselectaccount } from "./optionselectaccount";

export const getTextDisplayContact = (value) => {
  var arr = optionselectcontact;
  var res = arr.find((o) => o.value === value);
  return res.showtext;
};

export const getTextDisplayUserType = (value) => {
  var arr = optionselectaccount;
  var res = arr.find((o) => o.value === value);
  return res.showtext;
};

export const getCurrencyVnd = (value) => {
  return value === 0
    ? "Miễn phí"
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
};
