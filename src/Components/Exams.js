import React, { useState } from "react";
import { useContext, useEffect } from "react";
import Table from 'react-bootstrap/Table'
import Dropdown from "react-bootstrap/Dropdown";
import { BlockchainContext } from "../Context/BlockchainContext";
import * as Request from "../Helpers/requestCreator";
import ModalVerbalize from "./ModalVerbalize";

function Exams(props) {
    const { signerAddress } = useContext(BlockchainContext);

    const [exams, setExams] = useState([])
    const [currentExam, setCurrentExam] = useState();
    const [currentBlockchainID, setCurrentBlockchainID] = useState();
    const [showModalVerbalize, setShowModalVerbalize] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const loadExams = async () => {
            const addr = signerAddress;
            const exs = await Request.LoadExamsByUniversity(signerAddress);
            setExams(exs);
        }

        if (signerAddress) {
            loadExams();
        }
    }, [signerAddress, refresh])

    const handleChangeActive = async (id, newStatus) => {
        setCurrentExam(id);
        const status = await Request.ChangeActive(id, newStatus);
        if (status === 200)
            setRefresh(!refresh);
    }

    const handleModalVerbalize = (id, BlockchainId) => {
        setCurrentBlockchainID(BlockchainId);
        setCurrentExam(id);

        setShowModalVerbalize(true);
    }

    const handleCloseModalVerbalize = () => {
        setShowModalVerbalize(false);
    }

    return (
        <>
            <div className="pagetitle">
                <h1>Exams</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active">Exams</li>
                    </ol>
                </nav>
            </div>
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>CFU</th>
                                    <th>Active</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((element) => {
                                    return (
                                        <tr key={element._id}>
                                            <td>{element._id}</td>
                                            <td>{element.name}</td>
                                            <td>{element.cfu}</td>
                                            <td>{element.active.toString()}</td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                        Action
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={(e) => { e.preventDefault(); handleModalVerbalize(element._id, element.BlockchainID) }}>Verbalize</Dropdown.Item>
                                                        <Dropdown.Item onClick={(e) => { e.preventDefault(); handleChangeActive(element._id, !element.active) }}>Status</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <ModalVerbalize show={showModalVerbalize} exam={currentExam} BlockchainID={currentBlockchainID} closeModal={handleCloseModalVerbalize} refresh={refresh} setRefresh={setRefresh}></ModalVerbalize>
            </div>
        </>
    );
}

export default Exams;