import { useState, useEffect } from "react";



export function GetDonor() {

    const [donorCount, setDonorCount] = useState();
    const [donorIDs, setDonorIDs] = useState([]);
    const [Donors, setDonors] = useState([]);

    useEffect(() => {
        setDonors([]);
        viewDonors();
    }, [])

    window.Buffer = window.Buffer || require("buffer").Buffer;

    const Web3 = require('web3');
    const web3 = new Web3("HTTP://127.0.0.1:7545");

    const artifact = require("../contracts/DonorContract.json");

    const deployedContract = artifact.networks[5777];
    const contractAddress = deployedContract.address;

    let accounts = null;
    let contractInstance = null;

    const viewDonors = async () => {

        accounts = await web3.eth.getAccounts();
        contractInstance = new web3.eth.Contract(
            artifact.abi,
            contractAddress
        );
        console.log(contractInstance);
        const _donorCount = await contractInstance.methods.getCountOfDonors().call();
        setDonorCount(_donorCount)
        console.log(_donorCount);
        const _donorIDs = await contractInstance.methods.getAllDonorIDs().call();
        setDonorIDs(_donorIDs);
        console.log(_donorIDs);



        for (let i = 0; i < donorCount; i++) {
            await contractInstance.methods.getDonor(donorIDs[i]).call().then(function (result) {

                let Donor =
                    [{ Index: i + 1, "FullName": result[0], Age: result[1], Gender: result[2], "MedicalID": donorIDs[i], "BloodType": result[3], "Organ": result[4], "Weight": result[5], "Height": result[6] }];


                // if (i === 0) {
                //     setDonors([]);
                // }
                Donors.push(Donor)
                setDonors(Donors);

            });
        }
        console.log(Donors)
    }



    return (
        <div className="GetDonor">
            <h3 onClick={viewDonors}>.</h3>
            <table>
                <tr>
                    <th>Full Name</th>
                    <th>Age</th>
                    <th>Medical ID</th>
                    <th>Blood Type</th>
                    <th>Organ(s)</th>
                    <th>Weight(kg)</th>
                    <th>Height(cm)</th>
                </tr>
                {Donors.map((data) => (
                    <tr>
                        <td>{data[0].FullName}</td>
                        <td>{data[0].Age}</td>
                        <td>{data[0].MedicalID}</td>
                        <td>{data[0].BloodType}</td>
                        <td>{data[0].Organ}</td>
                        <td>{data[0].Weight}</td>
                        <td>{data[0].Height}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
}

export default GetDonor;
