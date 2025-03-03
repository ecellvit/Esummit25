import React from "react";

const invoiceData = [
  { metal: "Lithium", Efficiency:92, ownCost: 92, corpTax: 51, localCost: 507, serviceTax: 101, marketPrice: 1970 },
  { metal: "Cobalt", Efficiency:85, ownCost: 85, corpTax: 50, localCost: 506, serviceTax: 101, marketPrice: 4193 },
  { metal: "Iron", Efficiency:78, ownCost: 78, corpTax: 48, localCost: 492, serviceTax: 98, marketPrice: 2315 },
  { metal: "Copper", Efficiency:72, ownCost: 72, corpTax: 47, localCost: 496, serviceTax: 99, marketPrice: 1623 },
  { metal: "Nickel", Efficiency:65, ownCost: 65, corpTax: 46, localCost: 488, serviceTax: 97, marketPrice: 2636 },
];

const island1Invoice = (props:any) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg w-full mx-auto mt-10 bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Invoice - Island Ithaca</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Metal</th>
            <th className="border p-2">Efficiency</th>
            <th className="border p-2">Own Cost (₹/tonne)</th>
            <th className="border p-2">Corp Tax (24%) (₹)</th>
            <th className="border p-2">Total Own Cost (₹/tonne)</th>
            <th className="border p-2">Local Cost (₹/tonne)</th>
            <th className="border p-2">Service Tax (20%) (₹)</th>
            <th className="border p-2">Total Local Cost (₹/tonne)</th>
            <th className="border p-2">Market Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.map((item, index) => {
            const totalOwnCost = item.ownCost + item.corpTax;
            const totalLocalCost = item.localCost + item.serviceTax;

            return (
              <tr key={index} className="text-center">
                <td className="border p-2">{item.metal}</td>
                <td className="border p-2">{item.Efficiency}</td>
                <td className="border p-2">₹{item.ownCost.toLocaleString()}</td>
                <td className="border p-2">₹{item.corpTax.toLocaleString()}</td>
                <td className="border p-2">₹{totalOwnCost.toLocaleString()}</td>
                <td className="border p-2">₹{item.localCost.toLocaleString()}</td>
                <td className="border p-2">₹{item.serviceTax.toLocaleString()}</td>
                <td className="border p-2">₹{totalLocalCost.toLocaleString()}</td>
                <td className="border p-2">₹{item.marketPrice.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default island1Invoice;