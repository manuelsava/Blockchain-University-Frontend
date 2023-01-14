import React, { useState } from "react";
import { useContext, useEffect } from "react";
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { ethers } from "ethers";
import { BlockchainContext } from "../Context/BlockchainContext";
import * as Request from "../Helpers/requestCreator";

function LibraryBooks(props) {
    const { signerAddress, setSignerAddress } = useContext(BlockchainContext);
    const { libraryContract, bookContract } = useContext(BlockchainContext);
    const { client } = useContext(BlockchainContext);

    const [metadata, setMetadata] = useState([]);

    useEffect(() => {

        const getNFTs = async () => {
            props.setLoading(true);
            const NFTs = await Request.getBookNFTs(signerAddress);
            let metas = [];

            for (var index in NFTs) {
                const nft = NFTs[index];
                const balance = await bookContract.balanceOf(libraryContract.address, nft.BlockchainID);

                if (balance > 0) {
                    const fetchUrl = ToipfsGateway(nft.metadata);
                    const response = await fetch(fetchUrl);

                    let json = await response.json();
                    json['BlockchainID'] = nft.BlockchainID;
                    json['copies'] = balance;
                    json['supply'] = nft.supply;

                    metas.push(json);
                }
            }

            setMetadata(metas);
            props.setLoading(false);
        }

        if (libraryContract && bookContract && signerAddress) {
            getNFTs();
        }

    }, [libraryContract, bookContract, signerAddress])


    function ToipfsGateway(string) {
        return string.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    return (
        <div>
            <div className="pagetitle">
                <h1>Library</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active">Library</li>
                    </ol>
                </nav>
            </div>
            <div className="container">
                <div className="row">
                    {metadata.map((element) => {
                        return (
                            <div className="col-sm" key={element.BlockchainID}>
                                <Card className="bookNFT">
                                    <Card.Img variant="top" src={ToipfsGateway(element.image)} />
                                    <Card.Body>
                                        <Card.Title>{element.name}</Card.Title>
                                        <Card.Text>
                                            {"ID: " + element.BlockchainID}
                                        </Card.Text>
                                        <Card.Text>
                                            {"Copies: " + element.copies + "/" + element.supply}
                                        </Card.Text>
                                        <Card.Text>
                                            {"Pages: " + element.pages}
                                        </Card.Text>
                                        <Card.Text>
                                            {"Authors: " + element.authors}
                                        </Card.Text>
                                        <Card.Text>
                                            {"Description: " + element.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default LibraryBooks;