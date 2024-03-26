// import React from 'react'

import HotelService from "../common/HotelService";
import Parallax from "../common/Parallax";
import MainHeader from "../layout/MainHeader";
import RoomCarousal from "../common/RoomCarousal";

const Home = () => {
  return (
    <section>
      <MainHeader />
      <div className="container">
        <RoomCarousal />
        <Parallax />
        <HotelService />
        <Parallax />
        <RoomCarousal />
      </div>
    </section>
  );
};

export default Home;
