// import React from 'react'

import { useLocation } from "react-router-dom";
import Header from "../common/Header";

const BookingSuccess = () => {
  const location = useLocation();
  const message = location.state?.message;
  const error = location.state?.error;

  return (
    <div className="container">
      <Header title={message ? "Booking Success" : "Booking Failed"} />
      <div className="mt-5">
        {message ? (
          <div>
            <h3 className="text-success"> 🎇Booking is successful!</h3>
            <p className="text-success">{message}</p>
          </div>
        ) : (
          <div>
            <h3 className="text-danger"> 👎Error Booking Room!🚫</h3>
            <p className="text-danger">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;
