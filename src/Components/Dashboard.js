import { ethers } from "ethers";
import React, { useState } from "react";
import { useContext, useEffect } from "react";
import Button from 'react-bootstrap/Button'
import { BlockchainContext } from "../Context/BlockchainContext";
import ModalBook from "./ModalBook";
import ModalClaim from "./ModalClaim";
import ModalExam from "./ModalExam";

const provider = new ethers.providers.Web3Provider(window.ethereum);

function Dashboard(props) {
    const { uniContract, setUniContract } = useContext(BlockchainContext);
    const { signerAddress, setSignerAddress } = useContext(BlockchainContext);
    const { enrolled, setEnrolled } = useContext(BlockchainContext);
    const { universityName, universitySignature } = useContext(BlockchainContext);

    const [balance, setBalance] = useState();
    const [showModalClaim, setShowModalClaim] = useState(false);
    const [showModalBook, setShowModalBook] = useState(false);
    const [showModalExam, setShowModalExam] = useState(false);

    useEffect(() => {
        const getBalance = async () => {
            if (uniContract && signerAddress) {
                const currentBalance = await uniContract.balanceOf(signerAddress);
                setBalance(ethers.utils.formatEther(currentBalance));
            }
        }

        if (props.login) {
            getBalance().catch(console.error);
        }
    }, [uniContract, signerAddress]);

    const handleOpenModalClaim = () => {
        setShowModalClaim(true);
    }

    const handleCloseModalClaim = () => {
        setShowModalClaim(false);
    }

    const handleOpenModalBook = () => {
        setShowModalBook(true);
    }

    const handleCloseModalBook = () => {
        setShowModalBook(false);
    }

    const handleOpenModalExam = () => {
        setShowModalExam(true);
    }

    const handleCloseModalExam = () => {
        setShowModalExam(false);
    }

    const renderDashboard = () => {
        if (enrolled && props.login) {
            return (
                <>
                    <section className="section dashboard">
                        <div className="row">

                            <div className="col-lg-8">
                                <div className="row">

                                    <div className="col-xxl-4 col-md-6 customLarge">
                                        <div className="card info-card sales-card">

                                            <div className="card-body">
                                                <h5 className="card-title">{universityName} <span>| {universitySignature}</span></h5>

                                                <div className="d-flex align-items-center">
                                                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                        <i className="bi bi-bank"></i>
                                                    </div>
                                                    <div className="ps-3">
                                                        <h6>Hello!</h6>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-xxl-4 col-md-6 customLarge">
                                        <div className="card info-card revenue-card">

                                            <div className="card-body">
                                                <h5 className="card-title">UNI <span>| Balance</span></h5>

                                                <div className="d-flex align-items-center">
                                                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                        <i className="bi bi-currency-dollar"></i>
                                                    </div>
                                                    <div className="ps-3">
                                                        <h6>{balance}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-xxl-4 col-xl-12" style={{minWidth: "100%"}}>

                                        <div className="card info-card customers-card">

                                            <div className="card-body">
                                                <h5 className="card-title">Students <span>| Enrolled</span></h5>

                                                <div className="d-flex align-items-center">
                                                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                        <i className="bi bi-people"></i>
                                                    </div>
                                                    <div className="ps-3">
                                                        <h6>1244</h6>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-4">


                                <div className="card" style={{minHeight: "100%"}}>
                                    <div className="card-body">
                                        <h5 className="card-title">Actions<span> | Avaliable</span></h5>

                                        <div className="activity">

                                            <div className="activity-item d-flex">
                                                <div className="activity-content">
                                                    <Button variant="btn btn-primary rounded-pill" onClick={(e) => { e.preventDefault(); handleOpenModalExam() }}>Create Exam</Button>
                                                </div>
                                            </div>

                                            <div className="activity-item d-flex">
                                                <div className="activity-content">
                                                    <Button variant="btn btn-primary rounded-pill" onClick={(e) => { e.preventDefault(); handleOpenModalBook() }}>Create Book</Button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )
        }
        if (props.login && !enrolled){
            return (
                <>
                    <h3>Hello</h3>
                    <Button variant="primary" onClick={(e) => { e.preventDefault(); handleOpenModalClaim() }}>Claim</Button>
                </>
            )
        } if (!props.login){
            return (
                <>
                    <h3>Please connect your wallet</h3>
                    <Button className="btn btn-dark btn-lg" onClick={(e) => { e.preventDefault(); props.connectWallet() }} >Connect with MetaMask 🦊</Button>
                </>
            )
        }
    }

    return (
        <>
            <div className="pagetitle">
                <h1>Dashboard</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                </nav>
            </div>
            {renderDashboard()}
            <ModalClaim show={showModalClaim} closeModal={handleCloseModalClaim}></ModalClaim>
            <ModalBook show={showModalBook} closeModal={handleCloseModalBook}></ModalBook>
            <ModalExam show={showModalExam} closeModal={handleCloseModalExam}></ModalExam>
        </>
    )

    /*return (
        <div>
            {!enrolled && <h2>Hello</h2>}
            {props.login && enrolled && <h2>{universityName + " (" + universitySignature + ")"}</h2>}
            {props.login && <h3>UNI balance: {balance}</h3>}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                {props.login && enrolled && <Button variant="primary" onClick={(e) => { e.preventDefault(); handleOpenModalBook() }}>Create Book</Button>}
                {props.login && enrolled && <Button variant="primary" onClick={(e) => { e.preventDefault(); handleOpenModalExam() }}>Create Exam</Button>}
            </div>
            {!props.login && <h3>Please connect your wallet</h3>}
            {props.login && balance == 0 && !enrolled && <Button variant="primary" onClick={(e) => { e.preventDefault(); handleOpenModalClaim() }}>Claim</Button>}
            <ModalClaim show={showModalClaim} closeModal={handleCloseModalClaim}></ModalClaim>
            <ModalBook show={showModalBook} closeModal={handleCloseModalBook}></ModalBook>
            <ModalExam show={showModalExam} closeModal={handleCloseModalExam}></ModalExam>
        </div>
    );*/
}

export default Dashboard;