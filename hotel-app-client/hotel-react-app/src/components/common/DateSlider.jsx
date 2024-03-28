// import React from 'react'
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { useState } from "react";
import PropTypes from "prop-types";

const DateSlider = ({ onDateChange, onFilterChange }) => {
  const selectionRange = {
    startDate: undefined,
    endDate: undefined,
    key: "selection",
  };

  const [dateRange, setDateRange] = useState(selectionRange);

  const handleSelect = (ranges) => {
    setDateRange(ranges.selection);
    onDateChange(ranges.selection.startDate, ranges.selection.endDate);
    onFilterChange(ranges.selection.startDate, ranges.selection.endDate);
  };

  const handleClearFilter = () => {
    setDateRange(selectionRange);
    onDateChange(null, null);
    onFilterChange(null, null);
  };

  return (
    <div>
      <h5>Filter bookings by date</h5>
      <DateRangePicker
        ranges={[dateRange]}
        onChange={handleSelect}
        className="mb-4"
      />
      <button className="btn btn-secondary" onClick={handleClearFilter}>
        Clear Filter
      </button>
    </div>
  );
};

DateSlider.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default DateSlider;
