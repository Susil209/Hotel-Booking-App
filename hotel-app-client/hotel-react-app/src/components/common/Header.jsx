// import React from 'react'
import PropTypes from "prop-types";

const Header = ({ title }) => {
  return (
    <header className="header">
      <div className="overlay">
        <div className="container">
          <h1 className="header-title text-center mt-4">{title}</h1>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
