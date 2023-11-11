import {
  Provider,
  Account,
  Contract,
  json,
  hash,
  Calldata,
  num,
  CallData,
  RawCalldata,
  RawArgsObject,
  cairo,
  uint256,
  constants,
  RawArgsArray,
} from "starknet";
import fs from "fs";

const provider = new Provider({
  sequencer: { network: constants.NetworkName.SN_GOERLI },
});
// initialize existing predeployed account 0 of Devnet
// const privateKey = "0xe3e70682c2094cac629f6fbed82c07cd";
// const accountAddress: string = "0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a";
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
// Declare & deploy Test contract in devnet
const compiledSierra_core = json.parse(
  fs
    .readFileSync("target/dev/starkcash_core.contract_class.json")
    .toString("ascii")
);
const compiledCasm_core = json.parse(
  fs
    .readFileSync("target/dev/starkcash_core.compiled_contract_class.json")
    .toString("ascii")
);

const compiledSierra_erc20 = json.parse(
  fs
    .readFileSync("target/dev/starkcash_core.contract_class.json")
    .toString("ascii")
);

const compiledCasm_erc20 = json.parse(
  fs
    .readFileSync("target/dev/starkcash_ERC20.compiled_contract_class.json")
    .toString("ascii")
);

const erc20_address =
  "0x6f35fd49cbe952041fa6d4dc6bbcd1a42484a40aae37e52a740959fa6fa639d";
const core_address =
  "0x056839737baa24d9a9648bde92e3f6b97f777327e12bd0afb4ed0b4478093509";

const myCoreContract = new Contract(
  compiledSierra_core.abi,
  core_address,
  provider
);

const myerc20Contract = new Contract(
  compiledSierra_erc20.abi,
  erc20_address,
  provider
);

console.log(
  ":white_check_mark: Test Contract connected at =",
  myCoreContract.address
);

console.log(
  ":white_check_mark: Test Contract connected at =",
  myerc20Contract.address
);

async function approve(spender: string, amount: any) {
  const par = CallData.compile({
    spender: spender,
    amount: cairo.uint256(amount),
  });

  let res = myerc20Contract.invoke("approve", par);
  //   let res = await myerc20Contract.approve(par, {
  //     parseRequest: false,
  //     parseResponse: false,
  //   });

  console.log(res, " Approve Tx : hash");
}

async function deposit(denomination: any, message: any) {
  const par = CallData.compile({
    message: message,
    amount: cairo.uint256(denomination),
  });

  let res = await myCoreContract.deposit(par, {
    parseRequest: false,
    parseResponse: false,
  });
}

async function hash_message(input: string) {
  const par = CallData.compile({
    message: input,
  });

  let res = await myCoreContract.call("get_hash", par);
  console.log(res.toString());
}

async function withdraw(denomination: any) {
  const par = CallData.compile({
    amount: cairo.uint256(denomination),
  });

  let res = await myCoreContract.withdraw(par, {
    parseRequest: false,
    parseResponse: false,
  });
}

approve(
  "0x06f35fd49cbe952041fa6d4dc6bbcd1a42484a40aae37e52a740959fa6fa639d",
  "100"
);
// hash_message(
//   "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998"
// );
