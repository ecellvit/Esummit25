import React, { useState } from 'react';

const InsuranceComponent = (props:any) => {
  const insuranceOptions = [
    'Self-Insurance (Cost - 0)', 
    'Basic Plan (Cost - 15,000)', 
    'Premium Plan (Cost - 30,000)', 
    'Platinum Plan (Cost - 60,000)'
];


  // Initialize selectedInsurance as a number (or null)
  // const [selectedInsurance, setSelectedInsurance] = useState<number | null>(null);
  const [showInsurance, setShowInsurance] = useState(true); // Assuming you have a way to toggle this
  

  const handleCloseInsurance = () => {
    setShowInsurance(false);
  };

  const handleConfirmInsurance = () => {
    // Handle confirmation logic here
    console.log('Selected Insurance Index:', props.selectedInsurance);
    setShowInsurance(false);
  };

  return (
    <>
      {showInsurance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center transform transition-all duration-300 scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Insurance Type</h2>
            <div className="mb-6 space-y-3">
              {insuranceOptions.map((option, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="insurance"
                    value={index} // Set the value to the index
                    onChange={(e) => props.setSelectedInsurance(parseInt(e.target.value))} // Store the index
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center ${props.selectedInsurance === index ? 'bg-blue-500 border-blue-500' : ''}`}>
                    {props.selectedInsurance === index && <div className="w-3 h-3 rounded-full bg-white"></div>}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={handleCloseInsurance}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 flex justify-center text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={()=>{props.handleConfirmInsurance();}}
              >
                {props.loading?<span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>:"Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InsuranceComponent;