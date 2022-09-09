//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

error Lottery__InsufficientEnterFees();

contract Lottery {
    // minimum participation
    uint256 private immutable i_enterFee;

    // participants
    address payable[] private s_participants; // every participant can recieve a payment

    // initializing items at contract deployment....
    constructor(uint256 enterFee) {
        i_enterFee = enterFee;
    }

    // enter Lottery
    function enterLottery() public payable {
        // minimum fee to enter lottery
        if (msg.value < i_enterFee) {
            revert Lottery__InsufficientEnterFees(); // revert the whole transaction
        }
        s_participants.push(payable(msg.sender));
    }

    // read fee
    function readEnterFee() public view returns (uint256) {
        return i_enterFee;
    }

    // read participants
    function readAParticipant(uint256 index) public view returns (address) {
        return s_participants[index];
    }
}
