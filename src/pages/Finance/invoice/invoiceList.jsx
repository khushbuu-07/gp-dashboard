import { useEffect, useState } from "react";
import { getInvoices } from "../../services/invoiceService";
import { Link } from "react-router-dom";

export default function InvoiceList() {

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getInvoices();
      setInvoices(res.data);
    }
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Invoices</h2>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Invoice No</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td className="border p-2">{inv.invoiceNo}</td>
              <td className="border p-2">{inv.invoiceDate}</td>
              <td className="border p-2">
                <Link to={`/invoice/view/${inv._id}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}