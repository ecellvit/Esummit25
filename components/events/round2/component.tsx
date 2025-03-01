// "use client";
// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// type ElementOption = string;
// type TransportMode = "Air" | "Water";

// interface FormEntry {
//   id: number;
//   element: ElementOption;
//   quantity: number;
//   transport: TransportMode;
//   warning?: string;
// }

// export default function Round2Form({ islandId }: { islandId: string }) {
//   const [entries, setEntries] = useState<FormEntry[]>([]);
//   const [totalQuantity, setTotalQuantity] = useState<number>(0);
//   const [availableElements, setAvailableElements] = useState<ElementOption[]>([]);
//   const [teamPortfolio, setTeamPortfolio] = useState<Record<string, number>>({});
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     const savedData = localStorage.getItem(`round2form_${islandId}`);
//     if (savedData) {
//       const parsedData = JSON.parse(savedData);
//       setEntries(parsedData);
//       setTotalQuantity(parsedData.reduce((sum: number, entry: FormEntry) => sum + entry.quantity, 0));
//     }

//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/event1/round2/getFormData`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           const nonZeroElements = Object.entries(data.teamElements)
//             .filter(([_, value]) => (value as number) > 0)
//             .map(([key]) => key);

//           setAvailableElements(nonZeroElements);
//           setTeamPortfolio(data.teamElements);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [islandId]);

//   const getRemainingStock = (element: string) => {
//     const usedQuantity = entries
//       .filter((entry) => entry.element === element)
//       .reduce((sum, entry) => sum + entry.quantity, 0);
//     return (teamPortfolio[element] || 0) - usedQuantity;
//   };

//   const addEntry = () => {
//     if (totalQuantity >= 200) return;

//     const newEntries: FormEntry[] = [
//       ...entries,
//       {
//         id: entries.length + 1,
//         element: availableElements[0] || "Unknown",
//         quantity: 0,
//         transport: "Air",
//       },
//     ];

//     setEntries(newEntries);
//     setTotalQuantity(newEntries.reduce((sum, entry) => sum + entry.quantity, 0));
//   };

//   const updateEntry = (index: number, key: keyof FormEntry, value: any) => {
//     const updatedEntries = [...entries];

//     if (key === "quantity") {
//       let numValue = Number(value.replace(/\D/g, ""));

//       const selectedElement = updatedEntries[index].element;
//       const availableAmount = getRemainingStock(selectedElement) + updatedEntries[index].quantity;

//       if (numValue > availableAmount) {
//         numValue = availableAmount;
//       }

//       updatedEntries[index] = { ...updatedEntries[index], [key]: numValue };
//     } else {
//       updatedEntries[index] = { ...updatedEntries[index], [key]: value };
//     }

//     setEntries(updatedEntries);
//     setTotalQuantity(updatedEntries.reduce((sum, entry) => sum + entry.quantity, 0));
//   };

//   const removeEntry = (index: number) => {
//     const updatedEntries = entries.filter((_, i) => i !== index);
//     setEntries(updatedEntries);
//     setTotalQuantity(updatedEntries.reduce((sum, entry) => sum + entry.quantity, 0));
//   };

//   const saveForm = () => {
//     setIsSaving(true);
//     localStorage.setItem(`round2form_${islandId}`, JSON.stringify(entries));
//     setTimeout(() => {
//       setIsSaving(false);
//       toast.success("Data saved successfully!");
//     }, 500);
//   };

//   return (
//     <div className="p-6 max-w-lg ml-auto mr-10 my-10 border rounded-lg shadow-lg bg-white">
//       <h2 className="text-xl font-bold mb-4 text-center">Round 2 Form</h2>

//       {entries.map((entry, index) => (
//         <div key={entry.id} className="mb-4 p-4 border rounded-lg bg-gray-100 relative">
//           <button
//             className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//             onClick={() => removeEntry(index)}
//           >
//             ✕
//           </button>

//           <label className="block mb-2">Element:</label>
//           <select
//             className="w-full p-2 border rounded"
//             value={entry.element}
//             onChange={(e) => updateEntry(index, "element", e.target.value)}
//           >
//             {availableElements.map((el) => (
//               <option key={el} value={el}>
//                 {el} (Available: {getRemainingStock(el)})
//               </option>
//             ))}
//           </select>

//           <label className="block mt-3 mb-2">Quantity:</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             value={entry.quantity}
//             onChange={(e) => updateEntry(index, "quantity", e.target.value)}
//           />
//         </div>
//       ))}

//       <label className="block mt-5">Batch Transport Mode:</label>
//       <select className="w-full p-2 border rounded">
//         <option>Air</option>
//         <option>Water</option>
//       </select>

//       <p className="text-lg font-semibold text-gray-700 mt-5">Total Quantity: {totalQuantity}</p>

//       <div className="flex flex-row p-4 ">
//         <button
//           onClick={addEntry}
//           className={`w-full mt-4 p-2 text-white font-bold rounded-lg ${
//             totalQuantity >= 200 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
//           }`}
//           disabled={totalQuantity >= 200}
//         >
//           Add
//         </button>

//         <button
//           onClick={saveForm}
//           className={`w-full mt-4 p-2 ml-8 text-white font-bold rounded-lg ${
//             totalQuantity > 200 || isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
//           }`}
//           disabled={totalQuantity > 200 || isSaving}
//         >
//           {isSaving ? "Saving..." : "Save"}
//         </button>
//       </div>
//       <Toaster />
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import React from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";


