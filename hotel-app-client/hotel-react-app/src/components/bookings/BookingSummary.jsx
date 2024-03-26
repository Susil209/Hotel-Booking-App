// import React from 'react'

import moment from "moment";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const BookingSummary = ({ booking, payment, isValidForm, onConfirm }) => {
  const checkInDate = moment(booking.checkInDate);
  const checkOutDate = moment(booking.checkOutDate);
  const numberOfDays = checkOutDate.diff(checkInDate, "days");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  const handleConfirmBooking = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsBookingConfirmed(true);
      onConfirm();
    }, 3000);
  };

  useEffect(() => {
    if (isBookingConfirmed) {
      navigate("/success-error");
    }
  }, [isBookingConfirmed, navigate]);

  return (
    <div className="card card-body mt-5 shadow p-4 mb-5 bg-body-tertiary rounded">
      <h4 className="card-title hotel-color text-center">
        Reservation Summary
      </h4>
        
      <div className="pl-3">
        <div className="mt-2">
          <p>
            Name: <strong>{booking.guestFullName}</strong>
          </p>
          <p>
            Email: <strong>{booking.guestEmail}</strong>
          </p>
          <p>
            Check-in Date:{" "}
            <strong>{moment(booking.checkInDate).format("MMM Do YYYY")}</strong>
          </p>
          <p>
            Check-out Date:{" "}
            <strong>
              {moment(booking.checkOutDate).format("MMM Do YYYY")}
            </strong>
          </p>
          <p>
            Number of Days Booked: <strong>{numberOfDays}</strong>
          </p>
        </div>

        <div>
          <h5 className="hotel-color">Number of Guest</h5>
          <strong>
            Adult{booking.numOfAdults > 1 ? "s" : ""} : {booking.numOfAdults}
          </strong>
          <strong>
            <p>Children : {booking.numOfChildren}</p>
          </strong>
        </div>

        {payment > 0 ? (
          <div>
            <p>
              Total payment: <strong>${payment}</strong>
            </p>

            {isValidForm && !isBookingConfirmed ? (
              <div className="d-grid">
                <Button
                  className="mt-4"
                  variant="success"
                  size="md"
                  onClick={handleConfirmBooking}
                >
                  {isProcessingPayment ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Booking Confirmed, redirecting to payment...
                    </>
                  ) : (
                    "Confirm Booking & proceed to payment"
                  )}
                </Button>
              </div>
            ) : isBookingConfirmed ? (
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-danger">
            Check-out date must be after check-in date.
          </p>
        )}
      </div>
    </div>
  );
};

BookingSummary.propTypes = {
  booking: PropTypes.shape({
    checkInDate: PropTypes.string.isRequired,
    checkOutDate: PropTypes.string.isRequired,
    guestFullName: PropTypes.string.isRequired,
    guestEmail: PropTypes.string.isRequired,
    numOfAdults: PropTypes.string.isRequired,
    numOfChildren: PropTypes.string.isRequired,
    // Add any other properties you expect in the 'booking' object
  }).isRequired,

  payment: PropTypes.number.isRequired, // Adjust the type as needed
  isValidForm: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default BookingSummary;
