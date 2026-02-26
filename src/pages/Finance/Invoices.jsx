import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createInvoice, getInvoice, updateInvoice } from "./services/invoiceService";
import InvoiceLayout from "./invoice/InvoiceLayout";

const initialInvoice = {
  invoiceNo: "",
  invoiceDate: "",
  billTo: { address: "", phone: "", email: "" },
  items: [{ description: "", quantity: 1, price: 0, total: 0 }],
  gstEnabled: false,
  terms: "",
};

export default function InvoicePage() {
  const { mode, id } = useParams();
  const navigate = useNavigate();
  const readOnly = mode === "view";

  const [invoice, setInvoice] = useState(initialInvoice);

  useEffect(() => {
    const loadInvoice = async () => {
      if ((mode === "edit" || mode === "view") && id) {
        const res = await getInvoice(id);
        setInvoice(res?.data || initialInvoice);
      }
    };

    loadInvoice();
  }, [mode, id]);

  const handleSave = async () => {
    if (mode === "create") {
      await createInvoice(invoice);
    } else if (mode === "edit" && id) {
      await updateInvoice(id, invoice);
    }

    navigate("/invoices/list");
  };

  return (
    <InvoiceLayout
      invoice={invoice}
      setInvoice={setInvoice}
      readOnly={readOnly}
      onSave={handleSave}
      mode={mode}
    />
  );
}

