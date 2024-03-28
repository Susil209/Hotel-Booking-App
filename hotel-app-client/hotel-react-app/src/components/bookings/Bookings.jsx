// import React from 'react'

import { useEffect, useState } from "react";
import { cancelBooking, getAllBookings } from "../utils/ApiFunction";
import Header from "../common/Header";
import BookingsTable from "./BookingsTable";

const Bookings = () => {
  const [bookingInfo, setBookingInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => {
      getAllBookings()
        .then((data) => {
          setBookingInfo(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });
    }, 1000);
  }, []);

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      const data = await getAllBookings();
      setBookingInfo(data);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="container">
      <nav aria-label="breadcrumb" className="m-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/admin">Admin</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Existing Bookings
          </li>
        </ol>
      </nav>
      <section style={{ backgroundColor: "whitesmoke" }} className="mt-4">
        <Header title={"Existing Bookings"} />

        {error && <div className="text-danger">{error}</div>}

        {isLoading ? (
          <div className="d-flex m-4 gap-2 justify-content-center">
            <div
              className="spinner-grow spinner-grow-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <div
              className="spinner-grow spinner-grow-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <div
              className="spinner-grow  spinner-grow-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <div>Loading existing bookings...</div>
          </div>
        ) : (
          <BookingsTable
            bookingInfo={bookingInfo}
            handleBookingCancellation={handleBookingCancellation}
          />
        )}
      </section>
    </div>
  );
};

export default Bookings;
