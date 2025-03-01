"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SellButton(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<number[] | null>();
  const element = ["Lithium", "Iron", "Cobalt", "Nickel", "Copper"];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/event1/userInfo", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        const ele = data?.team.portfolio;
        setPortfolio(ele);
        console.log(portfolio);
      } else {
        console.log("bad response", response.status);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSellClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/event1/round1/sellingElement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Replace with the actual team ID
          elements: [
            {
              elementIndex: selectedItem, // Replace with the actual element index
              amount: Number(quantity),
            },
          ],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Success: ${data.message}`);
      } else {
        toast.error(`${data.message}`);
      }
    } catch (error) {
      console.error("Error selling resources:", error);
      toast.error("An error occurred while selling resources.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedItem("");
      setQuantity("");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedItem("");
    setQuantity("");
  };

  // Ensure quantity is always non-negative
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (Number(value) >= 0 || value === "") {
      setQuantity(value);
    }
  };

  return (
    <div className="flex justify-center items-center bg-transparent">
      <button
        className="transition duration-300 ease-in-out bg-white text-red-800 px-20 py-2 font-bold rounded-xl hover:scale-110 active:scale-95 text-base md:text-lg"
        onClick={handleSellClick}
      >
        Sell
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Select an Item to Sell
            </h2>

            {/* Dropdown for Item Selection */}
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="" disabled>
                Select an item
              </option>
              {portfolio?.map((ele, index) => {
                return (
                  ele > 0 && (
                    <option key={index} value={index}>
                      {element[index]}
                    </option>
                  )
                );
              })}
            </select>

            {/* Quantity Input */}
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full p-2 border rounded-lg mb-2"
              min="0"
            />
            {selectedItem !== "" && portfolio && (
              <p className="text-sm text-gray-600 mb-4">
                Available: {portfolio[Number(selectedItem)]}{" "}
                {element[Number(selectedItem)]}
              </p>
            )}

            {/* Confirm & Cancel Buttons */}
            <div className="flex justify-between">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="flex justify-center bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                onClick={handleConfirm}
                disabled={!selectedItem || !quantity || Number(quantity) <= 0}
              >
                {loading ?<span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>:"Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster/>
    </div>
  );
}
