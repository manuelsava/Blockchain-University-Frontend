import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Swal from "sweetalert2";
import * as Request from '../Helpers/requestCreator';
import { BlockchainContext } from "../Context/BlockchainContext";
import BookCreation from "./BookCreation";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();


function ModalBook(props) {

    return (
      <Modal
        show = {props.show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              BookNFT Creation 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <BookCreation></BookCreation>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
 }

 export default ModalBook;