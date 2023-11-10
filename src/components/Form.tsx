import React, { useState } from "react";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

export default function Form() {
	const [form, setForm] = useState<number>(1);
	const [isConnect, setIsConnect] = useState<boolean>(false);

	const handleFormChange = (val: number) => {
		setForm(val);
	};

	const walletStatusChange = (value: boolean) => {
		setIsConnect(value);
	};

	const walletHandle = () => {
		// call wallet status change

		walletStatusChange(true);
	};

	return (
		<div className="main">
			<div className="form">
				<div className="form-head">
					<h2
						onClick={() => handleFormChange(1)}
						className={`${form === 1 ? "active" : ""}`}
					>
						Deposit
					</h2>

					<h2
						onClick={() => handleFormChange(2)}
						className={`${form === 2 ? "active" : ""}`}
					>
						Withdraw
					</h2>
				</div>
				<div className="form-main">
					{form === 1 ? (
						<Deposit
							isConnect={isConnect}
							walletHandle={walletHandle}
						/>
					) : (
						<Withdraw
							isConnect={isConnect}
							walletHandle={walletHandle}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
