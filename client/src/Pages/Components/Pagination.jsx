import React from "react";

const Pagination = ({ currPage, SetcurrPage, pageNumbers, npage }) => {
  const prevPage = () => {
    if (currPage !== 1) SetcurrPage(currPage - 1);
  };
  const nextPage = () => {
    if (currPage !== npage) SetcurrPage(currPage + 1);
  };

  return (
    <ul className="pagination">
      <li className="page-item">
        <a className="page-link" onClick={prevPage}>
          Prev
        </a>
      </li>
      {pageNumbers.map((n, i) => (
        <li className={`page-item ${currPage === n && "active-item"}`} key={i}>
          <a className="page-link" onClick={() => SetcurrPage(n)} key={i}>
            {n}
          </a>
        </li>
      ))}
      <li className="page-item">
        <a className="page-link" onClick={nextPage}>
          Next
        </a>
      </li>
    </ul>
  );
};

export default Pagination;
