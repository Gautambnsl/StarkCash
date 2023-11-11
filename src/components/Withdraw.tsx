import React, { useState } from "react";
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
	CallData
  } from "starknet";

  import {withdraw} from "./middleware/Interaction_script";


interface WithdrawProps {
	isConnect: boolean;
	walletHandle: () => void;
	connection : any;
}

interface Error {
	status: boolean;
	message: string;
}

export default function Withdraw({ isConnect, walletHandle , connection}: WithdrawProps) {
	const [amount, setAmount] = useState<number>(0);
	const [error, setError] = useState<Error>({
		status: false,
		message: "",
	});

	const handleAmount = (value: number) => {
		setAmount(value);
	};

	const handleWithdraw = async () => {
		// handling user input
		if (amount <= 0) {
			let msg = "Enter valid amount!!";
			setError({ status: true, message: msg });

			return;
		}

		if (error.status) {
			setError({
				status: false,
				message: "",
			});
		}

		// write withdraw code

		await withdraw(amount,connection);


		// await connection.([
		// 	{
		// 		contractAddress: '0x04543643b54ea565e54d54edd7d9ff724150ada8e7bc5df8914ac2e3746f23dd',
		// 		entrypoint: 'withdraw',
		// 		calldata: CallData.compile({
		// 		amount: cairo.uint256(amount)	
		// 		})
		// 	}
		// ])

	};

	return (
		<>
			<div className="input">
				<label htmlFor="withdrawAmount">Amount:</label>

				<input
					type="number"
					value={amount}
					onChange={(e) => handleAmount(+e.target.value)}
					disabled={!isConnect}
					id="withdrawAmount"
					placeholder="amount..."
				/>

				{error.status && <p>{error.message}</p>}
			</div>

			{!isConnect ? (
				<button onClick={walletHandle}>Connect Wallet</button>
			) : (
				<button onClick={handleWithdraw}>withdraw</button>
			)}
		</>
	);
}
