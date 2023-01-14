import React, { useState } from "react";
import {useContext, useEffect} from "react";
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {ethers} from "ethers";
import { NFTStorage, File } from 'nft.storage';
import {BlockchainContext} from "../Context/BlockchainContext";
import Swal from "sweetalert2";
import * as Request from "../Helpers/requestCreator";
window.Buffer = window.Buffer || require("buffer").Buffer;

const provider = new ethers.providers.Web3Provider(window.ethereum);

function ExamCreation (props) {
    const {signerAddress, setSignerAddress} = useContext(BlockchainContext);
    const {examsContract} = useContext(BlockchainContext);

    const [name, setName] = useState("");
    const [cfu, setCfu] = useState("");
    const [eventCalled, setEventCalled] = useState(false);

    const handleSubmitExam = async() => {
        Swal.fire({
            title: 'Uploading exam...',
            showConfirmButton: false,
        })

        const examTx = await examsContract.addExam(name, cfu).then((result) => {
            console.log(result);
            checkExam(result.hash);
            //checkExam();
        }).catch((err) => {
            console.log(err);
        });
    }

    const checkExam = async(hash) => {
        const blockNumber = await provider.getBlockNumber();

        let evtContract = new ethers.Contract(examsContract.address, examsContract.interface, provider);
        //const event = await evtContract.queryFilter("ExamAdded", blockNumber + 1, blockNumber + 10);
        evtContract.on("ExamAdded", (...args) => {
            const event = args[args.length - 1];
            if(event.transactionHash.localeCompare(hash) !== 0) return; // do not react to this event
            saveDB(event.args[0], event.args[1], event.args[2], event.args[3]);
            evtContract.removeAllListeners();
        })
    }

    async function saveDB(arg1, arg2, arg3, arg4) {
        await Request.UploadExam(arg1, arg2, arg3, arg4);
    }

    const onTransaction = async (hash) => {
        let evtContract = new ethers.Contract(examsContract.address, examsContract.interface, provider);
        const startBlockNumber = await provider.getBlockNumber();

        const txListener = evtContract.on("ExamAdded", (...args) => {
            const event = args[args.length - 1];
            if(event.transactionHash.localeCompare(hash) !== 0) return; // do not react to this event
            console.log(hash);
            console.log(event.args[1]);
            evtContract.removeAllListeners();
        })
    }

    return (
        <div style={{width: "75%", marginLeft: "12.5%"}}>
            <Form>
                <Form.Group className="mb-3" controlId="examName">
                    <Form.Label>Name </Form.Label>
                    <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="bookCopies">
                    <Form.Label>CFU </Form.Label>
                    <Form.Control type="number" placeholder="Enter number of CFU" value={cfu} onChange={(e) => setCfu(e.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={ (e)=> {e.preventDefault(); handleSubmitExam()} }>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default ExamCreation;