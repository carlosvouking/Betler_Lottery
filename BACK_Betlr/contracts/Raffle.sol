/**
 * Goals:
 *    1- Participer à la lotterie - Enter
 *    2- Selectionner aléatoirement un gagnant (aléatoire vérifiable)  - Chainlink VRF
 *    3- Un gagnant selectionné toutes les 10 minutes (ceci est automatisé) - Chainlink keepers
 *    4- Note::  uttilisation de Chainlink Oracle pour Randomness et Automated execution (Keepers)
 */

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

error Raffle__InsufficientParticipationFee();

contract Raffle {
    // state variables
    uint256 private immutable i_participationFee;

    // participants...
    address payable[] private s_participants;

    // events
    event raffleEnter(address indexed participant);

    // initializinfgitems at contract deployment
    constructor(uint256 participationFee) {
        i_participationFee = participationFee;
    }

    // enter lottery
    function enterRaffle() public payable {
        // check min participation fee
        if (msg.value < i_participationFee) {
            revert Raffle__InsufficientParticipationFee();
        } else {
            s_participants.push(payable(msg.sender));
            emit raffleEnter(msg.sender);
        }
    }

    // read participationFee...handle by a button--> modal:: "do you have enough? Proceed then'
    function readParticipationFee() public view returns (uint256) {
        return i_participationFee;
    }

    // read a participant
    function readAParticipant(uint256 index) public view returns (address) {
        return s_participants[index];
    }
}
