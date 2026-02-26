import { useMemo, useState } from "react";
import { exportInvoicePDF } from "../utills/exportInvoicePDF";
import StampSignatureLayer from "../components/StampSignatureLayer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../../../pdf/InvoicePDF";

export default function InvoiceLayout({
  invoice,
  setInvoice,
  readOnly = false,
  mode = "create",
  onSave
}) {

  /* ==============================
     STAMP POSITION
  ============================== */

  const [stampPosition, setStampPosition] = useState({
    x: 450,
    y: 650
  });

  /* ==============================
     CALCULATIONS
  ============================== */

  const calculations = useMemo(() => {
    const itemsTotal = invoice.items.reduce(
      (sum, item) =>
        sum + ((item.quantity || 0) * (item.price || 0)),
      0
    );

    const gstAmount = invoice.gstEnabled
      ? itemsTotal * 0.18
      : 0;

    const subTotal = itemsTotal + gstAmount;

    return {
      itemsTotal,
      gstAmount,
      subTotal,
      balanceDue: subTotal
    };
  }, [invoice.items, invoice.gstEnabled]);


  /* ==============================
     ITEM HANDLERS
  ============================== */

  const updateItem = (index, field, value) => {
    const updated = [...invoice.items];
    updated[index][field] = value;

    setInvoice(prev => ({
      ...prev,
      items: updated
    }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, price: 0 }
      ]
    }));
  };

  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };


  /* ==============================
     RENDER
  ============================== */

  return (
    <div className="bg-gray-200 min-h-screen p-6">
      <div
        id="invoice-area"
        className="bg-white max-w-6xl mx-auto p-8 relative shadow rounded"
      >

        {/* WATERMARK */}
        <img
          src="/logo.png"
          className="absolute top-1/2 left-1/2 w-[300px] opacity-5 
                     -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] pointer-events-none"
          alt=""
        />

        {/* DRAGGABLE STAMP */}
        <StampSignatureLayer
          position={stampPosition}
          setPosition={setStampPosition}
          readOnly={readOnly}
        />

        {/* HEADER */}
        <div className="flex justify-between border-b pb-6 mb-6">
          <div>
            <h1 className="text-lg font-bold text-indigo-900">
              BITMAX TECHNOLOGY PVT LTD
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              BHUTANI ALPHATHUM, Sector 90, Noida <br />
              8595986967 | accounts@bitmaxgroup.com
            </p>
          </div>

          <div className="text-xs space-y-2 w-56">
            <input
              disabled={readOnly}
              value={invoice.invoiceNo}
              onChange={(e) =>
                setInvoice(prev => ({
                  ...prev,
                  invoiceNo: e.target.value
                }))
              }
              placeholder="Invoice No"
              className="border w-full px-2 py-1"
            />

            <input
              disabled={readOnly}
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) =>
                setInvoice(prev => ({
                  ...prev,
                  invoiceDate: e.target.value
                }))
              }
              className="border w-full px-2 py-1"
            />

            <div className="font-semibold">
              GST No: 09AANCB4231E1ZT
            </div>

            <div>
              Balance Due:
              <div className="font-bold">
                ₹ {calculations.balanceDue.toFixed(2)}
              </div>
            </div>
          </div>
        </div>


        {/* BILL TO */}
        <div className="border rounded p-4 text-sm mb-6">
          <h2 className="font-semibold mb-2">BILL TO</h2>

          <textarea
            disabled={readOnly}
            value={invoice.billTo.address}
            onChange={(e) =>
              setInvoice(prev => ({
                ...prev,
                billTo: {
                  ...prev.billTo,
                  address: e.target.value
                }
              }))
            }
            placeholder="Address"
            className="border w-full p-2 mb-2"
          />

          <input
            disabled={readOnly}
            value={invoice.billTo.phone}
            onChange={(e) =>
              setInvoice(prev => ({
                ...prev,
                billTo: {
                  ...prev.billTo,
                  phone: e.target.value
                }
              }))
            }
            placeholder="Phone"
            className="border w-full p-2 mb-2"
          />

          <input
            disabled={readOnly}
            value={invoice.billTo.email}
            onChange={(e) =>
              setInvoice(prev => ({
                ...prev,
                billTo: {
                  ...prev.billTo,
                  email: e.target.value
                }
              }))
            }
            placeholder="Email"
            className="border w-full p-2"
          />
        </div>


        {/* ITEMS TABLE */}
        <table className="w-full border text-sm mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Description</th>
              <th className="border p-2 w-24">Qty</th>
              <th className="border p-2 w-32">Price</th>
              <th className="border p-2 w-32">Total</th>
              {!readOnly && (
                <th className="border p-2 w-20 no-print">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, index) => {
              const itemTotal =
                (item.quantity || 0) * (item.price || 0);

              return (
                <tr key={index}>
                  <td className="border p-2">
                    <input
                      disabled={readOnly}
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      className="w-full border p-1"
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      disabled={readOnly}
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                      className="w-full border p-1"
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      disabled={readOnly}
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", Number(e.target.value))
                      }
                      className="w-full border p-1"
                    />
                  </td>

                  <td className="border p-2 font-medium">
                    ₹ {itemTotal.toFixed(2)}
                  </td>

                  {!readOnly && (
                    <td className="border p-2 text-center no-print">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {!readOnly && (
          <button
            onClick={addItem}
            className="mb-6 bg-blue-600 text-white px-3 py-1 text-sm rounded no-print"
          >
            + Add Item
          </button>
        )}


        {/* SUMMARY */}
        <div className="flex justify-end mb-6">
          <div className="w-72 text-sm space-y-2">

            <div className="flex justify-between">
              <span>Total</span>
              <span>₹ {calculations.itemsTotal.toFixed(2)}</span>
            </div>

            {!readOnly && (
              <div className="flex items-center gap-2 no-print">
                <input
                  type="checkbox"
                  checked={invoice.gstEnabled}
                  onChange={(e) =>
                    setInvoice(prev => ({
                      ...prev,
                      gstEnabled: e.target.checked
                    }))
                  }
                />
                <span>Add GST (18%)</span>
              </div>
            )}

            {invoice.gstEnabled && (
              <div className="flex justify-between">
                <span>GST</span>
                <span>₹ {calculations.gstAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold border-t pt-2 text-indigo-900">
              <span>Balance Due</span>
              <span>₹ {calculations.balanceDue.toFixed(2)}</span>
            </div>
          </div>
        </div>


        {/* TERMS */}
        <div className="border-t pt-4 text-sm">
          <h3 className="font-semibold mb-2">
            TERMS & CONDITIONS
          </h3>

          <textarea
            disabled={readOnly}
            value={invoice.terms}
            onChange={(e) =>
              setInvoice(prev => ({
                ...prev,
                terms: e.target.value
              }))
            }
            rows={4}
            className="border w-full p-2"
          />
        </div>


        {/* BUTTONS */}
        <div className="mt-8 flex gap-4 no-print">
          {!readOnly && (
            <button
              onClick={onSave}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              {mode === "edit"
                ? "Update Invoice"
                : "Save Invoice"}
            </button>
          )}

          <PDFDownloadLink
  document={
    <InvoicePDF
      invoice={invoice}
      calculations={calculations}
    />
  }
  fileName={`${invoice.invoiceNo || "invoice"}.pdf`}
>
  {({ loading }) =>
    loading ? (
      <button className="bg-gray-400 text-white px-4 py-2 rounded text-sm">
        Generating...
      </button>
    ) : (
      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
        Download PDF
      </button>
    )
  }
</PDFDownloadLink>
        </div>

      </div>
    </div>
  );
}