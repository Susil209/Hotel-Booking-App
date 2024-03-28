// import React from 'react'

import { useEffect, useState } from "react";
import { deleteRoom, getAllRooms } from "../utils/ApiFunction";
import { Col, Row } from "react-bootstrap";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExistingRoom = () => {
  const initialState = { id: "", roomType: "", roomPrice: "" };

  const [rooms, setRooms] = useState([initialState]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([initialState]);
  const [selectedRoomType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // fetch all the rooms
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const result = await getAllRooms();
      setRooms(result);
      setIsLoading(false);
    } catch (e) {
      setErrorMessage(e.message);
      setIsLoading(false);
    }
  };

  //fetch all roomtypes filters
  useEffect(() => {
    if (selectedRoomType === "") {
      setFilteredRooms(rooms);
    } else {
      // set filtered rooms
      const filteredRooms = rooms.filter(
        (room) => room.roomType === selectedRoomType
      );
      setFilteredRooms(filteredRooms);
    }
    // set the current page to 1st page
    setCurrentPage(1);
  }, [rooms, selectedRoomType]);

  const calculatetotalPages = (filteredRooms, roomsPerPage, rooms) => {
    const totalRooms =
      filteredRooms.length > 0 ? filteredRooms.length : rooms.length;
    return Math.ceil(totalRooms / roomsPerPage);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (roomId) => {
    try {
      const response = await deleteRoom(roomId);
      if (response === "") {
        setSuccessMessage(`Room with id ${roomId} was deleted`);
        fetchRooms();
      } else {
        console.error(`Error deleting room : ${response.message}`);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
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
            Existing Rooms
          </li>
        </ol>
      </nav>
      {/* Success and error message */}
      <div className="container col-md-8 col-lg-6">
        {successMessage && (
          <p className="alert alert-success mt-5">{successMessage}</p>
        )}

        {errorMessage && (
          <p className="alert alert-danger mt-5">{errorMessage}</p>
        )}
      </div>

      {isLoading ? (
        <p>Loading existing rooms....</p>
      ) : (
        <section className="mt-5 mb-5 container">
          <div className="d-flex justify-content-between mb-3 mt-5">
            <h2>Existing Rooms</h2>
          </div>

          {/* filter rooms */}
          <Row>
            <Col md={6} className="mb-2 md-mb-0">
              <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
            </Col>

            {/* Add new room */}
            <Col md={6} className="d-flex justify-content-end">
              <Link to={"/add-room"}>
                <FaPlus />
                Add Room
              </Link>
            </Col>
          </Row>

          <table className="table table-bordered table-hover">
            <thead>
              <tr className="text-center">
                <th>ID</th>
                <th>Room Type</th>
                <th>Room Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentRooms.map((room) => (
                <tr key={room.id} className="text-center">
                  <td>{room.id}</td>
                  <td>{room.roomType}</td>
                  <td>{room.roomPrice}</td>
                  <td className="gap-2">
                    <Link to={`/edit-room/${room.id}`}>
                      <span className="btn btn-info btn-sm">
                        <FaEye />
                      </span>
                      <span className="btn btn-warning btn-sm ml-5">
                        <FaEdit />
                      </span>
                    </Link>

                    <button
                      className="btn btn-danger btn-sm ml-5"
                      onClick={() => handleDelete(room.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Room pages */}

          <RoomPaginator
            currentPage={currentPage}
            totalPages={calculatetotalPages(filteredRooms, roomsPerPage, rooms)}
            onPageChange={handlePaginationClick}
          />
        </section>
      )}
    </div>
  );
};

export default ExistingRoom;
