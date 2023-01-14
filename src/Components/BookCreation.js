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

function BookCreation (props) {
    const {signerAddress, setSignerAddress} = useContext(BlockchainContext);
    const {libraryContract} = useContext(BlockchainContext);
    const {client} = useContext(BlockchainContext);

    const [title, setTitle] = useState("");
    const [authors, setAuthors] = useState("");
    const [pages, setPages] = useState("");
    const [description, setDescription] = useState("");
    const [copies, setCopies] = useState("");
    const [fileBuffer, setFileBuffer] = useState();

    const handleSubmitNFT = async () => {
        Swal.fire({
            title: 'Creating NFT...',
            showConfirmButton: false,
        })

        var metadata;

        try {
            const imageTitle = title.replace(" ", "") + ".jpg";

            metadata = await client.store({
                name: title,
                authors: authors,
                pages: pages,
                description: description,
                image: new File([fileBuffer], imageTitle, {type:"image/jpg"})
            });
            
            const mintNFT = await libraryContract.mintBook(metadata.url, copies).then((result) => {
                console.log(result);
                checkCreateBook(result.hash, metadata.url);
            }).catch((err) => {
                console.log(err);
            });
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    const checkCreateBook = async (hash, url) => {
        console.log("hello!");
        const blockNumber = await provider.getBlockNumber();

        let evtContract = new ethers.Contract(libraryContract.address, libraryContract.interface, provider);
        evtContract.on("BookCreated", (...args) => {
            const event = args[args.length - 1];
            if(event.transactionHash.localeCompare(hash) !== 0) return; // do not react to this event
            saveDB(event.args[0], event.args[1], event.args[2], url);
            evtContract.removeAllListeners();
        })
    }

    async function saveDB(args0, args1, args2, url) {
        const status = await Request.BookCreation(signerAddress, args0, args1, args2, url);
    }

    function ToipfsGateway(string){
        return string.replace("ipfs://", "https://ipfs.io/ipfs/"); 
    }

    return (
        <div style={{width: "75%", marginLeft: "12.5%"}}>
            <Form>
                <Form.Group className="mb-3" controlId="bookTitle">
                    <Form.Label>Title </Form.Label>
                    <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="bookAuthors">
                    <Form.Label>Authors </Form.Label>
                    <Form.Control type="text" placeholder="Enter authors" value={authors} onChange={(e) => setAuthors(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="bookPages">
                    <Form.Label>Pages </Form.Label>
                    <Form.Control type="number" placeholder="Enter number of pages" value={pages} onChange={(e) => setPages(e.target.value)} />
                </Form.Group>


                <Form.Group className="mb-3" controlId="bookCopies">
                    <Form.Label>Copies </Form.Label>
                    <Form.Control type="number" placeholder="Enter number of copies" value={copies} onChange={(e) => setCopies(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="bookDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" as='textarea' placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="bookFile">
                    <Form.Label>Image url</Form.Label>
                    <Form.Control type="file" placeholder="Enter file" onChange={(e) => setFileBuffer(e.target.files[0])} />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={ (e)=> {e.preventDefault(); handleSubmitNFT()} }>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default BookCreation;