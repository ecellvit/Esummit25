import React, { useEffect } from "react";

interface InvoiceItem {
  destination: string;
  elements: { name: string; quantity: number }[];
  mode: "land" | "air";
}

const TRANSPORT_COSTS = {
  land: 1000,
  air: 2000,
};

const invoiceData: InvoiceItem[] = [
  { destination: "Island A", elements: [{ name: "Iron", quantity: 5 }, { name: "Nickel", quantity: 2 }], mode: "land" },
  { destination: "Island B", elements: [{ name: "Cobalt", quantity: 3 }, { name: "Copper", quantity: 4 }], mode: "air" },
  { destination: "Island C", elements: [{ name: "Iron", quantity: 7 }, { name: "Zinc", quantity: 1 }], mode: "land" },
];

const Invoice: React.FC = () => {
  const invoiceItems = invoiceData.flatMap((item) =>
    item.elements.map((element) => {
      const cost = element.quantity * TRANSPORT_COSTS[item.mode];
      return { ...item, element: element.name, quantity: element.quantity, cost };
    })
  );

  const totalCost = invoiceItems.reduce((sum, item) => sum + item.cost, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/event1/round2/getInvoiceData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ invoiceItems, totalCost }),
        });

        const data = await response.json();
        console.log("Response Data:", data);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-lg w-full mx-auto mt-10 bg-white">
      <h2 className="text-xl font-bold mb-4">Invoice</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Destination</th>
            <th className="border p-2">Element</th>
            <th className="border p-2">Quantity (tons)</th>
            <th className="border p-2">Mode</th>
            <th className="border p-2">Cost (₹)</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{item.destination}</td>
              <td className="border p-2">{item.element}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.mode}</td>
              <td className="border p-2">₹{item.cost.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right font-bold text-lg">
        Total Cost: ₹{totalCost.toLocaleString()}
      </div>
    </div>
  );
};

export default Invoice;
