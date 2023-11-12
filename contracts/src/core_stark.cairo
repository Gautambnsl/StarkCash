// //Starkcash
// use starknet::ContractAddress;
// use starknet::class_hash::{ClassHash};

// #[starknet::interface]
// trait IERC20<TContractState> {
//     fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256);
//     fn transfer_from(
//         ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
//     );
//     fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
// }
// #[starknet::interface]
// trait ICore<TContractState> {
//     fn initialize(ref self: TContractState, token_address: ContractAddress) -> ContractAddress;
//     fn deposit(ref self: TContractState, denomination: u256, message: felt252);
//     fn withdraw(ref self: TContractState, denomination: u256) -> felt252;
//     fn contract_balance(self: @TContractState) -> u256;
//     fn upgrade(ref self: TContractState, new_class_hash: ClassHash);
//     fn get_hash(self: @TContractState, message: felt252) -> felt252;
// }

// #[starknet::contract]
// mod core {
//     use starkcash::libraries::initializable::Initializable::InternalTrait;
//     use starkcash::core_starkcash::ICore;
//     use core::starknet::event::EventEmitter;
//     use core::option::OptionTrait;
//     use core::traits::Into;
//     use starknet::ContractAddress;
//     use starknet::class_hash::{ClassHash};
//     use super::{IERC20Dispatcher, IERC20DispatcherTrait};
//     use starknet::{get_caller_address, get_contract_address};
//     use starknet::syscalls::replace_class_syscall;

//     #[storage]
//     struct Storage {
//         #[substorage(v0)]
//         initializable_storage: starkcash::libraries::initializable::Initializable::Storage,
//         denomination_message_hash: LegacyMap<felt252, bool>,
//         token_dispatcher: IERC20Dispatcher,
//     }

//     #[event]
//     #[derive(Drop, starknet::Event)]
//     enum Event {
//         Deposited: Deposited,
//         Withdrawn: Withdrawn,
//         Error: Error,
//         #[flat]
//         Initializable: starkcash::libraries::initializable::Initializable::Event,
//     }

//     #[derive(Drop, starknet::Event)]
//     struct Deposited {
//         amount: u256,
//     }

//     #[derive(Drop, starknet::Event)]
//     struct Withdrawn {
//         amount: u256,
//     }

//     #[derive(Drop, starknet::Event)]
//     struct Error {
//         message: felt252,
//     }

//     component!(
//         path: starkcash::libraries::initializable::Initializable,
//         storage: initializable_storage,
//         event: Initializable
//     );

//     #[external(v0)]
//     impl coreContract of super::ICore<ContractState> {
//         fn initialize(ref self: ContractState, token_address: ContractAddress) -> ContractAddress {
//             self.initializable_storage.initialize();
//             self.token_dispatcher.write(IERC20Dispatcher { contract_address: token_address });
//             token_address
//         }

//         fn deposit(ref self: ContractState, denomination: u256, message: felt252) {
//             let caller = get_caller_address();
//             let this_contract = get_contract_address();
//             let token = self.token_dispatcher.read();
//             let message_hash = Private::hasher(ref self, denomination, message);
//             let existing_messagehash: bool = self.denomination_message_hash.read(message_hash);
//             assert(existing_messagehash == false, 'Use different message');
//             let expected_path = Private::hasher(ref self, denomination, message);
//         self.generate_storage_proof(expected_path);
//             self.denomination_message_hash.write(message_hash, true);
//             token.transfer_from(caller, this_contract, denomination);
//             self.emit(Deposited { amount: denomination });
//         }

//         fn withdraw(ref self: ContractState, denomination: u256) -> felt252 {
//             let caller = get_caller_address();
//             let message = pedersen::pedersen('hashing_fn', caller.into());
//             let message_hash = Private::hasher(ref self, denomination, message);
//             let res: bool = Private::verifier(@self, message_hash);
//             let token = self.token_dispatcher.read();
//             if (res) {
//                 self.denomination_message_hash.write(message_hash, false);
//                 token.transfer(caller, denomination);
//                 self.emit(Withdrawn { amount: denomination });
//                 'validated'
//             } else {
//                 self.emit(Error { message: 'Not authorized' });
//                 'Not authorized'
//             }
//         }

//         fn contract_balance(self: @ContractState) -> u256 {
//             let this = get_contract_address();
//             let token = self.token_dispatcher.read();
//             let res = token.balance_of(this);
//             res
//         }
//         fn get_hash(self: @ContractState, message: felt252) -> felt252 {
//             pedersen::pedersen('hashing_fn', message)
//         }

//         fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
//             replace_class_syscall(new_class_hash).unwrap();
//         }

//         fn generate_storage_proof(
//             self: @ContractState, expected_path: felt252,
//         ) -> Array<TrieNode> {
//             self.storage_proof = self.merkle_tree.compute_proof(expected_path);
//             self.storage_proof.clone()
//         }
//         fn verify_storage_proof(
//             self: @ContractState,
//             expected_state_commitment: felt252,
//             contract_address: felt252,
//             storage_address: felt252,
//             proof: ContractStateProof,
//         ) -> felt252 {
//             verify(expected_state_commitment, contract_address, storage_address, proof,)
//         }
//     }

//     #[generate_trait]
//     impl Private of PrivateTrait {
//         fn hasher(ref self: ContractState, denomination: u256, message: felt252,) -> felt252 {
//             let mut res = pedersen::pedersen(13, message);
//             res = pedersen::pedersen('hashing_fn', message);
//             res = pedersen::pedersen(denomination.try_into().unwrap(), message);

//             res
//         }

//         fn verifier(self: @ContractState, message_hash: felt252) -> bool {
//             let message_hashed: bool = self.denomination_message_hash.read(message_hash);

//             if (message_hashed) {
//                 true
//             } else {
//                 false
//             }
//         }
//         fn generate_storage_proof(
//             self: @ContractState, expected_path: felt252,
//         ) -> Array<TrieNode> {
//             self.storage_proof = self.merkle_tree.compute_proof(expected_path);
//             self.storage_proof.clone()
//         }
//         fn verify_storage_proof(
//             self: @ContractState,
//             expected_state_commitment: felt252,
//             contract_address: felt252,
//             storage_address: felt252,
//             proof: ContractStateProof,
//         ) -> felt252 {
//             verify(expected_state_commitment, contract_address, storage_address, proof,)
//         }
//     }
// }


