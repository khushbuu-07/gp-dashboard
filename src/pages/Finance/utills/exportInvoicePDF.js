import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportInvoicePDF = async (elementId, fileName) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const noPrintElements = element.querySelectorAll(".no-print");
  const formElements = element.querySelectorAll("input, textarea, select");

  const replacedElements = [];

  try {
    /* =============================
       1️⃣ Hide UI Elements
    ============================= */

    noPrintElements.forEach(el => {
      el.dataset.prevDisplay = el.style.display;
      el.style.display = "none";
    });

    /* =============================
       2️⃣ Replace Inputs with Text
    ============================= */

    formElements.forEach(el => {
      const span = document.createElement("div");

      span.textContent =
        el.tagName === "SELECT"
          ? el.options[el.selectedIndex]?.text
          : el.value;

      const computedStyle = window.getComputedStyle(el);

      span.style.whiteSpace = "pre-wrap";
      span.style.fontSize = computedStyle.fontSize;
      span.style.fontFamily = computedStyle.fontFamily;
      span.style.padding = "4px 0";

      el.style.display = "none";
      el.parentNode.insertBefore(span, el);

      replacedElements.push({ el, span });
    });

    /* =============================
       3️⃣ Generate Canvas
    ============================= */

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.9);

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    /* =============================
       4️⃣ Multi Page Support
    ============================= */

    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("PDF Export Error:", error);
  } finally {

    /* =============================
       5️⃣ Restore Everything
    ============================= */

    replacedElements.forEach(({ el, span }) => {
      el.style.display = "";
      span.remove();
    });

    noPrintElements.forEach(el => {
      el.style.display = el.dataset.prevDisplay || "";
    });
  }
};