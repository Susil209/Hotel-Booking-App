// import React from 'react'

import { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunction";
import { Link } from "react-router-dom";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";

const RoomCarousal = () => {
  const initialState = {
    id: "",
    roomType: "",
    roomPrice: "",
    photo: "",
  };

  const [rooms, setRooms] = useState([initialState]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // get all rooms
  useEffect(() => {
    setIsLoading(true);
    getAllRooms()
      .then((data) => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="mt-5">Loading rooms....</div>;
  }
  if (errorMessage) {
    return <div className=" text-danger mb-5 mt-5">Error : {errorMessage}</div>;
  }

  return (
    <section className="bg-white mb-5 mt-5 p-3 shadow-lg">
      <Link to={"/browse-all-rooms"} className="hotel-color text-center ">
        Browse all rooms
      </Link>

      <Container>
        <Carousel indicators={false}>
          {[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
            <Carousel.Item key={index}>
              <Row>
                {/* i=1 => 4 -> 8 , i=2 => 8 - 12 ...*/}
                {rooms.slice(index * 4, index * 4 + 4).map((room) => (
                  <Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
                    <Card>
                      {/* Image */}
                      <Link to={`/book-room/${room.id}`}>
                        <Card.Img
                          variant="top"
                          src={`data:image/png;base64, ${room.photo}`}
                          alt="Room Photo"
                          className="w-100"
                          style={{ height: "200px" }}
                        />
                      </Link>

                      {/* Roomtype, room price  */}
                      <Card.Body>
                        <Card.Title className="hotel-color">
                          {room.roomType}
                        </Card.Title>
                        <Card.Title className="room-price">
                          ${room.roomPrice}/night
                        </Card.Title>

                        {/* Book room */}
                        <div className="flex-shrink-0">
                          <Link
                            to={`/book-room/${room.id}`}
                            className="btn btn-hotel btn-md"
                          >
                            Book Now
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default RoomCarousal;
