import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Swal from "sweetalert2";
import * as Request from '../Helpers/requestCreator';
import { BlockchainContext } from "../Context/BlockchainContext";
import BookCreation from "./BookCreation";
import ExamCreation from "./ExamCreation";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

function ModalExam(props) {

    return (
      <Modal
        show = {props.show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              Exam Creation 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ExamCreation></ExamCreation>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
 }

 export default ModalExam;