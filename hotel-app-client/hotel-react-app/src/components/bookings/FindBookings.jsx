// import React from 'react'

import { useState } from "react";
import {
  cancelBooking,
  getBookingByConfirmationCode,
} from "../utils/ApiFunction";
import moment from "moment";
import ToastMessage from "../common/ToastMessage";

const FindBookings = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initialBookingState = {
    bookingId: "",
    bookingConfirmationCode: "",
    room: { id: "", roomType: "" },
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestFullName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuests: "",
  };

  const [bookingInfo, setBookingInfo] = useState(initialBookingState);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleInputChange = (event) => {
    setConfirmationCode(event.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await getBookingByConfirmationCode(confirmationCode);
      setBookingInfo(data);
      setError(null);
    } catch (error) {
      setBookingInfo(initialBookingState);
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
    }

    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setIsDeleted(true);
      setSuccessMessage("Booking cancelled successfully");
      setBookingInfo(initialBookingState);
      setConfirmationCode(confirmationCode);
      setError(null);
    } catch (error) {
      setError(error.message);
    }

    setTimeout(() => {
      setSuccessMessage("");
      setIsDeleted(false);
    }, 2000);
  };

  return (
    <div className="container">
      <nav aria-label="breadcrumb" className="m-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Find Bookings
          </li>
        </ol>
      </nav>
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-center mb-4">Find My Bookings</h2>
        <form onSubmit={handleFormSubmit} className="col-md-6">
          <div className="input-group mb-3">
            <input
              className="form-control"
              type="text"
              id="confirmationCode"
              name="confirmationCode"
              value={confirmationCode}
              onChange={handleInputChange}
              placeholder="Enter confirmation code"
            />
            <button type="submit" className="btn btn-hotel input-group-text">
              Find booking
            </button>
          </div>
        </form>

        {isLoading ? (
          <div className="d-flex gap-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">
                Loading room information...
              </span>
            </div>
            <div>Finding your booking information...</div>
          </div>
        ) : error ? (
          <>
            <div className="text-danger">Error: {error}</div>
            <ToastMessage message={error} bgColor="danger" />
          </>
        ) : bookingInfo.bookingConfirmationCode ? (
          <div className="col-md-6 mt-4 mb-5 shadow p-5 bg-body-tertiary rounded">
            <h3 className="text-center pb-3">Booking Information</h3>
            <p className="text-success fw-bold">
              Confirmation Code: {bookingInfo.bookingConfirmationCode}
            </p>
            <p className="fw-semibold">Room Number: {bookingInfo.room.id}</p>
            <p className="fw-semibold">
              Room Type: {bookingInfo.room.roomType}
            </p>
            <p className="fw-semibold">
              Check-in Date:{" "}
              {moment(bookingInfo.checkInDate)
                .subtract(1, "month")
                .format("MMM Do, YYYY")}
            </p>
            <p className="fw-semibold">
              Check-out Date:{" "}
              {moment(bookingInfo.checkInDate)
                .subtract(1, "month")
                .format("MMM Do, YYYY")}
            </p>
            <p className="fw-semibold">
              Full Name: {bookingInfo.guestFullName}
            </p>
            <p className="fw-semibold">
              Email Address: {bookingInfo.guestEmail}
            </p>
            <p className="fw-semibold">Adults: {bookingInfo.numOfAdults}</p>
            <p className="fw-semibold">Children: {bookingInfo.numOfChildren}</p>
            <p className="fw-semibold">
              Total Guest: {bookingInfo.totalNumOfGuests}
            </p>

            {!isDeleted && (
              <button
                onClick={() => handleBookingCancellation(bookingInfo.bookingId)}
                className="btn btn-danger"
              >
                Cancel Booking
              </button>
            )}
          </div>
        ) : (
          <div className="fs-5 fw-medium">
            Enter confirmation code to find your Bookings.
          </div>
        )}

        {isDeleted && (
          <>
            <div className="alert alert-success mt-3 fade show">
              {successMessage}
            </div>
            <ToastMessage message={successMessage} bgColor="warning" />
          </>
        )}
      </div>
    </div>
  );
};

export default FindBookings;
