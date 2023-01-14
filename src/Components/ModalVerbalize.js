import React, { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import * as Request from '../Helpers/requestCreator';
import { BlockchainContext } from "../Context/BlockchainContext";
import BookCreation from "./BookCreation";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

function ModalVerbalize(props) {
    const {verbalizationsContract} = useContext(BlockchainContext);
    const [enrollments, setEnrollments] = useState([]);

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const loadStudent = async() => {
            const exam = await Request.getExamById(props.exam);
            setEnrollments(exam.enrollments);
        }

        if(props.exam)
            loadStudent().catch(console.error);
    }, [props.exam, refresh])

    const handleVerbalize = async(enrId, student) => {
        var {value: range } = await Swal.fire({
            title: 'Insert Mark',
            icon: 'question',
            input: 'range',
            inputLabel: '',
            inputAttributes: {
              min: 0,
              max: 30,
              step: 1
            },
            inputValue: 18
        })

        Swal.fire({
            title: 'Verbalizing mark...',
            showConfirmButton: false,
        })

        if(range) {
            range = parseInt(range);
            const status = await Request.UploadVerbalization(props.exam, enrId, student, range);
            if(status === 200)
                setRefresh(!refresh);
        }
    }

    return (
      <Modal
        show = {props.show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              Enrollments 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Action</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {enrollments.map((element) => {
                            return (
                                <tr key = {element._id}>
                                    <td>{element._id}</td>
                                    <td>{element.student}</td>
                                    <td>
                                        <Button variant="primary" type="submit" onClick={(e)=> {e.preventDefault(); handleVerbalize(element._id, element.student)} }>
                                            Verbalize
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })} 
                </tbody>
            </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
 }

 export default ModalVerbalize;