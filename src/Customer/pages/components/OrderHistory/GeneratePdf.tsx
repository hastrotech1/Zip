import jsPDF from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
import { ShipmentData } from "../../../../../helper/types";
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

export const generatePDF = (orders: ShipmentData[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Order History", 14, 22);

  const tableColumn = [
    "Order ID",
    "Origin",
    "Destination",
    "Delivery Date",
    "Shipping Cost",
    "Status",
  ];
  const tableRows = orders.map((order) => [
    order.customer_order_id,
    order.origin,
    order.destination,
    new Date(order.deliveryDate).toLocaleDateString(),
    `₦${order.shippingCost.toFixed(2)}`,
    order.status.charAt(0).toUpperCase() + order.status.slice(1),
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
  });

  doc.save("order-history.pdf");
};
