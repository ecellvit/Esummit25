"use client";
import { useState } from "react";

type ElementOption = "Element A" | "Element B" | "Element C" | "Element D";
type DestinationOption = "Destination X" | "Destination Y" | "Destination Z" | "Destination W";
type TransportMode = "Air" | "Water";

interface FormEntry {
  id: number;
  element: ElementOption;
  quantity: number;
  destination: DestinationOption;
  transport: TransportMode;
}

export default function Round2Form() {
  const [entries, setEntries] = useState<FormEntry[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);

  const addEntry = () => {
    if (totalQuantity >= 200) return; // Prevent adding more

    const newEntries: FormEntry[] = [
      ...entries,
      {
        id: entries.length + 1,
        element: "Element A",
        quantity: 0,
        destination: "Destination X",
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
    <div className="p-6 max-w-lg mx-auto border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Round 2 Form</h2>

      {entries.map((entry, index) => (
        <div key={entry.id} className="mb-4 p-4 border rounded-lg bg-gray-100">
          <label className="block mb-2">Element:</label>
          <select
            className="w-full p-2 border rounded"
            value={entry.element}
            onChange={(e) => updateEntry(index, "element", e.target.value as ElementOption)}
          >
            <option>Element A</option>
            <option>Element B</option>
            <option>Element C</option>
            <option>Element D</option>
          </select>

          <label className="block mt-3 mb-2">Quantity:</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={entry.quantity}
            onChange={(e) => updateEntry(index, "quantity", Number(e.target.value))}
            min={0}
          />

          <label className="block mt-3 mb-2">Destination:</label>
          <select
            className="w-full p-2 border rounded"
            value={entry.destination}
            onChange={(e) => updateEntry(index, "destination", e.target.value as DestinationOption)}
          >
            <option>Destination X</option>
            <option>Destination Y</option>
            <option>Destination Z</option>
            <option>Destination W</option>
          </select>

          <label className="block mt-3 mb-2">Transport Mode:</label>
          <select
            className="w-full p-2 border rounded"
            value={entry.transport}
            onChange={(e) => updateEntry(index, "transport", e.target.value as TransportMode)}
          >
            <option>Air</option>
            <option>Water</option>
          </select>
        </div>
      ))}

      <p className="text-lg font-semibold text-gray-700">Total Quantity: {totalQuantity}</p>

      <button
        onClick={addEntry}
        className={`w-full mt-4 p-2 text-white font-bold rounded ${totalQuantity >= 200 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        disabled={totalQuantity >= 200}
      >
        Add
      </button>

      <button
        className={`w-full mt-2 p-2 text-white font-bold rounded ${entries.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
        disabled={entries.length === 0}
      >
        Submit
      </button>
    </div>
  );
}
