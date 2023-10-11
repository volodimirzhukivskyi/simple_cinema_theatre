import { transactions } from "../constants.js";

export function deleteTransaction  ( row, col)  {
  const findIndex = transactions.findIndex((trans) => {
    return trans.row === row && trans.col === col;
  });
  transactions.splice(findIndex, 1);
  console.log("deleteTransaction");
};
