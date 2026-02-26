import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createInvoice, getInvoice, updateInvoice } from "./services/invoiceService";
import InvoiceLayout from "./invoice/InvoiceLayout";

export default function InvoicePage() {

  const { mode, id } = useParams();
  const navigate = useNavigate();

  const readOnly = mode === "view";

  const [invoice, setInvoice] = useState({
    invoiceNo: "",
    invoiceDate: "",
    billTo: { address: "", phone: "", email: "" },
    items: [{ description: "", quantity: 1, price: 0, total: 0 }],
    gstEnabled: false,
    terms: ""
  });

  // 🔹 Load data for edit/view
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      fetchInvoice();
    }
  }, [mode, id]);

  const fetchInvoice = async () => {
    const res = await getInvoice(id);
    setInvoice(res.data);
  };

  const handleSave = async () => {
    if (mode === "create") {
      await createInvoice(invoice);
    } else if (mode === "edit") {
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