// import React from 'react'

import { useState } from "react";
import { Button, Row } from "react-bootstrap";
import RoomCard from "../room/RoomCard";
import RoomPaginator from "./RoomPaginator";
import PropTypes from "prop-types";

const RoomSearchResults = ({ results, onClearSearch }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 3;
  const totalResults = results.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber + 1);
  };

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedResults = results.slice(startIndex, endIndex);

  return (
    <>
      {results.length > 0 ? (
        <div>
          <h5 className="text-center mt-5">Search Results</h5>
          <Row>
            {paginatedResults.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </Row>

          <Row>
            {totalResults > resultsPerPage && (
              <RoomPaginator
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </Row>

          <Button variant="secondary" onClick={onClearSearch}>
            Clear Search
          </Button>
        </div>
      ) : null}
    </>
  );
};

RoomSearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  onClearSearch: PropTypes.func.isRequired,
};

export default RoomSearchResults;
