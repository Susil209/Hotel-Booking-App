// import React from 'react'

import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="container m-4">
      <nav aria-label="breadcrumb" className="m-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Admin
          </li>
        </ol>
      </nav>
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
