"use client";
import { useState } from "react";

type ElementOption = "Element A" | "Element B" | "Element C" | "Element D";
type DestinationOption = "Destination X" | "Destination Y" | "Destination Z" | "Destination W";
type TransportMode = "Air" | "Land";

interface FormEntry {
  id: number;
  element: ElementOption;
  quantity: number;
  destination: DestinationOption;
  transport: TransportMode;
}

export default function Round2Form() {
  const [entries, setEntries] = useState<FormEntry[]>([]);
  
  // Calculate total quantity
  const totalQuantity = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const isMaxReached = totalQuantity >= 200; // Disable button if total quantity reaches 200

  // Function to update a field in a specific entry
  const updateEntry = <K extends keyof FormEntry>(index: number, key: K, value: FormEntry[K]) => {
    setEntries((prevEntries) => {
      const updatedEntries = [...prevEntries];
      updatedEntries[index] = { ...updatedEntries[index], [key]: value };
      return updatedEntries;
    });
  };

  // Function to add a new entry
  const addEntry = () => {
    if (!isMaxReached) {
      setEntries((prevEntries) => [
        ...prevEntries,
        {
          id: prevEntries.length + 1,
          element: "Element A",
          quantity: 1,
          destination: "Destination X",
          transport: "Air",
        },
      ]);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Round 2 Form</h2>

      {entries.map((entry, index) => (
        <div key={entry.id} className="mb-6 p-4 border rounded-lg bg-gray-50 shadow">
          {/* Element Selection */}
          <div className="mb-3">
            <label className="block font-semibold text-gray-700">Element:</label>
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
          </div>

          {/* Quantity Input */}
          <div className="mb-3">
            <label className="block font-semibold text-gray-700">Quantity:</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={entry.quantity}
              min="1"
              max="200"
              onChange={(e) => updateEntry(index, "quantity", Math.min(200, Number(e.target.value)))}
            />
          </div>

          {/* Destination Selection */}
          <div className="mb-3">
            <label className="block font-semibold text-gray-700">Destination:</label>
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
          </div>

          {/* Transport Mode Selection */}
          <div className="mb-3">
            <label className="block font-semibold text-gray-700">Transport Mode:</label>
            <select
              className="w-full p-2 border rounded"
              value={entry.transport}
              onChange={(e) => updateEntry(index, "transport", e.target.value as TransportMode)}
            >
              <option>Air</option>
              <option>Land</option>
            </select>
          </div>
        </div>
      ))}

      {/* Total Quantity Display */}
      <p className="text-center text-gray-700 font-semibold">Total Quantity: {totalQuantity}/200</p>

      {/* Add Button - Disabled when total reaches 200 */}
      <button
        onClick={addEntry}
        disabled={isMaxReached}
        className={`w-full p-2 mt-2 rounded-lg transition ${
          isMaxReached ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        + Add Entry
      </button>
    </div>
  );
}
