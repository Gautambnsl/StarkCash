
# StarkCash💰 - A mixer protocol "Elevating Privacy, Empowering Transactions in the Decentralized Realm. This Project is made with ❤️ during Starknet Hacker House Istanbul 2023.

## Overview

StarkCash is a cutting-edge decentralized application (DApp) built on the StarkNet platform, designed to elevate the privacy and anonymity aspects of cryptocurrency transactions. The technical architecture comprises six crucial functions: deposit, withdraw, contract_balance, get_hash, hasher, and verifier.

## Key Functions

1. Deposit Function
   - *Objective:* Accepts denomination and message hash to facilitate secure deposits.
   - *Implementation:* Employs the hasher function, executing three layers of Pederson hashing on denomination and message hash.
   - *Process:* Manages a state variable to verify the existence of the message hash, subsequently transferring tokens to the contract and emitting a Deposit event with the deposited denomination.

2. Withdraw Function
   - *Objective:* Enables secure withdrawals based on denomination.
   - *Implementation:* Utilizes get_calleraddress to hash the withdrawer's address and calls the verifier function to confirm transaction validity.
   - *Outcome:* Emits a Withdraw event upon successful withdrawal, while unauthorized attempts trigger an error event.

3. Contract Balance Function
   - *Objective:* Monitors the account balances associated with respective transactions.

4. Hasher Function
   - *Objective:* Implements a robust three-layer Pederson hashing mechanism on denomination and message hash for enhanced security.

5. Verifier Function
   - *Objective:* Confirms the completion of a deposit by checking the pre-existence of the message hash.
   - *Outcome:* Returns true if the deposit is confirmed; otherwise, false.

## Smart Contract Implementation

The smart contract is coded in Cairo, leveraging the StarkNet platform. It incorporates a Storage struct managing critical storage components, events signaling deposit, withdrawal, and errors, and external functions for contract initialization, depositing, withdrawing, checking contract balances, and upgrading the contract.

## Events

StarkCash emits events capturing pivotal activities:
- Deposited: Signifies a triumphant deposit, including the deposited amount.
- Withdrawn: Indicates a successful withdrawal with details on the withdrawn amount.
- Error: Records error messages in the event of unauthorized actions.
- Initializable: Handles initialization events from the Initializable trait.


## Smart Contract Components

### Storage

The Storage struct meticulously manages:
- `initializable_storage`: Storage space dedicated to the Initializable trait.
- `denomination_message_hash`: LegacyMap preserving message hashes and their deposit status.
- `token_dispatcher`: An instance of the IERC20Dispatcher trait.

### Events

1. Deposited Event
   - Commemorates a prosperous deposit.
   - Contains detailed information about the deposited amount.

2. Withdrawn Event
   - Acknowledges a triumphant withdrawal.
   - Provides specifics about the withdrawn amount.

3. Error Event
   - Captures and communicates error messages.
   - Includes the error message for thorough debugging.

### Initializable Component

Handles the initialization process by incorporating events from the Initializable trait.

### External Functions

1. Initialize Function
   - Commences the contract with a specified token address for seamless integration.

2. Deposit Function
   - Facilitates depositing processes, implementing Pederson hashing and updating deposit status.
   - Triggers a Deposited event upon a successful deposit.

3. Withdraw Function
   - Supervises withdrawals, confirming transactions and updating deposit status.
   - Initiates a Withdrawn event upon successful completion or an Error event in case of unauthorized attempts.

4. Contract Balance Function
   - Retrieves and provides real-time information on the contract's token balance.

5. Get Hash Function
   - Implements Pederson hashing on a given message for secure processing.

6. Upgrade Function
   - Facilitates the seamless transition of the contract to a new class hash for continuous improvement.

## Usage

StarkCash introduces a robust and private environment for executing cryptocurrency transactions on the StarkNet platform. Developers can leverage the provided functions to enable decentralized and confidential financial interactions, ensuring both security and privacy in a decentralized financial ecosystem.

## Run the project locally
1. Clone the repository
2. Do a quick `npm i`
3. Do `npm run dev`
### Voilaaaa! You are ready✨.
