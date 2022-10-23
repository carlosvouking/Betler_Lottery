/** CONTRACT MAIN GOALS */
// 1- Allow anyone to enter the lottery by paying a certain amount in ETH
// 2- Select / Pick a random winner manually - Admin control
// 3- Select / Pick a random winner manually - randomly verfiable
// 4- Allow winner to be picked every (... minutes) randomly
// 5- Using Chainlink Oracle tools for randomness (VRF) and Automation (Automation / Keepers)

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

error Lottery__InsufficientParticipationFees();
error Lottery__TrasnferFundsToWinnerFailed();
error Lottery__LotteryNotOpen();
error Lottery__CheckUpkeepFailed(
    uint256 currentLotteryState,
    uint256 numberParticipants,
    uint256 currentBalance
);

/** @title Basic lottery contract
 * @author Carlos Vouking guided by Patrick Collins
 * @notice basic contract for a decentralized truly fair lottery
 * @dev made possible with chainlink vrf V2 subscription version and chainlink automation - keepers
 */
contract Lottery is VRFConsumerBaseV2, AutomationCompatibleInterface {
    /** DECLARING TYPES */
    enum LotteryState {
        OPEN, // 0
        PROCESSING, // 1
        CLOSE //2
    }

    /** STATE VARIABLES */
    // minimum participation
    uint256 private immutable i_participationFee;
    // participants
    address payable[] private s_participants; // every participant can recieve a payment
    // coordinator interface..
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId; // storing subscriptionID in storage
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    // Raffle related state variables
    address private s_recentRandomWinner; // voorlopig empty = no random winner momenteel
    LotteryState private s_lotteryState;
    uint256 private s_previousTimeStamp;
    uint256 private immutable i_interval; // how long is sec we want to wait between lottery runs...

    /**EVENTS */
    event LotteryEnter(address indexed player);
    event RequestedLotteryWinner(uint256 indexed requestId);
    event randomWinnerPicked(address indexed winnerPicked);

    /** FUNCTIONS */

    // initializing items at contract deployment....vrfCoordinatorV2= address consumer contract from Remix to the subscription
    constructor(
        address vrfCoordinatorV2, // contract...will be deployed as a Mock
        uint256 participationFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    )
        VRFConsumerBaseV2(vrfCoordinatorV2) // Interface + Address => Consumer contract to interact with.
        AutomationCompatibleInterface()
    {
        i_participationFee = participationFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2); // Interface + Address => Coordinator contract to interact with
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_lotteryState = LotteryState.OPEN; // open the lottery at contract deployment
        s_previousTimeStamp = block.timestamp; // vlue saved in storage as soon contract loads.
        i_interval = interval;
    }

    // enter Lottery
    function enterLottery() public payable {
        // minimum fee to enter lottery
        if (msg.value < i_participationFee) {
            revert Lottery__InsufficientParticipationFees(); // revert the whole transaction
        }
        // enter the lottery only if it's opened
        if (s_lotteryState != LotteryState.OPEN) {
            revert Lottery__LotteryNotOpen();
        }
        s_participants.push(payable(msg.sender));
        // Emit Events... very useful when updating dynamic data structures:: mappings, arrays etc...
        emit LotteryEnter(msg.sender);
    }

    //... computed from VRFCoordinatorV2Interface.sol
    function requestRandomWinner() external {
        // Random winner is being processed...
        s_lotteryState = LotteryState.PROCESSING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, // or gasLane in wei, max gas price to pay for a random request
            i_subscriptionId, // ID of the subscription used to fund the VRFConsumerBaseV2(vrfCoordinatorV2) contract
            REQUEST_CONFIRMATIONS, // how many blocks to wait before recieving the random number response
            i_callbackGasLimit, // max gas limit for the computation of fulfillRandomWords() function
            NUM_WORDS // nber of random number we want per request
        );
        emit RequestedLotteryWinner(requestId);
    }

    // computed from VRFConsumerBaseV2.sol
    function fulfillRandomWords(
        uint256, /*requestId*/
        uint256[] memory randomWords
    ) internal override {
        /*
           % modulo scenario to get the random winner: 
            // s_players = [56, 789, 402, 78, 3254, 202, 91, 6587, 81, 65]
            // random number to be picked: 402
            // to goal of the modulo is to find the index of the random nmber to be picked
            randomWords[0] % s_players.length = indexRandomNumber
                 402       %        10        =       2
        */
        uint256 indexOfRandomWinner = randomWords[0] % s_participants.length;
        address payable recentRandomWinner = s_participants[indexOfRandomWinner]; // this is our very verifiably random winner.
        s_recentRandomWinner = recentRandomWinner;

        // re-open the Lottery after picking a winner
        s_lotteryState = LotteryState.OPEN;

        // reset the participants list to zero
        s_participants = new address payable[](0);

        // reset previous timestamp evert time a winner is picked to allow participation in a new interval
        s_previousTimeStamp = block.timestamp;

        // transfer the money to the winner
        bool success;
        if (!success) {
            revert Lottery__TrasnferFundsToWinnerFailed();
        } else {
            (success, ) = recentRandomWinner.call{value: address(this).balance}("");
        }
        // write every random winner to the event log, so that we can query them previous winners at any time
        emit randomWinnerPicked(recentRandomWinner);
    }

    /**
     *  @dev cette function est invokée par le node chainlink. should normally UpkeepNeeded return 'true'
     * Les conditions suivantes doivent être vraies pour que 'UpkeepNeeded' == true
     * 1rst condition:: L'interval de temps devra être écoulé
     * 2nd condition::  Il faudrait au moins un participant enregistré dans la lotterie
     * 3rd condition::  la souscription Chainlink doit avoir assez de LINK
     * 4th condition::  La lotterie doit être encore en ouverte....Techniquement don't allow any new player to enter
                        the lottery when waiting for the ranom winner.

        // checkData parameter can be very useful in making many advance things...                
     */
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        // isLoterryOpen is true if the state is on OPEN state otherwise isLotteryOpen is false.
        bool isLotteryOpen = (LotteryState.OPEN == s_lotteryState);
        // check time interval between the previous block and the curent block timestamp...is true is enough time has passed
        bool elapsedTime = (i_interval < (block.timestamp - s_previousTimeStamp));
        // check at least 1 participant exists
        bool hasParticipant_s = (s_participants.length > 0);
        // check balance in LINK
        bool hasBalanceInLink = address(this).balance > 0;
        // returning UpkeepNeeded is all of above conditions are true..it's time to request a new random number and to close the lottery
        upkeepNeeded = (isLotteryOpen && elapsedTime && hasParticipant_s && hasBalanceInLink);
        //return (upkeepNeeded, "0x0");
    }

    /**
     *  @dev this function calls the 'checkUpKeep()' and excecutes if upKeepNeeded is true.
     * returns an error is lottery is not open || if there are zero participants || if the subscription is empty.
     */
    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        // upkeepNeeded should be 'true' to proceed..need to call 'checkUpkeep' to get the value of 'upKeepNeeded'
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Lottery__CheckUpkeepFailed(
                uint256(s_lotteryState),
                s_participants.length,
                address(this).balance
            );
        } else {
            /* execute requestRandomWinner()  */
            // Random winner is being processed...
            s_lotteryState = LotteryState.PROCESSING;
            uint256 requestId = i_vrfCoordinator.requestRandomWords(
                i_gasLane, // or gasLane in wei, max gas price to pay for a random request
                i_subscriptionId, // ID of the subscription used to fund the VRFConsumerBaseV2(vrfCoordinatorV2) contract
                REQUEST_CONFIRMATIONS, // how many blocks to wait before recieving the random number response
                i_callbackGasLimit, // max gas limit for the computation of fulfillRandomWords() function
                NUM_WORDS // nber of random number we want per request
            );
            emit RequestedLotteryWinner(requestId);
        }
    }

    /** VIEW & | PURE functions */
    // read fee to enter the lottery
    function getParticipationFee() public view returns (uint256) {
        return i_participationFee;
    }

    // read a specific participant
    function getParticipant(uint256 index) public view returns (address) {
        return s_participants[index];
    }

    // read the recent random winner
    function getRecentRandomWinner() public view returns (address) {
        return s_recentRandomWinner;
    }

    // state of the lottery
    function getLotteryState() public view returns (LotteryState) {
        return s_lotteryState;
    }

    // get the number of words recieved...NUM_WORDS is read from bytecode. It is not in storage.
    function getNumberOfWords() public pure returns (uint256) {
        return NUM_WORDS; // return 1
    }

    // get number of participants
    function getNumberOfParticipants() public view returns (uint256) {
        return s_participants.length;
    }

    // participants' list
    function getParticipants() public view returns (address payable[] memory) {
        return s_participants;
    }

    // current latest timestamp
    function getLatesttimeStamp() public view returns (uint256) {
        return s_previousTimeStamp;
    }

    // request confirmations - nber of blocks confirmations -- reading from bytecode
    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS; // return 3
    }
}
