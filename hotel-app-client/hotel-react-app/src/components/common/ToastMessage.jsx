// import React from 'react'
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";

const ToastMessage = ({ message, bgColor }) => {
  const [show, setShow] = useState(true);
  const toggleShow = () => setShow(!show);

  useEffect(() => {
    setTimeout(() => {
      setShow(!show);
    }, 4000);
  }, []);

  return (
    <div className="toast-container top-0 end-0 p-3">
      <Toast
        show={show}
        onClose={toggleShow}
        className={`toast align-items-center p-2 text-bg-${bgColor} border-0`}
      >
        <div className="d-flex">
          <Toast.Body className="fs-6 fw-semibold">
            {message}
          </Toast.Body>
          <button
            type="button"
            className="btn-close me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={toggleShow}
          ></button>
        </div>
      </Toast>
    </div>
  );
};

ToastMessage.propTypes = {
  message: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default ToastMessage;
