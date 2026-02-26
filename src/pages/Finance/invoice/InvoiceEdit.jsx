import { useEffect, useState } from "react";
import { getInvoice, updateInvoice } from "../../services/invoiceService";

export default function InvoiceEdit({ id }) {

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await getInvoice(id);
      setInvoice(res.data);
    }
    load();
  }, [id]);

  if (!invoice) return <div>Loading...</div>;

  return (
    <InvoiceCreate
      invoice={invoice}
      setInvoice={setInvoice}
      onSave={() => updateInvoice(id, invoice)}
    />
  );
}