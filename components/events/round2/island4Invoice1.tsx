import React from "react";

const islandsData = [
  {
    name: "Sicily",
    metals: [
      { metal: "Cobalt",marketPrice: 4364 },
      { metal: "Lithium",marketPrice: 1865 },
      { metal: "Nickel",marketPrice: 2586 },
      { metal: "Copper",marketPrice: 2260 },
      { metal: "Iron",marketPrice: 1711 },
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
                <th className="border p-2">Market Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {island.metals.map((metal, metalIndex) => (
                <tr key={metalIndex} className="text-center">
                  <td className="border p-2">{metal.metal}</td>
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
