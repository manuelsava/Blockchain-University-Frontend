import React, { useContext, useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Link } from 'react-router-dom';
import {ethers} from "ethers";

import {BlockchainContext} from "../Context/BlockchainContext";
import Logo from "./assets/img/logo.png";

const MyNavbar = (props) => {
    const {enrolled, graduated, signerAddress} = useContext(BlockchainContext); 

    const handleSidebar = () => {
        props.setToggleSidebar(!props.toggleSidebar);
    }

    useEffect(() => {
        
    }, [signerAddress])

    const transformAddress = (signerAddress) => {
        if(signerAddress === undefined)
            return
        let string = signerAddress.substring(0, 5);
        string += "...";
        string += signerAddress.substring(signerAddress.length - 4, signerAddress.length);
        return string;
    }

    return (
        <header id="header" className="header fixed-top d-flex align-items-center">

            <div className="d-flex align-items-center justify-content-between">
                <a className="logo d-flex align-items-center">
                    <img src={Logo}></img>
                    <span className="d-none d-lg-block" style={{textDecoration: "none"}}>University dApp</span>
                </a>
                <i className="bi bi-list toggle-sidebar-btn" onClick={(e)=> {e.preventDefault(); handleSidebar()}}></i>
            </div>
        
            <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">    
                <li className="nav-item dropdown pe-3">
    
                    <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                        <span className="">{transformAddress(signerAddress)}</span>
                    </a>
                </li>
        
            </ul>
            </nav>
        </header>
    )

    /*return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">University dApp</Navbar.Brand>
                <Nav className="me-auto">
                    <Link exact to="/" className="NavField">Home</Link>
                    {props.login && enrolled && <Link exact to="/exams" className="NavField">Exams</Link>}
                    {props.login && enrolled && <Link exact to="/library-books" className="NavField">Library</Link>}
                    {props.login && enrolled && <Link exact to="/enrollment-requests" className="NavField">Enrollments</Link>}
                    {props.login && enrolled && <Link exact to="/proposals" className="NavField">Proposals</Link>}
                </Nav>
            </Container>
        </Navbar>
    )*/
}

export default MyNavbar;