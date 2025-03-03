import React from "react";

const invoiceData = [
  {
    island: "Delos",
    metals: [
      {
        name: "Nickel",
        marketPrice: 2600,
      },
      {
        name: "Lithium",
        marketPrice: 1884,
      },
      {
        name: "Copper",
        marketPrice: 2448,
      },
      {
        name: "Cobalt",
        marketPrice: 4356,
      },
      {
        name: "Iron",
        marketPrice: 1516,
      },
    ],
  },
];

const island2Invoice = (props:any) => {
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
                <th className="border p-2">Market Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {islandData.metals.map((metal, metalIndex) => (
                <tr key={metalIndex} className="text-center">
                  <td className="border p-2">{metal.name}</td>
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
