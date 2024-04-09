// import React from 'react'

import moment from "moment";
import { useState } from "react";
import { getAvailableRooms } from "../utils/ApiFunction";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import RoomTypeSelector from "./RoomTypeSelector";
import RoomSearchResults from "./RoomSearchResults";
import ToastMessage from "./ToastMessage";

const RoomSearch = () => {
  const initialQuery = {
    checkInDate: "",
    checkOutDate: "",
    roomType: "",
  };

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [errorMessage, setErrorMessage] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
    const checkInDate = moment(searchQuery.checkInDate);
    const checkOutDate = moment(searchQuery.checkOutDate);

    if (checkInDate.isValid() && checkOutDate.isValid()) {
      setErrorMessage("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const checkInDate = moment(searchQuery.checkInDate);
    const checkOutDate = moment(searchQuery.checkOutDate);

    // edge cases
    if (!checkInDate.isValid() || !checkOutDate.isValid()) {
      setErrorMessage("Please enter valid dates");
      return;
    }

    if (!checkOutDate.isSameOrAfter(checkInDate)) {
      setErrorMessage("Check-out date must be after check-in date");
      return;
    }

    setIsLoading(true);

    // get all available rooms
    getAvailableRooms(
      searchQuery.checkInDate,
      searchQuery.checkOutDate,
      searchQuery.roomType
    )
      .then((data) => {
        setAvailableRooms(data);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClearSearches = () => {
    setSearchQuery(initialQuery);
    setAvailableRooms([]);
  };

  return (
    <>
      <Container className="shadow mt-5 mb-5 py-5">
        <Form onSubmit={handleSearch}>
          <Row className="justify-content-center">
            <Col xs={12} md={3}>
              <Form.Group controlId="checkInDate">
                <Form.Label>Check-in Date</Form.Label>
                <Form.Control
                  type="date"
                  name="checkInDate"
                  value={searchQuery.checkInDate}
                  onChange={handleInputChange}
                  min={moment().format("YYYY-MM-DD")}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group controlId="checkOutDate">
                <Form.Label>Check-out Date</Form.Label>
                <Form.Control
                  type="date"
                  name="checkOutDate"
                  value={searchQuery.checkOutDate}
                  onChange={handleInputChange}
                  min={moment().format("YYYY-MM-DD")}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group controlId="roomType">
                <Form.Label>Room Type</Form.Label>
                <div className="d-flex gap-2">
                  <RoomTypeSelector
                    handleRoomInputChange={handleInputChange}
                    newRoom={searchQuery}
                  />
                  <Button variant="primary" type="submit" className="ml-2">
                    Search
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {isLoading ? (
          <p className="mt-4">Finding availble rooms....</p>
        ) : availableRooms ? (
          <RoomSearchResults
            results={availableRooms}
            onClearSearch={handleClearSearches}
          />
        ) : (
          <p className="mt-4">
            No rooms available for the selected dates and room type.
          </p>
        )}
        {errorMessage && (
          <>
            <p className="text-danger">{errorMessage}</p>
            <ToastMessage message={errorMessage} bgColor="danger" />
          </>
        )}
      </Container>
    </>
  );
};

export default RoomSearch;
