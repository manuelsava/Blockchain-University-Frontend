import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Request from '../Helpers/requestCreator';

import { BlockchainContext } from "../Context/BlockchainContext";
import { NotificationsContext } from "../Context/NotificationsContext";

import ProposalCard from './ProposalCard.js';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

function Proposals(props) {
    const { signerAddress } = useContext(BlockchainContext);
    const { refreshProposals } = useContext(NotificationsContext);

    const [refresh, setRefresh] = useState(false);
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        const getActiveProposals = async () => {
            const data = await Request.getApprovedProposals(signerAddress);
            console.log(data);
            if (data !== null)
                setProposals(data);
        }

        if (signerAddress !== undefined)
            getActiveProposals();
    }, [refresh, signerAddress, refreshProposals])


    return (
        <>
            <div>
                <div className="pagetitle">
                    <h1>Proposals Approved</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                            <li className="breadcrumb-item active">Proposals</li>
                        </ol>
                    </nav>
                </div>
                <div className="container">
                    <div className="row">
                        {proposals.map((element) => {
                            return (
                                <div className="col-sm" key={element.BlockchainID}>
                                    <ProposalCard proposal={element} key={element._id} refresh={refresh} setRefresh={setRefresh}></ProposalCard>
                                </div>
                            )

                        })}
                    </div>
                </div>
            </div>
        </>
    )
}


export default Proposals;