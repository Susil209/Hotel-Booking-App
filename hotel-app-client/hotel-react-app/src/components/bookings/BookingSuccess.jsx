// import React from 'react'

import { useLocation } from "react-router-dom";
import Header from "../common/Header";
import ToastMessage from "../common/ToastMessage";

const BookingSuccess = () => {
  const location = useLocation();
  const message = location.state?.message;
  const error = location.state?.error;

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb" className="m-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/browse-all-rooms">All Rooms</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Book Room
          </li>
        </ol>
      </nav>
      <Header title={message ? "Booking Success" : "Booking Failed"} />
      <div className="mt-5">
        {message ? (
          <>
            <div>
              <h3 className="text-success"> 🎇Booking is successful!</h3>
              <p className="text-success">{message}</p>
            </div>

            <ToastMessage message="Booking is successful!" bgColor="success" />
          </>
        ) : (
          <>
            <div>
              <h3 className="text-danger"> 👎Error Booking Room!🚫</h3>
              <p className="text-danger">{error}</p>
            </div>

            <ToastMessage message="Error Booking Room!" bgColor="warning" />
          </>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;
