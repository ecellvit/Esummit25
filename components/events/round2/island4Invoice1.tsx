import React from "react";

const islandsData = [
      { metal: "Cobalt",marketPrice: 4364 },
      { metal: "Lithium",marketPrice: 1865 },
      { metal: "Nickel",marketPrice: 2586 },
      { metal: "Copper",marketPrice: 2260 },
      { metal: "Iron",marketPrice: 1711 },
];

const island4Invoice = (props:any) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg w-full mx-auto mt-10 bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Invoice - Island Sicily</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Metal</th>
            <th className="border p-2">Market Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          {islandsData.map((item, index) => {

            return (
              <tr key={index} className="text-center">
                <td className="border p-2">{item.metal}</td>
                <td className="border p-2">₹{item.marketPrice.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default island4Invoice;
