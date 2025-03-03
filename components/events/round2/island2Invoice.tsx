import React from "react";

const invoiceData = [
  {
    island: "Delos",
    metals: [
      {
        name: "Nickel",
        efficiency: 91,
        ownCost: 212,
        corpTax: 53,
        totalOwnCost: 265,
        localCost: 503,
        serviceTax: 105,
        totalLocalCost: 608,
        marketPrice: 2600,
      },
      {
        name: "Lithium",
        efficiency: 82,
        ownCost: 203,
        corpTax: 50,
        totalOwnCost: 253,
        localCost: 500,
        serviceTax: 105,
        totalLocalCost: 605,
        marketPrice: 1884,
      },
      {
        name: "Copper",
        efficiency: 79,
        ownCost: 207,
        corpTax: 51,
        totalOwnCost: 258,
        localCost: 495,
        serviceTax: 103,
        totalLocalCost: 598,
        marketPrice: 2448,
      },
      {
        name: "Cobalt",
        efficiency: 72,
        ownCost: 199,
        corpTax: 49,
        totalOwnCost: 248,
        localCost: 492,
        serviceTax: 103,
        totalLocalCost: 595,
        marketPrice: 4356,
      },
      {
        name: "Iron",
        efficiency: 67,
        ownCost: 194,
        corpTax: 48,
        totalOwnCost: 242,
        localCost: 486,
        serviceTax: 102,
        totalLocalCost: 588,
        marketPrice: 1516,
      },
    ],
  },
];

const island2Invoice = () => {
  return (
    <div className="p-4 border rounded-lg shadow-lg w-full mx-auto mt-10 bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Invoice</h2>
      {invoiceData.map((islandData, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{islandData.island}</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Metal</th>
                <th className="border p-2">Efficiency</th>
                <th className="border p-2">Own Cost (₹/tonne)</th>
                <th className="border p-2">Corp Tax (₹)</th>
                <th className="border p-2">Total Own Cost (₹/tonne)</th>
                <th className="border p-2">Local Cost (₹/tonne)</th>
                <th className="border p-2">Service Tax (₹)</th>
                <th className="border p-2">Total Local Cost (₹/tonne)</th>
                <th className="border p-2">Market Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {islandData.metals.map((metal, metalIndex) => (
                <tr key={metalIndex} className="text-center">
                  <td className="border p-2">{metal.name}</td>
                  <td className="border p-2">{metal.efficiency}</td>
                  <td className="border p-2">₹{metal.ownCost}</td>
                  <td className="border p-2">₹{metal.corpTax}</td>
                  <td className="border p-2">₹{metal.totalOwnCost}</td>
                  <td className="border p-2">₹{metal.localCost}</td>
                  <td className="border p-2">₹{metal.serviceTax}</td>
                  <td className="border p-2">₹{metal.totalLocalCost}</td>
                  <td className="border p-2">₹{metal.marketPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default island2Invoice;
