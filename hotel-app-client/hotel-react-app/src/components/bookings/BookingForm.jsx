// import React from 'react'

import { useEffect, useState } from "react";
import { bookRoom, getRoomById } from "../utils/ApiFunction";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import BookingSummary from "./BookingSummary";

const BookingForm = () => {

  const [validated, setValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);

  const currentUser = localStorage.getItem("userId");

  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: currentUser,
    checkInDate: "",
    checkOutDate: "",
    numOfAdults: "",
    numOfChildren: "",
  });

  const { roomId } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
    setErrorMessage("");
  };

  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId);
      setRoomPrice(response.roomPrice);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    getRoomPriceById(roomId);
  }, [roomId]);

  const calculatePayment = () => {
    // parse date from string to moment object
    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);

    const differenceInDays = checkOutDate.diff(checkInDate, "days");

    const price = roomPrice ? roomPrice : 0;

    return differenceInDays * price;
  };

  const isGuestCountValid = () => {
    const adultCount = parseInt(booking.numOfAdults);
    const childrenCount = parseInt(booking.numOfChildren);

    const totalCount = adultCount + childrenCount;
    return totalCount >= 1 && adultCount >= 1;
  };

  const isValidCheckOutDate = () => {
    // if checkout date is not same or after checkin date
    if (!moment(booking.checkOutDate).isSameOrAfter(booking.checkInDate)) {
      setErrorMessage("Check-out date must be after check-in date");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (
      form.checkValidity() === false ||
      !isGuestCountValid() ||
      !isValidCheckOutDate()
    ) {
      e.stopPropagation();
    } else {
      setIsSubmitted(true);
    }
    setValidated(true);
  };

  const handleBooking = async () => {
    try {
      const confirmationCode = await bookRoom(roomId, booking);
      setIsSubmitted(true);
      navigate("/success-error", { state: { message: confirmationCode } });
    } catch (error) {
      setErrorMessage(error.message);
      //   console.log(error.message);
      navigate("/success-error", { state: { error: error.message } });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="card card-body mt-5 shadow p-4 mb-5 bg-body-tertiary rounded">
            {/* title */}
            <h4 className="card-title text-center">Reserve Room</h4>

            {/* form */}
            {/* Browsers provide their own validation UI by default on forms.
             You can disable the default UI by adding the HTML 'noValidate' attribute
              to your <Form> or <form> element. */}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label htmlFor="guestFullName" className="hotel-color">
                  Fullname
                </Form.Label>
                <FormControl
                  required
                  type="text"
                  id="guestFullName"
                  name="guestFullName"
                  value={booking.guestFullName}
                  placeholder="Enter your fullname"
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Control.Feedback type="invalid">
                Please enter your fullname.
              </Form.Control.Feedback>

              <Form.Group>
                <Form.Label htmlFor="guestEmail" className="hotel-color mt-2">
                  Email
                </Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  <Form.Control
                    required
                    type="email"
                    id="guestEmail"
                    name="guestEmail"
                    value={booking.guestEmail}
                    placeholder="Enter your email address"
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <fieldset style={{ border: "2px", padding: "5px" }}>
                <legend className="fs-5 fw-medium pt-3">Lodging Period</legend>
                <div className="row">
                  <div className="col-6">
                    <Form.Label htmlFor="checkInDate" className="hotel-color">
                      Check-in date
                    </Form.Label>
                    <Form.Control
                      required
                      type="date"
                      id="checkInDate"
                      name="checkInDate"
                      value={booking.checkInDate}
                      placeholder="check-in-date"
                      min={moment().format("MMM Do YYYY")}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please select a check in date.
                    </Form.Control.Feedback>
                  </div>

                  <div className="col-6">
                    <Form.Label htmlFor="checkOutDate" className="hotel-color">
                      Check-out date
                    </Form.Label>
                    <Form.Control
                      required
                      type="date"
                      id="checkOutDate"
                      name="checkOutDate"
                      value={booking.checkOutDate}
                      placeholder="check out date"
                      min={moment().format("MMM Do YYYY")}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please select a check out date.
                    </Form.Control.Feedback>
                  </div>
                  {errorMessage && (
                    <p className="error-message text-danger">{errorMessage}</p>
                  )}
                </div>
              </fieldset>

              <fieldset style={{ border: "2px" }}>
                <legend className="fs-5 fw-medium pt-3">Number of Guest</legend>
                <div className="row">
                  <div className="col-6">
                    <Form.Label htmlFor="numOfAdults" className="hotel-color">
                      Adults
                    </Form.Label>
                    <FormControl
                      required
                      type="number"
                      id="numOfAdults"
                      name="numOfAdults"
                      value={booking.numOfAdults}
                      min={1}
                      placeholder="0"
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please select at least 1 adult.
                    </Form.Control.Feedback>
                  </div>

                  <div className="col-6">
                    <Form.Label htmlFor="numOfChildren" className="hotel-color">
                      Children
                    </Form.Label>
                    <FormControl
                      required
                      type="number"
                      id="numOfChildren"
                      name="numOfChildren"
                      value={booking.numOfChildren}
                      placeholder="0"
                      min={0}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Select 0 if no children
                    </Form.Control.Feedback>
                  </div>
                </div>
              </fieldset>

              <div className="form-group mt-2 mb-2">
                <button type="submit" className="btn btn-hotel mt-4">
                  Continue
                </button>
              </div>
            </Form>
          </div>
        </div>

        <div className="col-md-6 ">
          {isSubmitted && (
            <BookingSummary
              booking={booking}
              payment={calculatePayment()}
              onConfirm={handleBooking}
              isValidForm={validated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
