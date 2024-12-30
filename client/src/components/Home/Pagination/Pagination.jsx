import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  console.log('Current Page:', currentPage);
  console.log('Total Pages:', totalPages);

  const pageNumbers = [];
  const pageLimit = 5; // Number of page buttons to show at a time

  // Calculate start and end page
  let startPage = Math.max(currentPage - Math.floor(pageLimit / 2), 1);
  let endPage = startPage + pageLimit - 1;

  // Adjust if endPage exceeds totalPages
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - pageLimit + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Prev
      </button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`pagination-button ${
            currentPage === page ? "active-page" : ""
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
