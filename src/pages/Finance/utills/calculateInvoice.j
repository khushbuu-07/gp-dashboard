export const calculateInvoice = (invoice) => {
  const itemsTotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const gstAmount = invoice.gstEnabled ? itemsTotal * 0.18 : 0;
  const subTotal = itemsTotal + gstAmount;

  return {
    itemsTotal,
    gstAmount,
    subTotal,
    balanceDue: subTotal
  };
};