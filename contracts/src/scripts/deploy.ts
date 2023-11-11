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
// import {accountTestnet4privateKey, accountTestnet4Address} from "../../A1priv/A1priv"
// import * as dotenv from "dotenv";
// import { ec } from "../signature";
// dotenv.config();

//          :point_down::point_down::point_down:
// :rotating_light::rotating_light::rotating_light:   Launch 'starknet-devnet --seed 0 --cairo-compiler-manifest /D/Cairo1-dev/cairo/Cargo.toml --compiler-args "--add-pythonic-hints "' before using this script.
//          :point_up_2::point_up_2::point_up_2:

async function main() {
  //initialize Provider
  // const provider = new Provider({
  //   sequencer: { baseUrl: "http://127.0.0.1:5050" },
  // });
  // console.log(":white_check_mark: Connected to devnet.");
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
  const compiledSierra = json.parse(
    fs
      .readFileSync("target/dev/starkcash_core.contract_class.json")
      .toString("ascii")
  );
  const compiledCasm = json.parse(
    fs
      .readFileSync("target/dev/starkcash_core.compiled_contract_class.json")
      .toString("ascii")
  );
  // const compiledSierra = json.parse(fs.readFileSync("/Users/akashneelesh/Desktop/Fix_CairoGateway/cairo-gateway-contracts/target/dev/router_gatewayContract.sierra.json").toString("ascii"));
  // const compiledCasm = json.parse(fs.readFileSync("/Users/akashneelesh/Desktop/Fix_CairoGateway/cairo-gateway-contracts/target/dev/router_gatewayContract.casm.json").toString("ascii"));

  // deployment start from here
  // ************
  // const deployResponse = await account0.declare({ contract: compiledSierra, casm: compiledCasm });
  // const contractClassHash = deployResponse.class_hash;
  // console.log(':white_check_mark: Test Contract declared with classHash =', contractClassHash);
  // // // const contractClassHash = 0x6ecc27b02cb561fc8518c2b4d2a065fec817f4bfbdf67929fcf582ca17fe8bb
  // await provider.waitForTransaction(deployResponse.transaction_hash);

  // const { transaction_hash: th2, address } = await account0.deployContract({ classHash: contractClassHash });
  // console.log("contract_address =", address);
  // await provider.waitForTransaction(th2);
  // ************
  // deployment ended from here

  const deployResponse = await account0.declare({
    contract: compiledSierra,
    casm: compiledCasm,
  });
  // const contractClassHash =
  //   "0xd66170151ccc1770b491f68999c2ffaa5855aaa8f0938e99542426f0b2051f";
  const contractClassHash = deployResponse.class_hash;
  // console.log("✅ Test Contract declared with classHash =", contractClassHash);
  // const contractClassHash =
  //   "0x26f8f8a089549ccb1508235914c388f10cb83f741f44e1f93accbbfa71006f";

  //   const contractCallData: CallData = new CallData(compiledSierra.abi);
  //   const contractConstructorCallData5: Calldata = contractCallData.compile(
  //     "constructor",
  //     [
  //       "ETH",
  //       "ETH",
  //       "18",
  //       1000000000000000000000,
  //       "0x03038ae29ffd0258880b34b9ffdd37a02bd1b7a7e15ff183c69a0a1c18d30998",
  //     ]
  //   );

  //0x1,0x2,0x3
  //split based on ,

  // const { transaction_hash: th2, address } = await account0.deployContract({ classHash: contractClassHash, constructorCalldata :contractConstructorCallData5});
  // console.log("contract_address =", address);

  // await provider.waitForTransaction(deployResponse.transaction_hash);

  const { transaction_hash: th2, address } = await account0.deployContract({
    classHash: contractClassHash,
    //   constructorCalldata: contractConstructorCallData5,
  });
  console.log("contract_address =", address);
  await provider.waitForTransaction(th2);

  // const address = '0x7ea88bba6237337b4c22ca9528c425b1c418a5fd62df4545863a4f0e860a8e2';
  // Connect the new contract instance :
  //0x5592c3a04f8832fe783243aa5fa7e9163e677710be156f6aedd43151362c712
  //   const address =
  //     "0x6f35fd49cbe952041fa6d4dc6bbcd1a42484a40aae37e52a740959fa6fa639d";
  if (address) {
    const myTestContract = new Contract(compiledSierra.abi, address, provider);
    console.log(
      ":white_check_mark: Test Contract connected at =",
      myTestContract.address
    );
    myTestContract.connect(account0);
    // const par1 = CallData.compile({
    //   spender:
    //     "0xb913f285d80a6b7510257ff65f1c8ecfb3979f266baa09186b485f69eba847",
    //   amount: cairo.uint256(1000000000000000000n),
    // });

    // const par2 = CallData.compile({
    //   spender:
    //     "0xb913f285d80a6b7510257ff65f1c8ecfb3979f266baa09186b485f69eba847",
    //   amount: cairo.uint256(1000000n),
    // });

    // let res1 = await myTestContract.approve(par1, {
    //   parseRequest: false,
    //   parseResponse: false,
    // });

    // let res2 = await myTestContract.transfer(par2);
    // // console.log(res1, " response");
    // console.log(res2, " response");

    console.log("Done");
    // type Tryit1 = {
    //     p1: RawCalldata,
    //     // p2: RawCalldata,
    //     p3: uint256.Uint256,
    // }
    // // const Powervalue : RawCalldata = [1293,1971]
    // const value: uint256.Uint256 = cairo.uint256(1n)
    // const p1value : RawCalldata = ['0x1db41bB97977430Dc24F94142ee7ad88f5c66e45','0x5F04693482cfC121FF244cB3c3733aF712F9df02']
    // // const p2value : RawCalldata = [123,568]
    // const p3value : uint256.Uint256 = cairo.uint256(12n)
    // const ITryit : Tryit1 = {
    //     p1 : p1value,
    //     // p2: p2value,
    //     p3: p3value,
    // }
    // struct Tryit1{
    //     members : Array<felt252>,
    //     // power : Span<u64>,
    //     valsetNonce : felt252,
    // }
    // fn increase_Value(ref self: TContractState,value: u256,valfromStruct : Tryit1) -> u256;

    // const amount: uint256.Uint256 = cairo.uint256(100n);
    // const packets = ['123']
    // const sigs = [amount,amount]
    // const relayerAddress = '0x00b7dc10a2c5dc61ac1067aec097754d5a3c9732fad3bda9226c53e7cc9fb821'

    // const RequestPayload = {
    //     routeAmount : amount,
    //     requestIdentifier: amount,
    //     requestTimestamp : amount,
    //     srcChainId : '1',
    //     routeRecipient : '0x00b7dc10a2c5dc61ac1067aec097754d5a3c9732fad3bda9226c53e7cc9fb821',
    //     destChainId : '1',
    //     asmAddress : '0x00b7dc10a2c5dc61ac1067aec097754d5a3c9732fad3bda9226c53e7cc9fb821',
    //     requestSender : '0x00000000',
    //     handlerAddress : '0x00b7dc10a2c5dc61ac1067aec097754d5a3c9732fad3bda9226c53e7cc9fb821',
    //     packet : packets,
    //     isReadCall : false,

    // };

    // const validators: RawCalldata = [0x01,0x02,0x03,0x14];
    // const _powers : RawCalldata = [9,9,9,9];
    // const myUint256_: uint256.Uint256 = cairo.uint256(1n);
    // const _currentValset = {
    //     validators : validators,
    //     powers : _powers,
    //     valsetNonce : myUint256_,
    // };
    // const myUint256: uint256.Uint256 = uint256.bnToUint256(10257415n);
    // const addresses : RawCalldata = [0x07ffa56580512657a1c66cda8939060e4cadd7b1c127d17fc966ffe60f81f911,0x07ffa56580512657a1c66cda8939060e4cadd7b1c127d17fc966ffe60f81f917,0x07ffa56580512657a1c66cda8939060e4cadd7b1c127d17fc966ffe60f81f912,0x07ffa56580512657a1c66cda8939060e4cadd7b1c127d17fc966ffe60f81f914];
    // const Array_u64 : RawCalldata = [1231,3221,4421];
    // const ContractAddress = '0x1db41bB97977430Dc24F94142ee7ad88f5c66e45'
    // const Array_u256 : RawCalldata = [100n,12n]
    // const Array_u2562 = [myUint256,myUint256]
    // const Array_felt252 = ['hel','j23']
    // const myInput = {
    //     v1 : myUint256,
    //     v2 : myUint256,
    //     v3 : addresses,
    //     v4 : Array_u64,
    //     v5 : ContractAddress,
    //     v6 : Array_u256,
    //     v7 : Array_felt252,
    // }
    // // const Array_u256 = [myUint256,myUint256]

    // const par1: RawArgsObject = {
    //     value : myUint256,
    //     valfromStruct : myInput
    // }
    // console.log(myInput, myInput,Array_u2562,_currentValset,RequestPayload,sigs,relayerAddress);
    // console.log("Now Simulating the callData");

    // // let res5 = await myTestContract.iReceive(_currentValset,sigs,RequestPayload,relayerAddress, {parseRequest: true, parseResponse: false,})
    // // console.log("Result : ",res5);

    // let res = await myTestContract.increase_Value(value, myInput,Array_u2562,_currentValset,RequestPayload,sigs,relayerAddress,  { parseRequest: true, parseResponse: false, })
    // console.log("The result is :", res)

    // const u3: uint256.Uint256 = cairo.uint256(5);
    // type ValsetArgs = {
    //   validators: num.BigNumberish[];
    //   powers: num.BigNumberish[];
    //   valsetNonce: uint256.Uint256;
    // };

    //   const mySetArgs: ValsetArgs = {
    //   validators: ["0x6B9fF2e0bf1ed3826fB109Fe1A1f43f616FA804e"],
    //   powers: [429496729],
    //   valsetNonce: u3,
    // };

    // const r2 : RawCalldata = ['0x8c94c694e7a6af5d7463dc339948c9ff9f00d8f29ac00ee529e37a304df3e558']
    // const s2 : RawCalldata = ['0xfd43dfb18a6dd4a9cecfbda2dbaf73eeeb1041a55cd6343bd972a0643bd5271f']
    // const v2 : RawCalldata = ['28']

    // const r4: uint256.Uint256 = cairo.uint256("0x4c8e4fbc1fbb1dece52185e532812c4f7a5f81cf3ee10044320a0d03b62d3e9a");
    // const s4 : uint256.Uint256 = cairo.uint256("0x4ac5e5c0c0e8a4871583cc131f35fb49c2b7f60e6a8b84965830658f08f7410c");
    // const msghash : uint256.Uint256 = cairo.uint256("0xe888fbb4cf9ae6254f19ba12e6d9af54788f195a6f509ca3e934f78d7a71dd85")
    // // const r3 : num.BigNumberish = "0x4c8e4fbc1fbb1dece52185e532812c4f7a5f81cf3ee10044320a0d03b62d3e9a"
    // // const s3  : num.BigNumberish = "0x4ac5e5c0c0e8a4871583cc131f35fb49c2b7f60e6a8b84965830658f08f7410c"

    // const eth_address: num.BigNumberish = "0x767410c1bb448978bd42b984d7de5970bcaf5c43"

    // // const msghash: num.BigNumberish = "0xe888fbb4cf9ae6254f19ba12e6d9af54788f195a6f509ca3e934f78d7a71dd85"
    // // const powerthreshold : num.BigNumberish = 4294967291
    //     const compiledObj = CallData.compile({
    // eth_address: eth_address,
    // _theHash :msghash,
    //   r: r4,
    //   s: s4,
    //   v: 28,

    // });

    // let res = await myTestContract.check_verify(compiledObj)
    // console.log("Result : ", res);

    // const r4: uint256.Uint256 = cairo.uint256(100n);
    // const eth_address: num.BigNumberish = "0xaC25b2B9F4ca06179fA0D2522F47Bc86A9DF9314"

    // const par1 = CallData.compile({
    //     // value1 : 'Akash',
    //     value1 : r4,
    //     // value3 : eth_address,
    // })

    // // let res = await myTestContract.check_pedersen(par1,{ parseRequest: false, parseResponse: true, })
    // // console.log("Result : ", res);

    // let res1 =  await myTestContract.read_value({ parseRequest: true, parseResponse: true, })
    // console.log("Result : ", res1);
  }
}

main();
