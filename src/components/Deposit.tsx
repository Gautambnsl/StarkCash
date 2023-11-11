import React, { useState } from "react";
//@ts-ignore
import {
	Provider,
	Account,
	Contract,
	json,
	hash,
	Calldata,
	num,
	RawCalldata,
	RawArgsObject,
	cairo,
	uint256,
	constants,
	RawArgsArray,
  } from "starknet";
import { hash_message,} from "./middleware/Interaction_script";
import { CallData } from "starknet";


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


		
		await connection.execute([
			{
				contractAddress: '0x6f35fd49cbe952041fa6d4dc6bbcd1a42484a40aae37e52a740959fa6fa639d',
				entrypoint: 'approve',
				calldata: CallData.compile({
				recipient : "0x04543643b54ea565e54d54edd7d9ff724150ada8e7bc5df8914ac2e3746f23dd",
				amount: cairo.uint256(amount)	
				}),
			}, 
			{
				contractAddress: '0x04543643b54ea565e54d54edd7d9ff724150ada8e7bc5df8914ac2e3746f23dd',
				entrypoint: 'deposit',
				calldata: CallData.compile({
				amount: cairo.uint256(amount)	,
				hash : hash,
				
				}),
			}
		])

		// await approve(userInput.address, userInput.amount,connection );
		// await deposit(userInput.amount,userInput.address,connection );
		
	};

	return (
		<>
			<div className="input">
				<label htmlFor="address">Address:</label>

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
