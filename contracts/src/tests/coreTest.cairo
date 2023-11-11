use starknet::{contract_address_const, ContractAddress, EthAddress, ContractAddressIntoFelt252};

#[starknet::interface]
trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256);
    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    );
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
}
#[starknet::interface]
trait ICore<TContractState> {
    fn initialize(ref self: TContractState, token_address: ContractAddress);
    fn deposit(ref self: TContractState, denomination: u256, message: felt252);
    fn withdraw(ref self: TContractState, denomination: u256, message: felt252) -> felt252;
    fn contract_balance(self: @TContractState) -> u256;
}

#[cfg(test)]
mod coreTest {
    use starkcash::core_starkcash::core;
    // use core::debug::PrintTrait;
    use starkcash::mock::ERC20::ERC20;
    use starkcash::mock::ERC20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::{ICoreDispatcher, ICoreDispatcherTrait};
    use debug::PrintTrait;
    use option::OptionTrait;
    use traits::TryInto;
    use clone::Clone;
    use array::ArrayTrait;
    use array::SpanTrait;
    use traits::Into;
    use test::test_utils::{assert_eq, assert_ne};
    use result::ResultTrait;
    use integer::BoundedInt;
    use serde::Serde;
    use starknet::syscalls::deploy_syscall;
    use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash, class_hash_const};
    use starknet::{contract_address_const, ContractAddress, EthAddress, ContractAddressIntoFelt252};


    fn deploy_core() -> ContractAddress {
        // Set the constructor calldata.
        let mut calldata: Array<felt252> = ArrayTrait::new();

        // Deploy the contract.
        let (core_address, _) = deploy_syscall(
            core::TEST_CLASS_HASH.try_into().unwrap(), 0, calldata.span(), false
        )
            .unwrap();
        core_address
    }

    fn deploy_erc20(recipient: ContractAddress) -> ContractAddress {
        // Set the constructor calldata.
        let mut calldata: Array<felt252> = ArrayTrait::new();
        let mint_value: u256 = 10000_u256;
        let name: felt252 = 'Starkcash';
        let symbol: felt252 = 'SC';
        Serde::serialize(@name, ref calldata);
        Serde::serialize(@symbol, ref calldata);
        Serde::serialize(@mint_value, ref calldata);

        // Deploy the contract.
        let (core_address, _) = deploy_syscall(
            ERC20::TEST_CLASS_HASH.try_into().unwrap(), 0, calldata.span(), false
        )
            .unwrap();
        recipient
    }

    fn get_erc20(erc20_address: ContractAddress) -> IERC20Dispatcher {
        IERC20Dispatcher { contract_address: erc20_address }
    }

    fn get_core(core_address: ContractAddress) -> ICoreDispatcher {
        ICoreDispatcher { contract_address: core_address }
    }

    // fn deploy_and_get_erc20() -> ICoreDispatcher {
    //     // Set governor parameters.
    //     let owner_address = starknet::contract_address_const::<100>();
    //     starknet::testing::set_contract_address(owner_address);

    //     // Deploy the token bridge.
    //     let erc20_address = deploy_core();
    //     get_core(erc20_address)
    // }

    fn deploy_and_get_core() -> ICoreDispatcher {
        // Set governor parameters.
        let owner_address = starknet::contract_address_const::<100>();
        starknet::testing::set_contract_address(owner_address);

        // Deploy the token bridge.
        let core_address = deploy_core();
        get_core(core_address)
    }

    fn initialize_core() -> ICoreDispatcher {
        let owner_address = starknet::contract_address_const::<100>();
        starknet::testing::set_contract_address(owner_address);

        let core: ICoreDispatcher = deploy_and_get_core();
        let token_address: ContractAddress = deploy_erc20(owner_address);
        core.initialize(token_address);
        core
    }


    #[test]
    #[available_gas(100000000)]
    fn test_deposit_and_withdraw() {
        let owner_address = starknet::contract_address_const::<100>();
        starknet::testing::set_contract_address(owner_address);
        let core_dispatcher = initialize_core();
        let name: felt252 = 'hello';
        // core_dispatcher.deposit(10_u256, name);

        let value: u256 = core_dispatcher.contract_balance();
    // value.print();
    // core_dispatcher.withdraw(10_u256, 'hello');
    }
}
