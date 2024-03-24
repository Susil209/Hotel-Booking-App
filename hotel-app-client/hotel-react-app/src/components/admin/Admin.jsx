// import React from 'react'

import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div>
      <section className="container mt-5">
        <h2>Admin Panel</h2>
        <hr />
        <Link to={"/existing-rooms"}>Manage Rooms</Link> <br />
        <Link to={"/existing-bookings"}>Manage Bookings</Link>
      </section>
    </div>
  );
};

export default Admin;
