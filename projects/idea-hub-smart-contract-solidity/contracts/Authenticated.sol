pragma solidity >=0.4.22 <0.7.0;
/**
 * @title Authenticated Contract
 * @dev Contract feature to allow chosen address to call functions
*/
contract Authenticated {

    address payable public owner;
    mapping(address => bool) public authenticatedUsers;


    // events

    event OwnershipTransferred(address indexed _from, address indexed _to);
    event PermissionChanged(address indexed newUser, bool newStatus);

    function manualConstruct() public {
        require(owner == address(0x00), "Already Constructed");
        owner = msg.sender;
        authenticatedUsers[owner] = true;
        emit PermissionChanged(owner, true);
        emit OwnershipTransferred(address(0x00), owner);
    }

    // modifiers
    modifier onlyOwner {
        require(owner == msg.sender, "Only contract owner can do this");
        _;
    }

    modifier authenticated(address user) {
        require(authenticatedUsers[user], "Insufficient Permission for operation");
        _;
    }
    modifier authenticatedWithMessage(address user, string memory message){
        require(authenticatedUsers[user], message);
        _;
    }

    ///////////////////////////////////////////////////////////////////
    ////////////////-----FUNCTIONS-----////////////////////////////////

    // ------------------------------------------------------------------------
    // Set or remove an address from authenticated list
    // authenticated address can perform any admin operation on the contract
    // Only owner can set add or remove authenticated users
    // ------------------------------------------------------------------------
    function setAuthenticated(address userAddress, bool status) public onlyOwner {
        authenticatedUsers[userAddress] = status;
        emit PermissionChanged(userAddress, status);
    }


    // Transfer Ownership of the contract to another address
    // Owner is still authenticated, and can be removed if necesssary
    // by the new owner.
    // ------------------------------------------------------------------------
    function transferOwnership(address payable _newOwnerAddress) public onlyOwner {
        owner = _newOwnerAddress;
        authenticatedUsers[owner] = false;
        emit PermissionChanged(owner, false);
        emit OwnershipTransferred(owner, _newOwnerAddress);
    }

    function suicide() public onlyOwner {
        emit PermissionChanged(owner, false);
        emit OwnershipTransferred(owner, address(0x00));
    }

}