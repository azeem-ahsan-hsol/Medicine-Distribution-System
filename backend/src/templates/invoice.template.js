import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load logo from templates/logo.png
const logoPath = path.join(__dirname, "logo.png");

const logoBase64 = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
  : "";

export const buildInvoiceHTML = ({ type, settings, invoice, items, invoiceNumber }) => {
  const storeName = settings?.store_name || "ITTFAQ MEDICINE DISTRIBUTION";
  const storeAddress = settings?.address || "Street MC Girls High School, Jandiala Road, Sheikhupura";
  const storePhone = settings?.phone || "03074662208";

  const logo = logoBase64;

  // CUSTOMER (SALES) or SUPPLIER (PURCHASE)
  const party = type === "SALES" ? invoice.customer : invoice.supplier;

  // BUILD ROWS
  const rows = items.map((x, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${x.product?.product_name || "-"}</td>
      <td>${x.quantity}</td>

      ${
        type === "PURCHASE"
          ? `<td>${x.free_qty || 0}</td>
             <td>${x.batch_no || "-"}</td>
             <td>${x.expiry_date || "-"}</td>`
          : ""
      }

      <td>${Number(x.price || x.rate || 0).toFixed(2)}</td>
      <td>${Number(
        x.total ||
        x.item_total ||
        x.quantity * (x.price || x.rate || 0)
      ).toFixed(2)}</td>
    </tr>
  `).join("");

  // TOTALS  
  const subTotal = Number(invoice.total || invoice.subTotal || 0).toFixed(2);
  const discount = Number(invoice.discount || 0).toFixed(2);
  const netTotal = Number(invoice.net_total || invoice.netTotal || subTotal).toFixed(2);

  // PURCHASE does not show discount
  const showDiscount = type === "SALES";

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      font-size: 12px;
      padding: 10px;
    }

    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
    }

    .logo { 
      max-height: 70px; 
    }

    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 15px; 
    }

    th, td { 
      border: 1px solid #000; 
      padding: 6px; 
      text-align: left; 
    }

    th {
      background: #f0f0f0;
    }

    .totals { 
      width: 250px; 
      float: right; 
      margin-top: 20px; 
    }

    .totals td { 
      border: none; 
      padding: 4px; 
    }

    .title {
      color: #004B88;
      margin: 0;
    }
  </style>
</head>

<body>

<div class="header">
  <div>
    <h2 class="title">${storeName}</h2>
    <div>${storeAddress}</div>
    <div>${storePhone}</div>
  </div>

  ${logo ? `<img src="${logo}" class="logo"/>` : ""}
</div>

<hr/>

<h3>${type} INVOICE - ${invoiceNumber}</h3>
<div>Date: ${invoice.createdAt.toISOString().split("T")[0]}</div>

<br/>

<b>${type === "SALES" ? "Customer" : "Supplier"}:</b>
<div>${party?.name || "-"}</div>
<div>${party?.phone || ""}</div>

${
  type === "SALES"
    ? `<div><b>License No:</b> ${party?.license_no || "-"}</div>`
    : ""
}

<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Product</th>
      <th>Qty</th>

      ${
        type === "PURCHASE"
          ? `
            <th>Free Qty</th>
            <th>Batch No</th>
            <th>Expiry</th>
          `
          : ""
      }

      <th>Rate</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>

<table class="totals">
  <tr><td><b>Sub Total:</b></td><td>${subTotal}</td></tr>

  ${
    showDiscount
      ? `<tr><td><b>Discount:</b></td><td>${discount} %</td></tr>`
      : ""
  }

  <tr><td><b>Net Total:</b></td><td><b>${netTotal}</b></td></tr>
</table>

</body>
</html>
`;
};
