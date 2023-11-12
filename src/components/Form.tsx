import React, { useState, useEffect } from "react";
import { connect, disconnect } from "starknetkit";
// @ts-ignore


import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

export default function Form() {
	const [form, setForm] = useState<number>(1);
	const [isConnect, setIsConnect] = useState<boolean>(false);

	
	const [provider, setProvider] = useState();
	const [address, setAddress] = useState();
	const [connection, setConnection] = useState();
	
	console.log(provider, "provider");
	console.log(address, "address");
	console.log(connection, "connection");

	
	const handleFormChange = async (val: number) => {
		setForm(val);
	};


	const walletStatusChange = (value: boolean) => {
		setIsConnect(value);
	};

	const walletHandle = async () => {
		const connection = await connect();
		if (connection && connection.isConnected) {
			setConnection(connection);
			setProvider(connection.account);
			setAddress(connection.selectedAddress);
			walletStatusChange(true);
		}
	};

	useEffect(() => {
		const connectToStarknet = async () => {
			const connection = await connect({ modalMode: "neverAsk" });
			if (connection && connection.isConnected) {
				setConnection(connection);
				setProvider(connection.account);
				setAddress(connection.selectedAddress);
				walletStatusChange(true);
			}
		};
		connectToStarknet();
	}, []);


	const mainStyle = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
	  };
	
	  const formStyle = {
		width: '100%',
		maxWidth: '600px',
		margin: 'auto',
		boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
		padding: '20px',
		boxSizing: 'border-box',
	};

	return (
		<>
		<div>
		<div className="main" style={mainStyle}>
			<div className="form" style={formStyle}>
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
						<Deposit isConnect={isConnect} walletHandle={walletHandle} connection={provider}/>
					) : (
						<Withdraw isConnect={isConnect} walletHandle={walletHandle} connection={provider}/>
						)}
				</div>
			</div>
		</div>

		</div>
						</>
	);
}
