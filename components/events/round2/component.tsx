"use client";
import { useEffect, useState } from "react";

type ElementOption = string;
type TransportMode = "Air" | "Water";

interface FormEntry {
  id: number;
  element: ElementOption;
  quantity: number;
  transport: TransportMode;
}

export default function Round2Form({ islandId }: { islandId: string }) {
  const [entries, setEntries] = useState<FormEntry[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [availableElements, setAvailableElements] = useState<ElementOption[]>([]);
  const [teamPortfolio, setTeamPortfolio] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/event1/round2/getFormData`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (response.ok) {
                // Filter available elements to include only those with non-zero quantities
                const nonZeroElements = Object.entries(data.teamElements)
                    .filter(([_, value]) => (value as number) > 0) 
                    .map(([key]) => key); // Get the keys (element names)

                setAvailableElements(nonZeroElements); // Set the filtered elements
                setTeamPortfolio(data.teamElements); // Set the full portfolio
            } else {
                console.log("Error fetching data:", data.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();
  }, [islandId]);

  const addEntry = () => {
    if (totalQuantity >= 200) return;

    const newEntries: FormEntry[] = [
      ...entries,
      {
        id: entries.length + 1,
        element: availableElements[0] || "Unknown",
        quantity: 0,
        transport: "Air",
      },
    ];

    setEntries(newEntries);
    setTotalQuantity(newEntries.reduce((sum, entry) => sum + entry.quantity, 0));
  };

  const updateEntry = (index: number, key: keyof FormEntry, value: any) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], [key]: value };

    setEntries(updatedEntries);
    setTotalQuantity(updatedEntries.reduce((sum, entry) => sum + entry.quantity, 0));
  };

  return (
    <div className="p-6 max-w-lg ml-auto mr-10 my-10 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Round 2 Form</h2>

      {entries.map((entry, index) => (
        <div key={entry.id} className="mb-4 p-4 border rounded-lg bg-gray-100">
          <label className="block mb-2">Element:</label>
          <select
    className="w-full p-2 border rounded"
    value={entry.element}
    onChange={(e) => updateEntry(index, "element", e.target.value)}
>
    {availableElements.map((el) => (
        <option key={el} value={el}>
            {el} (Available: {teamPortfolio[el] || 0})
        </option>
    ))}
</select>

          <label className="block mt-3 mb-2">Quantity:</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={entry.quantity}
            onChange={(e) => updateEntry(index, "quantity", Number(e.target.value))}
            min={0}
          />
        </div>
      ))}

      <label className="block mt-5">Batch Transport Mode:</label>
      <select
        className="w-full p-2 border rounded"
        // value={transport}
        // onChange={(e) => updateEntry(index, "transport", e.target.value as TransportMode)}
      >
        <option>Air</option>
        <option>Water</option>
      </select>

      <p className="text-lg font-semibold text-gray-700 mt-5">Total Quantity: {totalQuantity}</p>

      <button
        onClick={addEntry}
        className={`w-full mt-4 p-2 text-white font-bold rounded ${totalQuantity >= 200 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        disabled={totalQuantity >= 200}
      >
        Add
      </button>
    </div>
  );
} 