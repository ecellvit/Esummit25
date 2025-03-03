import React from "react";

const islandsData = [
    {
        name: "Lemnos",
        metals: [
          { metal: "Iron", efficiency: 92, ownCost: 213, corpTax: 55, totalOwnCost: 268, localCost: 506, serviceTax: 111, totalLocalCost: 617, marketPrice: 1702 },
          { metal: "Cobalt", efficiency: 86, ownCost: 208, corpTax: 54, totalOwnCost: 262, localCost: 510, serviceTax: 112, totalLocalCost: 622, marketPrice: 3921 },
          { metal: "Lithium", efficiency: 76, ownCost: 200, corpTax: 52, totalOwnCost: 252, localCost: 497, serviceTax: 109, totalLocalCost: 606, marketPrice: 1914 },
          { metal: "Nickel", efficiency: 71, ownCost: 196, corpTax: 50, totalOwnCost: 246, localCost: 488, serviceTax: 107, totalLocalCost: 595, marketPrice: 2782},
          { metal: "Copper", efficiency: 63, ownCost: 194, corpTax: 50, totalOwnCost: 244, localCost: 485, serviceTax: 106, totalLocalCost: 591, marketPrice: 2195 },
          
        ]
      }
];

const island3Invoice = (props:any) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg w-full mx-auto mt-10 bg-white">
      {islandsData.map((island, islandIndex) => (
        <div key={islandIndex} className="mb-10">
          <h2 className="text-xl font-bold mb-4">Island {island.name}</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Metal</th>
                <th className="border p-2">Efficiency</th>
                <th className="border p-2">Own Cost (₹/tonne)</th>
                <th className="border p-2">Corp Tax(26%)(₹)</th>
                <th className="border p-2">Total Own Cost (₹/tonne)</th>
                <th className="border p-2">Local Cost (₹/tonne)</th>
                <th className="border p-2">Service Tax (22%)(₹)</th>
                <th className="border p-2">Total Local Cost (₹/tonne)</th>
                <th className="border p-2">Market Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {island.metals.map((metal, metalIndex) => (
                <tr key={metalIndex} className="text-center">
                  <td className="border p-2">{metal.metal}</td>
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

export default island3Invoice;