type ElementOption = string;
type TransportMode = "Air" | "Water";

interface FormEntry {
  id: number;
  element: string;
  quantity: number;
  transport: "Air" | "Water";
  batch: number;
  warning?: string;
}

interface Round2FormProps {
  islandId: string;
  data: FormEntry[];
  updateData: (islandId: string, newData: FormEntry[]) => void;
}

const Round2Form: React.FC<Round2FormProps> = ({ islandId, data, updateData }) => {
  const [entries, setEntries] = useState<FormEntry[]>(data);
  const [availableElements, setAvailableElements] = useState<ElementOption[]>([]);
  const [teamPortfolio, setTeamPortfolio] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [available,setAvailable] = useState<number>(0);
  var num = 0;

  useEffect(() => {
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

  useEffect(() => {
    const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
    setEntries(allData[islandId] ?? []);
  }, [islandId]);

  const calculateGlobalStock = () => {
    const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
    let globalStock: Record<string, number> = {};

    Object.values(allData).forEach((islandEntries: any) => {
      (islandEntries as FormEntry[]).forEach((entry) => {
        globalStock[entry.element] = (globalStock[entry.element] || 0) + entry.quantity;
      });
    });
    return globalStock;
  };

  const getRemainingStock = (element: string) => {
    const globalStock = calculateGlobalStock();
    num = teamPortfolio[element]
    // setAvailable(teamPortfolio[element]);
    return Math.max((teamPortfolio[element]) - (globalStock[element] || 0), 0);
  };
  
  const removeEntry = (index: number) => {
    setEntries((prevEntries) => {
      const updatedEntries = prevEntries.filter((_, i) => i !== index);
      const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
      allData[islandId] = updatedEntries;
      localStorage.setItem("islandData", JSON.stringify(allData));
      setTotalQuantity(updatedEntries.reduce((sum, entry) => sum + entry.quantity, 0));
      updateData(islandId, updatedEntries);
      return updatedEntries;
    });
  };

  const updateEntry = (index: number, key: keyof FormEntry, value: any) => {
    setEntries((prevEntries) => {
      const updatedEntries = [...prevEntries];
  
      if (key === "quantity") {
        let numValue = Number(value.replace(/\D/g, ""));
        const selectedElement = updatedEntries[index].element;
  
        // Correctly calculate remaining stock before updating the entry
        const globalStock = calculateGlobalStock();
        const availableStock = Math.max((teamPortfolio[selectedElement] || 0) - (globalStock[selectedElement] || 0), 0);
  
        console.log("Before update:");
        console.log("Available Stock:", availableStock);
        console.log("Entered Quantity:", numValue);
  
        // numValue = Math.min(numValue, availableStock);
        updatedEntries[index] = { ...updatedEntries[index], [key]: numValue };
  
        console.log("After update:");
        console.log("Updated Entries:", updatedEntries);
      } else {
        updatedEntries[index] = { ...updatedEntries[index], [key]: value };
      }
  
      // Update localStorage
      const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
      allData[islandId] = updatedEntries;
      localStorage.setItem("islandData", JSON.stringify(allData));
  
      // Recalculate total quantity
      const newTotalQuantity = updatedEntries.reduce((sum, entry) => sum + entry.quantity, 0);
      setTotalQuantity(newTotalQuantity);
  
      // Ensure `getRemainingStock` reflects updated quantities
      console.log("Final Available Stock:", getRemainingStock(updatedEntries[index].element));
  
      updateData(islandId, updatedEntries);
      return updatedEntries;
    });
  };
  

  const addEntry = () => {
    setEntries((prevEntries) => {
      const newEntries: FormEntry[] = [
        ...prevEntries,
        {
          id: prevEntries.length + 1,
          element: availableElements[0] || "Unknown",
          quantity: 0,
          transport: "Air",
          batch: 1,
        },
      ];
      const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
      allData[islandId] = newEntries;
      localStorage.setItem("islandData", JSON.stringify(allData));
      updateData(islandId, newEntries);
      return newEntries;
    });
  };

  const saveForm = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Data saved successfully!");
    }, 500);
  };

  
  return (
    <div className="p-6 max-w-lg ml-auto mr-10 my-10 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Round 2 Form</h2>
      {entries.map((entry, index) => (
        <div key={entry.id} className="mb-4 p-4 border rounded-lg bg-gray-100 relative">
          <button
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            onClick={() => removeEntry(index)}
          >
            ✕
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
            onChange={(e) => {console.log('value:',entry.quantity);updateEntry(index, "quantity", e.target.value)}}
          />
        </div>
      ))}
      <p className="text-lg font-semibold text-gray-700 mt-5">Total Quantity: {totalQuantity}</p>

      <button
        onClick={addEntry}
        className={`w-full mt-4 p-2 text-white font-bold rounded-lg ${
          totalQuantity >= 200 || entries.some(entry => (entry.quantity) >= (entry.quantity + getRemainingStock(entry.element)))
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700"
        }`}
        disabled={totalQuantity >= 200 || entries.some(entry => (entry.quantity) >= (entry.quantity + getRemainingStock(entry.element)))}
      >
        Add Entry
      </button>
      <button
        onClick={saveForm}
        className="w-full mt-4 p-2 text-white font-bold rounded-lg bg-green-500 hover:bg-green-700"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
      <Toaster />
    </div>
  );
};

export default Round2Form;
