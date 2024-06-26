// import React from 'react'

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DateSlider from "../common/DateSlider";
import parseISO from "date-fns/parseISO";

const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
  const [filteredBookings, setFilteredBookings] = useState(bookingInfo);

  const handleFilteredBookings = (startDate, endDate) => {
    let filteredData = bookingInfo;

    // {
    //   console.log(startDate, endDate);
    // }

    if (startDate && endDate) {
      filteredData = bookingInfo.filter((booking) => {
        const bookingStartDate = parseISO(booking.checkInDate);
        const bookingEndDate = parseISO(booking.checkOutDate);

        // console.log(bookingStartDate, bookingEndDate);
        // console.log(parse(startDate), parse(endDate));

        return (
          bookingStartDate >= startDate &&
          bookingEndDate <= endDate &&
          bookingEndDate > startDate
        );
      });
    }

    setFilteredBookings(filteredData);
  };

  useEffect(() => {
    setFilteredBookings(bookingInfo);
  }, [bookingInfo]);

  return (
    <section className="p-4">
      <DateSlider
        onDateChange={handleFilteredBookings}
        onFilterChange={handleFilteredBookings}
      />

      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Booking ID</th>
            <th>Room ID</th>
            <th>Room Type</th>
            <th>Check-In Date</th>
            <th>Check-Out Date</th>
            <th>Guest Name</th>
            <th>Guest Email</th>
            <th>Adults</th>
            <th>Children</th>
            <th>Total Guest</th>
            <th>Confirmation Code</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {filteredBookings.map((booking, index) => (
            <tr key={booking.bookingId}>
              <td>{index + 1}</td>
              <td>{booking.bookingId}</td>
              <td>{booking.room.id}</td>
              <td>{booking.room.roomType}</td>
              <td>{booking.checkInDate}</td>
              <td>{booking.checkOutDate}</td>
              <td>{booking.guestFullName}</td>
              <td>{booking.guestEmail}</td>
              <td>{booking.numOfAdults}</td>
              <td>{booking.numOfChildren}</td>
              <td>{booking.totalNumOfGuests}</td>
              <td>{booking.bookingConfirmationCode}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleBookingCancellation(booking.id)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {handleFilteredBookings.length === 0 && (
        <p>Sorry, no booking found for the selected dates.</p>
      )}
    </section>
  );
};

BookingsTable.propTypes = {
  bookingInfo: PropTypes.arrayOf(
    PropTypes.shape({
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      // Add any other properties you expect in each booking object
    })
  ).isRequired,
  handleBookingCancellation: PropTypes.func.isRequired,
};

export default BookingsTable;
