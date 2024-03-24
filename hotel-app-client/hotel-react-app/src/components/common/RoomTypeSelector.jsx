// import React from 'react'

import { useEffect, useState } from "react";
import { getRoomTypes } from "../utils/ApiFunction";
import PropTypes from "prop-types";

const RoomTypeSelector = ({ handleRoomInputChange, newRoom }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false);
  const [newRoomType, setNewRoomType] = useState("");

  // get all room types from backend api
  useEffect(() => {
    getRoomTypes().then((data) => {
      // console.log(data);
      setRoomTypes(data);
    });
  }, []);

  const handleNewRoomTypeInputChange = (e) => {
    setNewRoomType(e.target.value);
  };

  const handleAddNewRoomType = () => {
    if (newRoomType !== "") {
      setRoomTypes([...roomTypes, newRoomType]);
      setNewRoomType("");
      setShowNewRoomTypeInput(false);
    }
  };

  RoomTypeSelector.propTypes = {
    handleRoomInputChange: PropTypes.func.isRequired,
    newRoom: PropTypes.shape({
      roomType: PropTypes.string.isRequired,
      // Add other relevant prop types for 'newRoom' if needed
    }).isRequired,
  };

  return (
    <>
      {/* {console.log(roomTypes)} */}
      {roomTypes.length > 0 && (
        <div>
          <select
            className="form-select"
            name="roomType"
            onChange={(e) => {
              if (e.target.value === "Add New") {
                setShowNewRoomTypeInput(true);
              } else {
                handleRoomInputChange(e);
              }
            }}
            value={newRoom.roomType}
            required
          >
            <option value="">Select a room type</option>
            <option value="Add New">Add New</option>
            {roomTypes.map((room, index) => (
              <option key={index} value={room}>
                {room}
              </option>
            ))}
          </select>

          {showNewRoomTypeInput && (
            <div className="mt-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="newRoomType"
                  placeholder="Enter room type"
                  value={newRoomType}
                  onChange={handleNewRoomTypeInputChange}
                />
                <button
                  className="btn btn-hotel"
                  type="button"
                  onClick={handleAddNewRoomType}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RoomTypeSelector;
