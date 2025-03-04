import React, { useEffect, useState } from "react";
import islandJson from "@/constant/round2/island.json";
import elementJson from "@/constant/round1/element.json";
import insuranceJson from "@/constant/round2/insurance.json";
import toast, { Toaster } from "react-hot-toast";

interface ElementItem {
  id: number;
  name: string;
  cost: number;
  rate: number;
  base: number;
}

interface IslandItem {
  id: number;
  market: string;
  distance_kms: number;
  air_transport_cost_per_tn: number;
  water_transport_cost_per_tn: number;
  air_travel_time_secs: number;
  water_travel_time_secs: number;
}

interface InsuranceItem {
  id: number;
  type: string;
  resources_covered: number;
  cash_covered: number;
  cost_per_batch: number;
}

interface InvoiceItem {
  destination: number;
  elements: number[];
  cost: number;
  transport: number;
}

const elements: ElementItem[] = elementJson;
const islands: IslandItem[] = islandJson;
const insurances: InsuranceItem[] = insuranceJson;

const fetchInvoiceData = async () => {
  try {
    const response = await fetch("/api/event1/round2/getInvoiceData", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if(response.status === 407){
      toast.error("Invalid batch number");
      return
    }

    const data = await response.json();
    console.log("Invoice Data Fetched Successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    return null;
  }
};

const Invoice: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceItem[]>([]);
  const [insuranceCost, setInsuranceCost] = useState<number>(0);
  const [insuranceType, setInsuranceType] = useState<string>("");
  const [batchNumber, setBatchNumber] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchInvoiceData();
      if (data) {
        setBatchNumber(data.batchNumber);
        const batchKey = `totalBatch${data.batchNumber}`;
        setInvoiceData(data[batchKey] || []);
        const insurance = insurances.find((ins) => ins.id === data.insuranceType);
        if (insurance) {
          setInsuranceCost(insurance.cost_per_batch);
          setInsuranceType(insurance.type);
        }
      }
    };

    fetchData();
  }, []);

  const getElementName = (index: number) => {
    const element = elements[index];
    return element ? element.name : "Unknown";
  };

  const getIslandName = (index: number) => {
    const island = islands.find((is) => is.id === index);
    return island ? island.market : "Unknown";
  };

  const getTransportCost = (islandId: number, transport: number, quantity: number, index: number) => {
    const island = islands.find((is) => is.id === islandId);
    const element = elements[index];
    if (!island || !element) return 0;
    const costPerTn = transport === 0 ? island.air_transport_cost_per_tn : island.water_transport_cost_per_tn;
    return costPerTn * quantity;
  };

  const invoiceItems = invoiceData.flatMap((item) =>
    item.elements.map((quantity, index) =>
      quantity > 0
        ? {
            destination: getIslandName(item.destination),
            element: getElementName(index),
            quantity: quantity,
            cost: getTransportCost(item.destination, item.transport, quantity, index),
            transport: item.transport === 0 ? "Air" : "Water",
          }
        : null
    ).filter(Boolean)
  );

  const totalCost = invoiceItems.reduce((sum, item: any) => sum + item.cost, 0) + insuranceCost;

  return (
    <div className="p-4 border rounded-lg shadow-lg w-full mx-auto mt-10 bg-white">
      <h2 className="text-xl font-bold mb-4">Invoice (Batch {batchNumber})</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Destination</th>
            <th className="border p-2">Element</th>
            <th className="border p-2">Quantity (tons)</th>
            <th className="border p-2">Transport</th>
            <th className="border p-2">Cost (₹)</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item: any, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{item.destination}</td>
              <td className="border p-2">{item.element}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.transport}</td>
              <td className="border p-2">₹{item.cost.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right font-bold text-lg">
        Insurance Type: {insuranceType || "Not Available"}
      </div>
      <div className="mt-2 text-right font-bold text-lg">
        Insurance Cost: ₹{insuranceCost.toLocaleString()}
      </div>
      <div className="mt-2 text-right font-bold text-lg">
        Total Cost: ₹{totalCost.toLocaleString()}
      </div>
      <Toaster/>
    </div>
  );
};

export default Invoice;
