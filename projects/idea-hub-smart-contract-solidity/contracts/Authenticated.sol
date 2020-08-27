pragma solidity >=0.4.22 <0.7.0;
/**
 * @title Authenticated Contract
 * @dev Contract feature to allow give addresses privileges
 *      there are two privilege scopes in this contract
 *      i) Owner         - Can perform admin operations and can add or remove other admins
 *                         There can be only one owner of the contract
 *     ii) Authenticated - Can perform admin operations
 *                         Contract can have multiple Authenticated addresses
*/
contract Authenticated {
    // owner of the contract
    address payable public owner;
    // lookup for address's permission status
    mapping(address => bool) public authenticatedUsers;


    // events

    /*
     * @dev Ownership changed and new owner is _to
     */
    event OwnershipTransferred(address indexed _from, address indexed _to);
    /*
     * @dev Admin privilege changed
     * @param _address the address whose permission status was changed
     * @param newStatus true means the address has admin privileges now
     *                  false means the address's permission was withdrawn
     */
    event PermissionChanged(address indexed _address, bool newStatus);

    /**
    * @dev initialize contract. This can be called only once.
    *      making a function instead of doing it in the constructor
    *      makes sense when we are using a proxy contract
    */
    function manualConstruct() public {
        require(owner == address(0x00), "Already Constructed");
        owner = msg.sender;
        authenticatedUsers[owner] = true;
        emit PermissionChanged(owner, true);
        emit OwnershipTransferred(address(0x00), owner);
    }

    /**
    * @dev require the function to be called by owner
    */
    modifier onlyOwner {
        require(owner == msg.sender, "Only contract owner can do this");
        _;
    }

    /**
    * @dev require the function to be called by any address that was previously given permission
    * @param user the address that should have admin rights
    */
    modifier authenticated(address user) {
        require(authenticatedUsers[user], "Insufficient Permission for operation");
        _;
    }
    /**
    * @dev require the function to be called by address that was previously given permission
    *      additionally, if the condition is not met, transaction will revert with the string message
    * @param user address that should have permission
    * @param message revert reason if the address doesn't have permission.
    */
    modifier authenticatedWithMessage(address user, string memory message){
        require(authenticatedUsers[user], message);
        _;
    }

    /**
    * @dev Set or remove an address from authenticated list
    *      authenticated address can perform any admin operation on the contract
    *      Only owner can set add or remove authenticated users
    * @param userAddress this address's permission address will be changed
    * @param status new permission status to set.
    *        true means the address will have privileges nowonwards
    *        false means the address's privileges will be removed
    */
    function setAuthenticated(address userAddress, bool status) public onlyOwner {
        authenticatedUsers[userAddress] = status;
        emit PermissionChanged(userAddress, status);
    }


    /**
    * @dev Transfer Ownership of the contract to another address
    *      Owner is still authenticated, and can be removed if necesssary
    *      by the new owner.
    * @param _newOwnerAddress ownership will be transferred to this address
    */
    function transferOwnership(address payable _newOwnerAddress) public onlyOwner {
        owner = _newOwnerAddress;
        authenticatedUsers[owner] = false;
        emit PermissionChanged(owner, false);
        emit OwnershipTransferred(owner, _newOwnerAddress);
    }

    /**
    * @dev delete contract data
    */
    function suicide() public onlyOwner {
        emit PermissionChanged(owner, false);
        emit OwnershipTransferred(owner, address(0x00));
    }

}