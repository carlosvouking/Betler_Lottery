//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

error RRaffle__InsufficientEntranceFee();

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract RRaffle is VRFConsumerBaseV2 {
    /** State variable */
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    /**Events */
    event LotteryEnter(address indexed player);

    constructor(address vrfCoordinator, uint256 entranceFee) VRFConsumerBaseV2(vrfCoordinator)  {
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

    function getHappyWinner() external {}

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {}

    /** Views & pure functions */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getAPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
