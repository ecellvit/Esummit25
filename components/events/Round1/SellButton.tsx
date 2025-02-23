"use client";
import { useState } from "react";

export default function SellButton(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSellClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    alert(`Selling: ${selectedItem}, Quantity: ${quantity}`);
    setIsModalOpen(false);
    setSelectedItem("");
    setQuantity("");
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
        className="transition duration-300 ease-in-out bg-white text-red-800 px-20 py-2 font-bold rounded-xl hover:text-white hover:bg-red-700 hover:scale-110 active:scale-95 text-base md:text-lg"
        onClick={handleSellClick}
      >
        Sell
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Select an Item to Sell</h2>

            {/* Dropdown for Item Selection */}
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="" disabled>Select an item</option>
              <option value="Item A">Item A</option>
              <option value="Item B">Item B</option>
              <option value="Item C">Item C</option>
              <option value="Item D">Item D</option>
              <option value="Item E">Item E</option>
            </select>

            {/* Quantity Input */}
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full p-2 border rounded-lg mb-4"
              min="0"
            />

            {/* Confirm & Cancel Buttons */}
            <div className="flex justify-between">
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                onClick={handleConfirm}
                disabled={!selectedItem || !quantity || Number(quantity) <= 0}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
