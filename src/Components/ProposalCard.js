import React, { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import * as Request from '../Helpers/requestCreator';
import Swal from "sweetalert2";
import { BlockchainContext } from "../Context/BlockchainContext";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

function ProposalCard(props) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{props.proposal.title}</Card.Title>
                <Card.Text>
                    {props.proposal.description}
                </Card.Text>
                <Card.Text>
                    {"Proposed by: " + props.proposal.proposer}
                </Card.Text>
                <Card.Text>
                    {"Approved with " + props.proposal.yes + " votes"}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default ProposalCard;