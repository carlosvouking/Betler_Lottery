//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

error Lottery__InsufficientParticipationFees();

contract Lottery {
    /**State variable */
    // minimum participation
    uint256 private immutable i_participationFee;
    // participants
    address payable[] private s_participants; // every participant can recieve a payment

    /**Events */
    event LotteryEnter(address indexed player);

    // initializing items at contract deployment....
    constructor(uint256 participationFee) {
        i_participationFee = participationFee;
    }

    // enter Lottery
    function enterLottery() public payable {
        // minimum fee to enter lottery
        if (msg.value < i_participationFee) {
            revert Lottery__InsufficientParticipationFees(); // revert the whole transaction
        }
        s_participants.push(payable(msg.sender));
        // Emit Events... very useful when updating dynamic data structures:: mappings, arrays etc...
        emit LotteryEnter(msg.sender);
    }

    //function pickRandomWinner() public {}

    /** VIEW & | PURE functions */
    // read fee
    function getParticipationFee() public view returns (uint256) {
        return i_participationFee;
    }

    // read a specific participant
    function getParticipant(uint256 index) public view returns (address) {
        return s_participants[index];
    }
}
