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
import Loader from "@/components/loader";
import Batch from "./batch";

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
  setData: React.Dispatch<React.SetStateAction<FormEntry[]>>;
  updateData: (islandId: string, newData: FormEntry[]) => void;
}

const Round2Form: React.FC<Round2FormProps> = ({ islandId, data,setData, updateData }) => {
  const [entries, setEntries] = useState<FormEntry[]>(data);
  const [availableElements, setAvailableElements] = useState<ElementOption[]>([]);
  const [teamPortfolio, setTeamPortfolio] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [available, setAvailable] = useState<number>(0);
  const [globalTotalQuantity, setGlobalTotalQuantity] = useState<number>(0);
  const [loading,setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<"Air" | "Water">("Air");
  const elementArray = ["Lithium", "Iron", "Cobalt", "Nickel", "Copper"];
  const [currentBatch, setCurrentBatch] = useState<number>(1); 
  const [batch, setBatch] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  var num = 0;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {

      try {
        const response = await fetch(`/api/event1/round2/getFormData`, {
          method: "GET",
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
        toast.error("error fetching data");
        console.error("Error fetching data:", error);
      }finally{
        setLoading(false);
      }
    };
    fetchData();
  }, [islandId]);

  useEffect(() => {
    setLoading(true);
    const savedTotal = localStorage.getItem("totalQuantity");
    if (savedTotal !== null) {
      setTotalQuantity(parseInt(savedTotal, 10) || 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (totalQuantity > 0) {
      localStorage.setItem("totalQuantity", totalQuantity.toString());
    }
  }, [totalQuantity]);

  useEffect(() => {
    setLoading(true);
    const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
    const islandEntries = allData[islandId] ?? [];
    setEntries(islandEntries);
    setTotalQuantity(islandEntries.reduce((sum: number, entry: FormEntry) => sum + entry.quantity, 0)); // Recalculate total quantity when a new island is chosen
    setLoading(false);
  }, [islandId]);

  useEffect(() => {
    const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
    setEntries(allData[islandId] ?? []);
    calculateTotalGlobalQuantity();
  }, [islandId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/event1/round2/getFormData`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
          setBatch(data.batch); 
        } else {
          setError(data.message || "Error fetching batch data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Server Error: Unable to fetch batch.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const calculateTotalGlobalQuantity = () => {
    const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
    let total = 0;
    
    // Calculate total quantity without removing anything yet
    Object.values(allData).forEach((islandEntries: any) => {
      (islandEntries as FormEntry[]).forEach((entry) => {
        total += entry.quantity;
      });
    });
    
    // Check if total exceeds 200
    if (total > 200) {
      toast.error("Limit exceeded, removing last entry");
      console.log("Limit exceeded, removing last entry");
      
      // Find the last entry across all islands
      let lastIslandId = islandId; // Default to current island
      let lastIslandEntries = allData[lastIslandId] as FormEntry[] || [];
      
      // If current island has no entries, find another island with entries
      if (lastIslandEntries.length === 0) {
        for (const [id, entries] of Object.entries(allData)) {
          if ((entries as FormEntry[]).length > 0) {
            lastIslandId = id;
            lastIslandEntries = entries as FormEntry[];
            break;
          }
        }
      }
      
      // Remove the last entry from the identified island
      if (lastIslandEntries.length > 0) {
        lastIslandEntries.pop(); // Remove the last entry
        allData[lastIslandId] = lastIslandEntries;
        
        // Save updated data back to localStorage
        localStorage.setItem("islandData", JSON.stringify(allData));
        
        // If we're removing from the current island, update the local entries state
        if (lastIslandId === islandId) {
          setEntries([...lastIslandEntries]);
        }
        
        // Recalculate total quantity after removal
        total = 0;
        Object.values(allData).forEach((islandEntries: any) => {
          (islandEntries as FormEntry[]).forEach((entry) => {
            total += entry.quantity;
          });
        });
        
        setIsSaving(false);
      }
    }
    
    if(total<=200){
      setGlobalTotalQuantity(total);
    }else{
      return 0;
    }
  };

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
    num = teamPortfolio[element];
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
      calculateTotalGlobalQuantity();
      return updatedEntries;
    });
  };

  const updateEntry = (index: number, key: keyof FormEntry, value: any) => {
    setEntries((prevEntries) => {
      const updatedEntries = [...prevEntries];
  
      if (key === "quantity") {
        // Convert to number and validate
        let numValue = parseInt(value.replace(/\D/g, ""), 10) || 0;
        updatedEntries[index] = { ...updatedEntries[index], [key]: numValue };
      } else {
        updatedEntries[index] = { ...updatedEntries[index], [key]: value };
      }

    
  
      // Recalculate total quantity
      const newTotalQuantity = updatedEntries.reduce((sum, entry) => sum + (Number(entry.quantity) || 0), 0);
      setTotalQuantity(newTotalQuantity);
      
      calculateTotalGlobalQuantity();
      return updatedEntries;
    });
  };
  
  

  const addEntry = () => {

    if (!availableElements.length) {
      toast.error("No elements available. Please wait for data to load.");
      return;
    }

    console.log('available entries',availableElements);
    console.log('entries',entries);
    setEntries((prevEntries) => {
      const newEntries: FormEntry[] = [
        ...prevEntries,
        {
          id: prevEntries.length + 1,
          element: availableElements[0],
          quantity: 0,
          transport: selectedTransport,
          batch: currentBatch, // Set the batch number dynamically
        },
      ];
      // const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
      // allData[islandId] = newEntries;
      // localStorage.setItem("islandData", JSON.stringify(allData));
      // updateData(islandId, newEntries);
      setTotalQuantity(newEntries.reduce((sum, entry) => sum + entry.quantity, 0)); // Set total quantity to the total quantity of elements being sent to that island
      calculateTotalGlobalQuantity();
      return newEntries;
    });
  };

  const saveForm = () => {
    setIsSaving(true);
    
    // First update all entries with the selected transport mode
    const updatedEntries = entries.map((entry) => ({
      ...entry,
      transport: selectedTransport,
    }));
    
    // Save to localStorage
    const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
    allData[islandId] = updatedEntries;
    localStorage.setItem("islandData", JSON.stringify(allData));
    console.log("data:", allData);
    // Update parent component data
    updateData(islandId, updatedEntries);
    
    // Recalculate global quantities
    var res = calculateTotalGlobalQuantity();
    if(res===1){
      setTimeout(() => {
        setIsSaving(false);
        toast.success("Data saved successfully!");
      }, 500);
    }else{
      const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
      allData[islandId] = []; // Clear only this island's data
      console.log('all data',allData);
      localStorage.setItem("islandData", JSON.stringify(allData));
      console.log("data cleared:", allData);
      setData([]);
      updateData(islandId, []);
    }
    
  };

  const openModal = () => {
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  const confirmTransport = () => {
    setEntries((prevEntries) => {
      const updatedEntries = prevEntries.map((entry) => ({
        ...entry,
        transport: selectedTransport,
      }));
      
      // Update localStorage with the new entries that include the transport mode
      const allData = JSON.parse(localStorage.getItem("islandData") || "{}");
      allData[islandId] = updatedEntries;
      localStorage.setItem("islandData", JSON.stringify(allData));
      
      // Update parent component's data
      updateData(islandId, updatedEntries);
      
      return updatedEntries;
    });
    
    closeModal();
    saveForm();
  };

  return (
    <div className="mt-[15vh] p-6 max-w-lg ml-auto mr-10 my-10 border rounded-lg shadow-lg bg-white">
      {loading && <Loader />}
      <h2 className="text-xl font-bold mb-4 text-center">Round 2 Form</h2>
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="mb-4 p-4 border rounded-lg bg-gray-100 relative"
        >
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
                {elementArray[parseInt(el, 10)]} (Available:{" "}
                {getRemainingStock(el)})
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
      <p className="text-lg font-semibold text-gray-700 mt-5">
        Total Quantity: {totalQuantity}
      </p>
      <p className="text-lg font-semibold text-gray-700">
        Global Total Quantity: {globalTotalQuantity}/200
      </p>
      <p className="text-lg font-semibold text-gray-700">
        Current Batch: {batch}{" "}
      </p>{" "}
      {/* Display current batch number */}
      {/* <button
  onClick={addEntry}
  className={`w-full mt-4 p-2 text-white font-bold rounded-lg ${
    totalQuantity >= 201 ||
    globalTotalQuantity >= 201 ||
    entries.some(entry => (entry.quantity) >= (entry.quantity + getRemainingStock(entry.element))) ||
    !availableElements.length // Add this condition
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-700"
    }`}
  disabled={
    totalQuantity >= 201 ||
    globalTotalQuantity >= 201 ||
    entries.some(entry => (entry.quantity) >= (entry.quantity + getRemainingStock(entry.element))) ||
    !availableElements.length // Add this condition
  }
>
  Add Entry
</button> */}
      <button
        onClick={addEntry}
        className={`w-full mt-4 p-2 text-white font-bold rounded-lg ${
          totalQuantity >= 201 ||
          globalTotalQuantity >= 201 ||
          entries.length >= elementArray.length || // Limit number of entries
          entries.some(
            (entry) =>
              entry.quantity >=
              entry.quantity + getRemainingStock(entry.element)
          ) ||
          !availableElements.length
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700"
        }`}
        disabled={
          totalQuantity >= 201 ||
          globalTotalQuantity >= 201 ||
          entries.length >= elementArray.length || // Limit number of entries
          entries.some(
            (entry) =>
              entry.quantity >=
              entry.quantity + getRemainingStock(entry.element)
          ) ||
          !availableElements.length
        }
      >
        Add Entry
      </button>
      <button
        onClick={openModal}
        className={`w-full mt-4 p-2 text-white font-bold rounded-lg  ${
          totalQuantity >= 201 ||
          globalTotalQuantity >= 201 ||
          entries.some(
            (entry) =>
              entry.quantity >=
              entry.quantity + getRemainingStock(entry.element)
          )
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-700"
        }`}
        disabled={
          totalQuantity >= 201 ||
          globalTotalQuantity >= 201 ||
          entries.some(
            (entry) =>
              entry.quantity >=
              entry.quantity + getRemainingStock(entry.element)
          )
        }
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg text-center font-semibold mb-4">
              Select Mode of Transport
            </h3>
            <div className="flex justify-center gap-8 mb-4">
              <button
                className={`px-8 py-3 rounded-xl ${
                  selectedTransport === "Air"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedTransport("Air")}
              >
                Air
              </button>
              <button
                className={`px-7 py-3 rounded-xl ${
                  selectedTransport === "Water"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedTransport("Water")}
              >
                Water
              </button>
            </div>
            <div className="flex justify-center gap-5 mt-[3vh]">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmTransport}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Round2Form;