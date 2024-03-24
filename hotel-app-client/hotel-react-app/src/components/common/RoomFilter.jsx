// import React from 'react'

import { useState } from "react";
import PropTypes from "prop-types";

const RoomFilter = ({ data, setFilteredData }) => {
  const [filter, setFilter] = useState("");

  const handleSelectChange = (e) => {
    const selectedType = e.target.value;
    setFilter(selectedType);

    const filteredRoom = data.filter((room) =>
      room.roomType.toLowerCase().includes(selectedType.toLowerCase())
    );

    setFilteredData(filteredRoom);
  };

  const clearFilter = () => {
    setFilter("");
    setFilteredData(data);
  };

  const roomTypes = ["", ...new Set(data.map((room) => room.roomType))];
  return (
    <div className="input-group mb-3">
      <span className="input-group-text" id="room-type-filter">
        Filter Rooms
      </span>

      <select
        className="form-select"
        aria-label="romm type filter"
        value={filter}
        onChange={handleSelectChange}
      >
        <option value="">Select a room type</option>
        {roomTypes.map((roomType, index) => (
          <option key={index} value={String(roomType)}>
            {String(roomType)}
          </option>
        ))}
      </select>

      <button className="btn btn-hotel" type="button" onClick={clearFilter}>
        Clear Filter
      </button>
    </div>
  );
};

RoomFilter.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      roomType: PropTypes.string.isRequired,
      // Add other relevant prop types for 'data' if needed
    })
  ).isRequired,
  setFilteredData: PropTypes.func.isRequired,
};

export default RoomFilter;
