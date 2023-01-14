import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Link } from 'react-router-dom';
import { ethers } from "ethers";

import { BlockchainContext } from "../Context/BlockchainContext";

const Sidebar = (props) => {
  const { enrolled, setEnrolled } = useContext(BlockchainContext);
  const [currentSelection, setCurrentSelection] = useState(0);

  return (
    <aside id="sidebar" className="sidebar">

      <ul className="sidebar-nav" id="sidebar-nav">

        <li className="nav-item" onClick={(e) => { e.preventDefault(); setCurrentSelection(0) }}>
          <Link exact to="/">
            <a className={currentSelection === 0 ? "nav-link" : "nav-link collapsed"}>
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </a>
          </Link>
        </li>

        <li className="nav-heading">Pages</li>

        {enrolled && <li className="nav-item" onClick={(e) => { e.preventDefault(); setCurrentSelection(1) }}>
          <Link exact to="/exams">
            <a className={currentSelection === 1 ? "nav-link" : "nav-link collapsed"}>
              <i className="bi bi-card-heading"></i>
              <span>Exams</span>
            </a>
          </Link>
        </li>}

        {enrolled && <li className="nav-item" onClick={(e) => { e.preventDefault(); setCurrentSelection(2) }}>
          <Link exact to="/library-books">
            <a className={currentSelection === 2 ? "nav-link" : "nav-link collapsed"}>
              <i className="bi bi-journal-text"></i>
              <span>Library</span>
            </a>
          </Link>
        </li>}

        {enrolled && <li className="nav-item" onClick={(e) => { e.preventDefault(); setCurrentSelection(3) }} >
          <Link exact to="/enrollment-requests">
            <a className={currentSelection === 3 ? "nav-link" : "nav-link collapsed"}>
              <i className="bi bi-envelope"></i>
              <span>Enrollments</span>
            </a>
          </Link>
        </li>}

        {enrolled && <li className="nav-item" onClick={(e) => { e.preventDefault(); setCurrentSelection(4) }}>
          <Link exact to="/proposals">
            <a className={currentSelection === 4 ? "nav-link" : "nav-link collapsed"}>
              <i className="bi bi-card-list"></i>
              <span>Proposals</span>
            </a>
          </Link>
        </li>}
      </ul>
    </aside>
  );
};

export default Sidebar;