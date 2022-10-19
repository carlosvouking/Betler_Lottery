//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Lottery__InsufficientParticipationFees();

contract Lottery is VRFConsumerBaseV2 {
    /**State variable */
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

    /**Events */
    event LotteryEnter(address indexed player);
    event RequestedLotteryWinner(uint256 indexed requestId);

    // initializing items at contract deployment....vrfCoordinatorV2= address consumer contract from Remix to the subscription
    constructor(
        address vrfCoordinatorV2,
        uint256 participationFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    )
        VRFConsumerBaseV2(vrfCoordinatorV2) // Interface + Address => Consumer contract to interact with.
    {
        i_participationFee = participationFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2); // Interface + Address => Coordinator contract to interact with
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
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

    //... computed from VRFCoordinatorV2Interface.sol
    function requestRandomWinner() external {
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
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {}

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
