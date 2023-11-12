//@ts-ignore
import React, { useState } from "react";
//@ts-ignore
import {
	//@ts-ignore
	Provider,
	//@ts-ignore
	Account,
	//@ts-ignore
	Contract,
	//@ts-ignore
	json,
	//@ts-ignore
	hash,
	//@ts-ignore
	Calldata,
	//@ts-ignore
	num,
	//@ts-ignore
	RawCalldata,
	//@ts-ignore
	RawArgsObject,
	cairo,
	//@ts-ignore
	uint256,
	//@ts-ignore
	constants,
	//@ts-ignore
	RawArgsArray,
  } from "starknet";
  //@ts-ignore
import { hash_message,} from "./middleware/Interaction_script";
import { CallData } from "starknet";

const erc20_address =
	"0x034ae182d6ab7d05d41139a1a09a58f1330ea3422019db88be11c94036ca9af5";
const core_address =
	"0x03552872f34714257764f9cede28ec22c10672bd5f1c2f4443c88f3326ca274d";


interface DepositProps {
	isConnect: boolean;
	connection : any;
	walletHandle: () => void;
}

interface UserInput {
	address: string;
	amount: number;
}

interface Error {
	status: boolean;
	address: string;
	amount: string;
}

export default function Deposit({ isConnect, walletHandle , connection}: DepositProps) {
	const [userInput, setUserInput] = useState<UserInput>({
		address: "",
		amount: 0,
	});

	const [error, setError] = useState<Error>({
		status: false,
		address: "",
		amount: "",
	});

	const handleChange = (key: string, value: string | number) => {
		setUserInput((prev) => ({ ...prev, [key]: value }));
	};

	const handleDeposit = async () => {
		// handle deposit;
		const { address, amount } = userInput;

		// handling errors
		if (address.length === 0) {
			let msg = "Enter valid address!!";
			setError({
				status: true,
				address: msg,
				amount: "",
			});
			return;
		}

		if (amount <= 0) {
			let msg = "Enter valid amount!!";
			setError({
				status: true,
				address: "",
				amount: msg,
			});
			return;
		}

		if (error.status) {
			// clearing error messages
			setError({
				status: false,
				address: "",
				amount: "",
			});
		}

		let hash = await hash_message(userInput.address, connection);


		
		let success = await connection.execute([
			{
				contractAddress: erc20_address,
				entrypoint: 'approve',
				calldata: CallData.compile({
				recipient : core_address,
				amount: cairo.uint256(amount)	
				}),
			}, 
			{
				contractAddress: core_address,
				entrypoint: 'deposit',
				calldata: CallData.compile({
				amount: cairo.uint256(amount)	,
				hash : hash,
				
				}),
			}
		])

		// await approve(userInput.address, userInput.amount,connection );
		// await deposit(userInput.amount,userInput.address,connection );
		console.log(success,"success")
		alert(`Transaction Success, Tx Hash : ${success.transaction_hash} `)
	};

	return (
		<>
			<div className="input">
				<label htmlFor="address">Withdrawer's Address:</label>

				<input
					type="text"
					value={userInput.address}
					onChange={(e) => handleChange("address", e.target.value)}
					disabled={!isConnect}
					id="address"
					placeholder="address..."
				/>

				{error.status && error.address && <p>{error.address}</p>}
			</div>

			<div className="input">
    <label htmlFor="token">Token: </label>
    <select
        value="Enter the Token"
        id="token"
    >
        <option value="eth">wETH</option>
        {/* Add more options as needed */}
    </select>
</div>

			

			<div className="input">
				<label htmlFor="amount">Amount:</label>

				<input
					type="number"
					value={userInput.amount}
					onChange={(e) => handleChange("amount", +e.target.value)}
					disabled={!isConnect}
					min={0}
					id="amount"
					placeholder="amount..."
				/>
				{error.status && error.amount && <p>{error.amount}</p>}
			</div>

			{!isConnect ? (
				<button onClick={walletHandle}>Connect Wallet</button>
			) : (
				<button onClick={handleDeposit}>Deposit</button>
			)}
		</>
	);
}
