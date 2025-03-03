import React from "react";

const islandsData = [
  {
    name: "Sicily",
    metals: [
      { metal: "Cobalt", efficiency: 94, ownCost: 214, corpTax: 57, totalOwnCost: 271, localCost: 510, serviceTax: 117, totalLocalCost: 627, marketPrice: 4364 },
      { metal: "Lithium", efficiency: 88, ownCost: 209, corpTax: 56, totalOwnCost: 265, localCost: 506, serviceTax: 116, totalLocalCost: 622, marketPrice: 1865 },
      { metal: "Nickel", efficiency: 81, ownCost: 200, corpTax: 54, totalOwnCost: 254, localCost: 503, serviceTax: 115, totalLocalCost: 618, marketPrice: 2586 },
      { metal: "Copper", efficiency: 74, ownCost: 198, corpTax: 53, totalOwnCost: 251, localCost: 488, serviceTax: 112, totalLocalCost: 600, marketPrice: 2260 },
      { metal: "Iron", efficiency: 67, ownCost: 193, corpTax: 52, totalOwnCost: 245, localCost: 492, serviceTax: 113, totalLocalCost: 605, marketPrice: 1711 },
    ]
  }
];

const island4Invoice = (props:any) => {
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
                <th className="border p-2">Corp Tax (27%)(₹)</th>
                <th className="border p-2">Total Own Cost (₹/tonne)</th>
                <th className="border p-2">Local Cost (₹/tonne)</th>
                <th className="border p-2">Service Tax (23%)(₹)</th>
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

export default island4Invoice;
