import Swal from "sweetalert2";
const api = process.env.REACT_APP_API;

export async function getBookNFTs(university) {
    const uni = {
        university: university
    };

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            navigation: {
                params: {}
            },
            pagination: {},
            payload: uni   
        })
    };

    const response = await fetch(api + "/getBooks", requestOptions)
    const data = await response.json();

    return data.NFTs;
}

export function getContractsOptions() {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            navigation: {
                params: {}
            },
            pagination: {},
            payload: {}   
        })
    };

    return requestOptions;
}

export async function BookCreation(university, recepient, newItemId, amount, url) {
    if(recepient == null )
        return 
    
    const metadata = {
        BlockchainID: newItemId.toString(),
        supply: amount.toString(),
        university: university,
        metadata: url
    }

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {}
            },
            pagination: {},
            payload: metadata
        })
    };

    try { 
        const DBresp = await fetch(api + "/uploadNFT", requestOptions);
        const data = await DBresp.json();

        if(data.status === 200){
            Swal.fire({
                icon: 'success',
                title: 'NFT succesfully created',
                showConfirmButton: false,
                timer: 1500
            })
        }

        return data.status;
    } catch(err) {
        console.log(err);
        Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500
        })
    }
}

export async function RegisterUniversity(name, signature, signerAddress) {
    const data = {
        name: name,
        signature: signature,
        address: signerAddress
    }

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {}
            },
            pagination: {},
            payload: data
        })
    };

    var response = await fetch(api + "/registerUniversity", requestOptions)
    response = await response.json();

    if(response.status == 200){
      Swal.fire({
        icon: 'success',
        title: 'UNI claimed successfully',
        showConfirmButton: false,
        timer: 1500
      })
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        showConfirmButton: false,
        timer: 1500
      })
    }

    return response.status;
}

export async function getPendingRequests(signerAddress) {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {
                    path: {
                        enrollmentRequest: {
                            type: "equal",
                            value: signerAddress
                        }
                    }
                }
            },
            pagination: {},
            payload: {}
        })
    };

    var response = await fetch(api + "/getPendingRequests", requestOptions);
    response = await response.json();

    return response.requests;
}

export async function UploadIdNFT(university, student, tokenId, metadata, name, surname) {
    if(university == null )
        return;

    //SAVE TO DB 
    const data = {
        BlockchainID: tokenId.toString(),
        student: student,
        name: name,
        surname: surname,
        university: university,
        metadata: metadata
    }

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {}
            },
            pagination: {},
            payload: data
        })
    };

    
    try{
        const DBresp = await fetch(api + "/uploadIdNFT", requestOptions);
        const data = await DBresp.json();

        if(data.status === 200){
            Swal.fire({
                icon: 'success',
                title: 'Student succesfully enrolled',
                showConfirmButton: false,
                timer: 1500
            })
        }

        return data.status;
    } catch(err) {
        console.log(err);
        Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500
        })
    }
}

export async function DeleteRequest(id) {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {
                    path: {
                        enrollmentRequest: {
                            type: "equal",
                            value: id
                        }
                    }
                }
            },
            pagination: {},
            payload: {}
        })
    };

    var response = await fetch(api + "/deleteRequest", requestOptions);

    response = await response.json();
    if(response.status === 200){
        console.log("request deleted");
    } else {
        console.log("error on deleting request");
    }

    return response.status;
}

export function getCheckEnrolledOptions(signer) {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {
                    path: {
                        university: {
                            type: "equal",
                            value: signer
                        }
                    }
                }
            },
            pagination: {},
            payload: {}
        })
    };

    return requestOptions;
}

export async function UploadExam(examId, name, cfu, university) {
    const data = {
        BlockchainID: examId.toString(),
        name: name,
        cfu: cfu.toString(),
        university: university
    }
    
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {}
            },
            pagination: {},
            payload: data
        })
    };

    var response = await fetch(api + "/uploadExam", requestOptions);
    response = await response.json();

    if(response.status === 200){
        Swal.fire({
            icon: 'success',
            title: 'Exam uploaded successfully!',
            showConfirmButton: false,
            timer: 1500
        })
        console.log("exam uploaded");
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Exam not uploaded',
            showConfirmButton: false,
            timer: 1500
        })
    }

    return response.status;
}


export async function ChangeActive(id, newStatus) {
    const data = {
        id: id,
        active: newStatus
    }

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {}
            },
            pagination: {},
            payload: data
        })
    };

    var response = await fetch(api + "/changeExamStatus", requestOptions);
    response = await response.json();

    if(response.status === 200){
        Swal.fire({
            icon: 'success',
            title: 'Status changed successfully!',
            showConfirmButton: false,
            timer: 1500
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Status not uploaded',
            showConfirmButton: false,
            timer: 1500
        })
    }

    return response.status;
}

export async function LoadExamsByUniversity(address) {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {
                    path: {
                        university: {
                            type: "equal",
                            value: address
                        }
                    }
                }
            },
            pagination: {},
            payload: {}
        })
    };

    const response = await fetch(api + "/loadExamsByUniversity", requestOptions);
    const json = await response.json();

    return json.exams;
}

export function getStudentEnrolled(id) {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {
                    path: {
                        exam: {
                            type: "equal",
                            value: id
                        }
                    }
                }
            },
            pagination: {},
            payload: {}
        })
    };

    return requestOptions;
}

export async function UploadVerbalization(examId, enrId, student, mark) {
    const data = {
        examId: examId,
        enrollmentId: enrId,
        student: student,
        mark: mark
    }

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {}
            },
            pagination: {}, 
            payload: data
        })
    };

    var response = await fetch(api + "/uploadVerbalization", requestOptions);
    response = await response.json();

    if(response.status === 200){
        Swal.fire({
            icon: 'success',
            title: 'Mark uploaded successfully!',
            showConfirmButton: false,
            timer: 1500
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Mark not uploaded!',
            showConfirmButton: false,
            timer: 1500
        })
    }

    return response.status;
}

export async function getExamById(id) {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {
                    path: {
                        exam: {
                            type: "equal",
                            value: id
                        }
                    }
                }
            },
            pagination: {},
            payload: {}
        })
    };

    var response = await fetch(api + "/getExamById", requestOptions);
    response = await response.json();

    return response.exam;
}

export async function getApprovedProposals(address) {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            navigation: {
                params: {
                    path: {
                        university: {
                            type: "equal",
                            value: address
                        }
                    }
                }
            },
            pagination: {},
            payload: {}
        })
    };

    var response = await fetch(api + "/getApprovedProposals", requestOptions);
    response = await response.json();

    if(response.proposals[0] === undefined) 
        return null;

    return response.proposals;
}
