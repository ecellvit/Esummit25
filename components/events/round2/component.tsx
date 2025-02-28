"use client";
import { useEffect, useState } from "react";

type ElementOption = string;
type TransportMode = "Air" | "Water";

interface FormEntry {
  id: number;
  element: ElementOption;
  quantity: number;
  transport: TransportMode;
  warning?: string;
}

export default function Round2Form({ islandId }: { islandId: string }) {
  const [entries, setEntries] = useState<FormEntry[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [availableElements, setAvailableElements] = useState<ElementOption[]>([]);
  const [teamPortfolio, setTeamPortfolio] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(`round2form_${islandId}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setEntries(parsedData);
      setTotalQuantity(parsedData.reduce((sum: number, entry: FormEntry) => sum + entry.quantity, 0));
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/event1/round2/getFormData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (response.ok) {
          const nonZeroElements = Object.entries(data.teamElements)
            .filter(([_, value]) => (value as number) > 0)
            .map(([key]) => key);

          setAvailableElements(nonZeroElements);
          setTeamPortfolio(data.teamElements);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [islandId]);

  const getRemainingStock = (element: string) => {
    const usedQuantity = entries
      .filter((entry) => entry.element === element)
      .reduce((sum, entry) => sum + entry.quantity, 0);
    return (teamPortfolio[element] || 0) - usedQuantity;
  };

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

  const removeEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    setTotalQuantity(updatedEntries.reduce((sum, entry) => sum + entry.quantity, 0));
  };

  const updateEntry = (index: number, key: keyof FormEntry, value: any) => {
    const updatedEntries = [...entries];

    if (key === "quantity") {
      let numValue = Number(value.replace(/\D/g, ""));
      const selectedElement = updatedEntries[index].element;
      const availableAmount = getRemainingStock(selectedElement) + updatedEntries[index].quantity;

      if (numValue > availableAmount) {
        numValue = availableAmount;
      }

      updatedEntries[index] = { ...updatedEntries[index], [key]: numValue };
    } else if (key === "element") {
      updatedEntries[index] = { ...updatedEntries[index], element: value, quantity: 0 };
    } else {
      updatedEntries[index] = { ...updatedEntries[index], [key]: value };
    }

    setEntries(updatedEntries);
    setTotalQuantity(updatedEntries.reduce((sum, entry) => sum + entry.quantity, 0));
  };

  const saveForm = () => {
    setIsSaving(true);
    localStorage.setItem(`round2form_${islandId}`, JSON.stringify(entries));
    setTimeout(() => {
      setIsSaving(false);
      alert("Data saved successfully!");
    }, 500);
  };

  return (
    <div className="p-6 max-w-lg ml-auto mr-10 my-10 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Round 2 Form</h2>

      {entries.map((entry, index) => (
        <div key={entry.id} className="mb-4 p-4 border rounded-lg bg-gray-100 relative">
          <button
            onClick={() => removeEntry(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
          >
            ✖
          </button>
          <label className="block mb-2">Element:</label>
          <select
            className="w-full p-2 border rounded"
            value={entry.element}
            onChange={(e) => updateEntry(index, "element", e.target.value)}
          >
            {availableElements.map((el) => (
              <option key={el} value={el}>
                {el} (Available: {getRemainingStock(el)})
              </option>
            ))}
          </select>

          <label className="block mt-3 mb-2">Quantity:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={entry.quantity}
            onChange={(e) => updateEntry(index, "quantity", e.target.value)}
          />
        </div>
      ))}

      <label className="block mt-5">Batch Transport Mode:</label>
      <select className="w-full p-2 border rounded">
        <option>Air</option>
        <option>Water</option>
      </select>

      <p className="text-lg font-semibold text-gray-700 mt-5">Total Quantity: {totalQuantity}</p>

      <div className="flex flex-row p-4 ">
        <button
          onClick={addEntry}
          className={`w-full mt-4 p-2 text-white font-bold rounded-lg ${
            totalQuantity >= 200 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
          }`}
          disabled={totalQuantity >= 200}
        >
          Add
        </button>

        <button
          onClick={saveForm}
          className={`w-full mt-4 p-2 ml-8 text-white font-bold rounded-lg ${
            totalQuantity > 200 || isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
          }`}
          disabled={totalQuantity > 200 || isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
