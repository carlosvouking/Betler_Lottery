//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

error RRaffle__InsufficientEntranceFee();

contract RRaffle {
    /** State variable */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    /**Events */
    event LotteryEnter(address indexed player);

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        // we neeed entranceFee which should > fee provided by the player
        if (msg.value < i_entranceFee) {
            revert RRaffle__InsufficientEntranceFee();
        }
        // then we can enter the raffle....
        s_players.push(payable(msg.sender));
        emit LotteryEnter(msg.sender);
    }

    function getHappyWinner() public {}

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getAPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
