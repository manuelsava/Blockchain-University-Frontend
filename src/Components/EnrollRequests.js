import React, { useState } from "react";
import { useContext, useEffect } from "react";
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Dropdown from "react-bootstrap/Dropdown";
import { ethers } from "ethers";
import { BlockchainContext } from "../Context/BlockchainContext";
import * as Request from "../Helpers/requestCreator";
import { NFTStorage, File, Blob } from 'nft.storage'
import Swal from "sweetalert2";
import { NotificationsContext } from "../Context/NotificationsContext";

const provider = new ethers.providers.Web3Provider(window.ethereum);

function EnrollRequests(props) {
    const [requests, setRequests] = useState([]);
    const [refreshList, setRefreshList] = useState(false);

    const { signerAddress, enrollContract, client } = useContext(BlockchainContext);
    const { refreshEnrollment } = useContext(NotificationsContext);


    useEffect(() => {
        const getRequests = async () => {
            const pendingRequests = await Request.getPendingRequests(signerAddress);
            setRequests(pendingRequests);
        }

        if (signerAddress) {
            getRequests().catch(console.error);
        }
    }, [signerAddress, refreshList, refreshEnrollment]);

    const handleAccept = async (id, wallet, name, surname) => {
        var metadata;

        try {
            const imageTitle = name + surname + "ID.png";

            const { value: file } = await Swal.fire({
                title: 'Id NFT image',
                input: 'file',
                inputAttributes: {
                    'accept': 'image/*',
                    'aria-label': 'Upload the NFT image'
                }
            })

            Swal.fire({
                title: 'Uploading Id NFT...',
                showConfirmButton: false,
            });

            if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                }
                reader.readAsDataURL(file)
            }

            metadata = await client.store({
                name: name,
                surname: surname,
                wallet: wallet,
                description: "Id NFT",
                university: signerAddress,
                image: new File([file], imageTitle, { type: 'image/png' })
            });

            const enrollStudent = await enrollContract.enrollStudent(wallet, metadata.url).then((result) => {
                console.log(result);
                checkEnroll(result.hash, metadata.url, id, name, surname);
            }).catch((err) => {
                console.log(err);
            });
        } catch (err) {
            console.log(err);
        }
    }

    const handleReject = async (id) => {
        const status = await Request.DeleteRequest(id);
        setRefreshList(!refreshList);
    }

    const checkEnroll = async (hash, url, id, name, surname) => {
        const blockNumber = await provider.getBlockNumber();

        let evtContract = new ethers.Contract(enrollContract.address, enrollContract.interface, provider);
        evtContract.on("Enrolled", (...args) => {
            const event = args[args.length - 1];
            if(event.transactionHash.localeCompare(hash) !== 0) return; // do not react to this event
            saveDB(event.args[0], event.args[1], event.args[2], url, name, surname, id);
            evtContract.removeAllListeners();
        })
    }

    async function saveDB(arg0, arg1, arg2, url, name, surname, id) {
        Request.UploadIdNFT(arg0, arg1, arg2, url, name, surname); //uni, student, tokenId
        const status = await Request.DeleteRequest(id);
        if (status === 200)
            setRefreshList(!refreshList);
    }

    return (
        <>
            <div className="pagetitle">
                <h1>Enrollments</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active">Enrollments</li>
                    </ol>
                </nav>
            </div>
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <Table responsive style={{overflow: "visible!important"}}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>Wallet</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((element) => {
                                    return (
                                        <tr key={element._id}>
                                            <td>{element._id}</td>
                                            <td>{element.name}</td>
                                            <td>{element.surname}</td>
                                            <td>{element.wallet}</td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                        Action
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={(e) => { e.preventDefault(); handleAccept(element._id, element.wallet, element.name, element.surname) }}>Accept</Dropdown.Item>
                                                        <Dropdown.Item onClick={(e) => { e.preventDefault(); handleReject(element._id) }}>Reject</Dropdown.Item>
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
            </div>
        </>
    );
}

export default EnrollRequests;