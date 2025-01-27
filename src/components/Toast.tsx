import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingPage = () => {
  const handlePaymentSuccess = () => {
    toast.success("ชำระเงินสำเร็จแล้ว!");
  };

  return (
    <div>
      <ToastContainer />
      {/* Other components */}
      <button onClick={handlePaymentSuccess}>Test Payment Success</button>
    </div>
  );
};

export default BookingPage;
