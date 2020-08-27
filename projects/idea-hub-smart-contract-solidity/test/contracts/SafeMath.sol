pragma solidity >=0.6 <0.7;

/**
* @title Safe Math Operations library
*/
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }

    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }

    function sub(uint a, uint b, string memory message) internal pure returns (uint c) {
        require(b <= a, message);
        c = a - b;
    }

    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }

    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0, "division by zero");
        c = a / b;
    }
}