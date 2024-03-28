// import React from 'react'

import Room from "./Room";

const RoomListing = () => {
  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb" className="m-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            All Rooms
          </li>
        </ol>
      </nav>
      <section className="bg-light p-2 mb-5 mt-5 shadow">
        <Room />
      </section>
    </div>
  );
};

export default RoomListing;
