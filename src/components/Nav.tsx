
//@ts-ignore
import React, { useState, useEffect } from "react";
//@ts-ignore
import { connect, disconnect } from "starknetkit";


export default function Nav() {

	const [address,setAddress] = useState("");

	useEffect(() => {
		const connectToStarknet = async () => {
			const connection = await connect({ modalMode: "neverAsk" });
			if (connection && connection.isConnected) {
				setAddress(connection.selectedAddress)
			}
		};
		connectToStarknet();
	}, []);

	const mainStyle = {
		display: 'flex',
		justifyContent: 'center',
	  };

	  const h1Style = {
		margin: '0px 400px ',
		padding: '10px',
	  };

	return (
		<div className="nav" style={mainStyle}>
			<h1 title="Starkcash" style={h1Style}>StarkCash</h1>	
			<h3 title="Starkcash" style={h1Style}>{address.substring(0, 10)}....</h3>
		</div>
	);
}
