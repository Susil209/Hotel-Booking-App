// import React from 'react'

import { useEffect, useState } from "react";
import BookingForm from "./BookingForm";
import { getRoomById } from "../utils/ApiFunction";
import { useParams } from "react-router-dom";
import {
  FaUtensils,
  FaWifi,
  FaTv,
  FaWineGlassAlt,
  FaParking,
  FaCar,
  FaTshirt,
} from "react-icons/fa";
import RoomCarousal from "../common/RoomCarousal";

const Checkout = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState({
    photo: "",
    roomType: "",
    roomPrice: "",
  });

  const { roomId } = useParams();

  // get room by id
  useEffect(() => {
    setTimeout(() => {
      getRoomById(roomId)
        .then((room) => {
          setRoomInfo(room);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }, 2000);
  }, [roomId]);

  return (
    <div>
      <nav aria-label="breadcrumb" className="m-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/browse-all-rooms">All Rooms</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Book Room
          </li>
        </ol>
      </nav>
      <section className="container ">
        <div className="row">
          <div className="col-md-4 mt-5 mb-2">
            {loading ? (
              <>
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">
                    Loading room information...
                  </span>
                </div>
                <p>Loading room information...</p>
              </>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="room-info min-vh-90 shadow p-2 mb-5 bg-body-tertiary rounded">
                <img
                  src={`data:image/png;base64,${roomInfo.photo}`}
                  alt="Room photo"
                  style={{ width: "100%", height: "230px" }}
                  className="mt-2"
                />

                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <th>Room Type:</th>
                      <td>{roomInfo.roomType}</td>
                    </tr>
                    <tr>
                      <th>Price per night:</th>
                      <td>${roomInfo.roomPrice}</td>
                    </tr>
                    <tr>
                      <th>Room Service:</th>
                      <td>
                        <ul className="list-unstyled">
                          <li>
                            <FaWifi /> Wifi
                          </li>
                          <li>
                            <FaTv /> Netfilx Premium
                          </li>
                          <li>
                            <FaUtensils /> Breakfast
                          </li>
                          <li>
                            <FaWineGlassAlt /> Mini bar refreshment
                          </li>
                          <li>
                            <FaCar /> Car Service
                          </li>
                          <li>
                            <FaParking /> Parking Space
                          </li>
                          <li>
                            <FaTshirt /> Laundry
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="col-md-8">
            <BookingForm />
          </div>
        </div>
      </section>
      <div className="container">
        <RoomCarousal />
      </div>
    </div>
  );
};

export default Checkout;
