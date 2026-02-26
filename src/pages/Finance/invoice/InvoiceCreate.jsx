import { useState } from "react";
import { createInvoice } from "../../services/invoiceService";
import InvoiceHeader from "../../components/invoice/InvoiceHeader";
import BillToSection from "../../components/invoice/BillToSection";
import InvoiceItemsTable from "../../components/invoice/InvoiceItemsTable";
import TermsSection from "../../components/invoice/TermsSection";

export default function InvoiceCreate() {

  const [invoice, setInvoice] = useState({
    invoiceNo: "",
    invoiceDate: "",
    billTo: { address: "", phone: "", email: "" },
    items: [{ description: "", quantity: 1, price: 0, total: 0 }],
    terms: ""
  });

  const handleSave = async () => {
    await createInvoice(invoice);
    alert("Invoice Created");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <InvoiceHeader
        invoice={invoice}
        setInvoice={setInvoice}
      />

      <BillToSection
        billTo={invoice.billTo}
        setBillTo={(data) =>
          setInvoice(prev => ({ ...prev, billTo: data }))
        }
      />

      <InvoiceItemsTable
        items={invoice.items}
        setItems={(data) =>
          setInvoice(prev => ({ ...prev, items: data }))
        }
      />

      <TermsSection
        terms={invoice.terms}
        setTerms={(val) =>
          setInvoice(prev => ({ ...prev, terms: val }))
        }
      />

      <button
        onClick={handleSave}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Invoice
      </button>
    </div>
  );
}