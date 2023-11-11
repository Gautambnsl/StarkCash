#[starknet::component]
mod Initializable {
    #[storage]
    struct Storage {
        Initializable_initialized: bool
    }

    mod Errors {
        const INITIALIZED: felt252 = 'Initializable: is initialized';
    }

    #[generate_trait]
    impl InternalImpl<
        TContractState, impl X: HasComponent<TContractState>
    > of InternalTrait<TContractState, X> {
        fn is_initialized(self: @ComponentState<TContractState>) -> bool {
            self.Initializable_initialized.read()
        }

        fn initialize(ref self: ComponentState<TContractState>) {
            assert(!self.is_initialized(), Errors::INITIALIZED);
            self.Initializable_initialized.write(true);
        }
    }
}
