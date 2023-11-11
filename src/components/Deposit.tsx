import React, { useState } from "react";
//@ts-ignore
import {approve, balanceOf, hash_message} from "./middleware/Interaction_script";


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

		await approve(userInput.address, userInput.amount,connection );
		//  await hash_message(userInput.address, connection);
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
