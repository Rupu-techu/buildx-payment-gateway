import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function formatReceiptDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export async function exportReceiptPdf(element, transactionId) {
  if (!element) {
    throw new Error("Receipt preview is not available yet.");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#f8fafc",
  });

  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const printableWidth = pageWidth - margin * 2;
  const imageHeight = (canvas.height * printableWidth) / canvas.width;
  const printableHeight = Math.min(imageHeight, pageHeight - margin * 2);

  pdf.addImage(imageData, "PNG", margin, margin, printableWidth, printableHeight);
  pdf.save(`buildx-receipt-${transactionId}.pdf`);
}

export function printReceipt(element, title = "BuildX Payment Receipt") {
  if (!element) {
    throw new Error("Receipt preview is not available yet.");
  }

  const printWindow = window.open("", "_blank", "width=1024,height=768");

  if (!printWindow) {
    throw new Error("Enable popups to print the receipt.");
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            margin: 0;
            padding: 24px;
            background: #eef2ff;
            font-family: "Segoe UI", Arial, sans-serif;
          }

          @media print {
            body {
              padding: 0;
              background: #ffffff;
            }
          }
        </style>
      </head>
      <body>${element.outerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
