import {
  Provider,
  Account,
  Contract,
  json,
  //@ts-ignore
  hash,
  //@ts-ignore
  Calldata,
  //@ts-ignore
  num,
  //@ts-ignore
  CallData,
  //@ts-ignore
  RawCalldata,
  //@ts-ignore
  RawArgsObject,
  //@ts-ignore
  cairo,
  //@ts-ignore
  uint256,
  constants,
  //@ts-ignore
  RawArgsArray,
} from "starknet";
//@ts-ignore
import fs from "fs";

const provider = new Provider({
  sequencer: { network: constants.NetworkName.SN_GOERLI },
});

const privateKey =
  "0x02f38fb567d5d50d375d6ec3c7f12b22c5eb436a3d16ddfde17eeef8e26eb93b";
const accountAddress =
  "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998";

const account0 = new Account(provider, accountAddress, privateKey, "0");

console.log(
  ":white_check_mark: Predeployed account connected\nOZ_ACCOUNT_ADDRESS=",
  account0.address
);

console.log("OZ_ACCOUNT_PRIVATE_KEY=", privateKey);

const compiledSierra_core = json.parse(
  fs
    .readFileSync("src/middleware/starkcash_core.contract_class.json")
    .toString("ascii")
);

const compiledSierra_erc20 = json.parse(
  fs
    .readFileSync("src/middleware/starkcash_ERC20.contract_class.json")
    .toString("ascii")
);

const erc20_address =
  "0x6f35fd49cbe952041fa6d4dc6bbcd1a42484a40aae37e52a740959fa6fa639d";
const core_address =
  "0x056839737baa24d9a9648bde92e3f6b97f777327e12bd0afb4ed0b4478093509";

const myCoreContract = new Contract(
  compiledSierra_core.abi,
  core_address,
  account0
);

const myerc20Contract = new Contract(
  compiledSierra_erc20.abi,
  erc20_address,
  account0
);

console.log(
  ":white_check_mark: Test Contract connected at =",
  myCoreContract.address
);

console.log(
  ":white_check_mark: Test Contract connected at =",
  myerc20Contract.address
);

myCoreContract.connect(account0);

console.log(myerc20Contract, "ERC20 Contract");
async function approve(spender: string, amount: any) {
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

  //@ts-ignore
async function deposit(denomination: string, message: any) {
  const par = CallData.compile({
    amount: cairo.uint256(denomination),
    message: message,
  });

    //@ts-ignore
  let res = await myCoreContract.deposit(par, {
    parseRequest: false,
    parseResponse: false,
  });
}

  //@ts-ignore
async function hash_message(input: string) {
  const par = CallData.compile({
    message: input,
  });

  let res = await myCoreContract.call("get_hash", par);
  console.log(res.toString());
}

// async function balance_of(input: string) {
//   const par = CallData.compile({
//     message: input,
//   });

//   let res = await myCoreContract.call("get_hash", par);
//   console.log(res.toString());
// }
  //@ts-ignore
async function withdraw(denomination: any) {
  const par = CallData.compile({
    amount: cairo.uint256(denomination),
  });

  //@ts-ignore
  let res = await myCoreContract.withdraw(par, {
    parseRequest: false,
    parseResponse: false,
  });
}

approve(
  "0x06f35fd49cbe952041fa6d4dc6bbcd1a42484a40aae37e52a740959fa6fa639d",
  "100"
);

// deposit(
//   "100",
//   "0x04fddf37e297a498cf55817ccfa8a82471117e2c8a4f0d176da56aa61a6be54e"
// );
// hash_message(
//   "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998"
// );
