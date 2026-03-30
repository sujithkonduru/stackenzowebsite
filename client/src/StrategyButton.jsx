import { useState } from "react";

export default function StrategyButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-[#1E301E] rounded-full text-xs sm:text-sm font-semibold hover:bg-[#1E301E] hover:text-white transition-all"
      >
        Schedule Strategy Call
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-3 text-black">Contact Us</h2>
            <p className="mb-4 text-gray-700">
              Please contact us. We will guide you with the best marketing
              strategy and required information.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-[#517e51] text-white-400 rounded-full transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}