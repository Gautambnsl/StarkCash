import {
	Provider,
	Account,
	Contract,
	CallData,
	cairo,
	constants,
} from "starknet";

import compiledSierra_core from "./starkcash_core.contract_class.json";
import compiledSierra_erc20 from "./starkcash_ERC20.contract_class.json";

// const provider = new Provider({
// 	sequencer: { network: constants.NetworkName.SN_GOERLI },
// });

// const privateKey =
// 	"0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b";
// const accountAddress =
// 	"0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";

// const account0 = new Account(provider, accountAddress, privateKey, "0");

// console.log(
// 	":white_check_mark: Predeployed account connected\nOZ_ACCOUNT_ADDRESS=",
// 	account0.address
// );

// console.log("OZ_ACCOUNT_PRIVATE_KEY=", privateKey);

const erc20_address =
	"0x6d509e11c9f2675ad01e6ed7b07a564ac1412b5ad218697c0b8e0ce6264cb6a";
const core_address =
	"0x056839737baa24d9a9648bde92e3f6b97f777327e12bd0afb4ed0b4478093509";

async function getCoreContractInstance(value) {
	const myCoreContract = new Contract(
		compiledSierra_core.abi,
		core_address,
		value
	);
  myCoreContract.connect(value);
  return myCoreContract;
}

async function getERC20ContractInstance(value) {
	console.log(compiledSierra_erc20.abi)
	const myERC20Contract = new Contract(
		compiledSierra_erc20.abi,
		erc20_address,
		value
	);
   myERC20Contract.connect(value);
   console.log(myERC20Contract,"<<<<")
   return myERC20Contract;
}

export async function balanceOf(spender, value) {
	console.log("is it even working")
	console.log(spender)
	console.log(amount)
	console.log(value)

  let myerc20Contract = getERC20ContractInstance(value)
  console.log(myerc20Contract)
	const par = CallData.compile({
		account: spender,
		amount: cairo.uint256(100n),
	});
	const res = await myerc20Contract.increase_allowance(par, {
		parseRequest: true,
		parseResponse: false,
	});
	console.log(res, " Balance Tx : hash");
}


export async function approve(spender, amount, value) {
	console.log("is it even working")
	console.log(spender)
	console.log(amount)
	console.log(value)

  let myerc20Contract = getERC20ContractInstance(value)
	const par = CallData.compile({
		spender: spender,
		amount: cairo.uint256(amount),
	});
	const res = await myerc20Contract.approve(par, {
		parseRequest: true,
		parseResponse: false,
	});
	console.log(res, " Approve Tx : hash");
}

export async function deposit(denomination, message, value) {
	const par = CallData.compile({
		amount: cairo.uint256(denomination),
		message: message,
	});
	let res = await myCoreContract.deposit(par, {
		parseRequest: false,
		parseResponse: false,
	});
}

export async function hash_message(input, value) {
	const par = CallData.compile({
		message: input,
	});
	let myCoreContract = await getCoreContractInstance(value)
	let res = await myCoreContract.call("get_hash", par);
	console.log(res.toString());
}

export async function withdraw(denomination, value) {
	const par = CallData.compile({
		amount: cairo.uint256(denomination),
	});
	let res = await myCoreContract.withdraw(par, {
		parseRequest: false,
		parseResponse: false,
	});
}



