import React, { useState } from "react";

interface WithdrawProps {
	isConnect: boolean;
	walletHandle: () => void;
}

interface Error {
	status: boolean;
	message: string;
}

export default function Withdraw({ isConnect, walletHandle }: WithdrawProps) {
	const [amount, setAmount] = useState<number>(0);
	const [error, setError] = useState<Error>({
		status: false,
		message: "",
	});

	const handleAmount = (value: number) => {
		setAmount(value);
	};

	const handleWithdraw = () => {
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
				<button onClick={handleWithdraw}>Deposit</button>
			)}
		</>
	);
}
