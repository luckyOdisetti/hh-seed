// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    uint public unlockTime;
    address payable public owner;
    bool private _lock;
    modifier noReEntry() {
        if (_lock == true) revert NoReEntry();
        _lock = true;
        _;
        _lock = false;
    }

    event Withdrawal(uint amount, uint when);
    error NoReEntry();

    constructor(uint _unlockTime) payable {
        require(block.timestamp < _unlockTime, "time should be in the future");

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }

    function _ethSignedMessage(
        bytes32 _messageHash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

    function _split(
        bytes memory _sig
    ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(_sig.length == 65, "Invalid Signature Length");
        assembly {
            r := mload(add(_sig, 32))
            s := mload(add(_sig, 64))
            v := byte(0, mload(add(_sig, 96)))
        }
    }
}
