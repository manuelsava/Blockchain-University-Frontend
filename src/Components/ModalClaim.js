import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Swal from "sweetalert2";
import * as Request from '../Helpers/requestCreator';
import { BlockchainContext } from "../Context/BlockchainContext";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

function ModalClaim(props) {
    const {uniContract, signerAddress} = useContext(BlockchainContext);
    const {enrolled, setEnrolled} = useContext(BlockchainContext);

    const [name, setName] = useState("");
    const [signature, setSignature] = useState("");

    const submitForm = async(name, signature) => {
      Swal.fire({
        title: 'Claiming UNI...',
        showConfirmButton: false,
      })

      const tx = await uniContract.claimToken({value: ethers.utils.parseEther("0.001")}).then((result) => {
        console.log(result);
        checkClaim(result.hash, name, signature);
      }).catch((err) => {
        console.log(err);
      });
    }

    const checkClaim = async (hash, name, signature) => {
      const blockNumber = await provider.getBlockNumber();

      let evtContract = new ethers.Contract(uniContract.address, uniContract.interface, provider);
      evtContract.on("Transfer", (...args) => {
        const event = args[args.length - 1];
        if(event.transactionHash.localeCompare(hash) !== 0) return; // do not react to this event
        saveDB(name, signature);
        evtContract.removeAllListeners();
      })
    }

    async function saveDB(name, signature) {
      const status = await Request.RegisterUniversity(name, signature, signerAddress);
      if(status === 200){
        setEnrolled(true);
        props.closeModal();
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
              UNI Claim 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group className="mb-3" controlId="enrollName">
                <Form.Label>Name </Form.Label>
                <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="enrollSurname">
                <Form.Label>Signature </Form.Label>
                <Form.Control type="text" placeholder="Enter Signature" value={signature} onChange={(e) => setSignature(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={ (e)=> {e.preventDefault(); submitForm(name, signature)} }>
                Submit
            </Button>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
 }

 export default ModalClaim;