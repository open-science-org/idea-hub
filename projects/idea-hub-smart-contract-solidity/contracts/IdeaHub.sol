pragma solidity >=0.6 <0.7;

import "./Authenticated.sol";
import "./IERC20.sol";
import "./IIdeaHub.sol";
import "./IdeaHubSigning.sol";

/**

/* @title IdeaHub contract
 * @dev  Implements the IdeaHub Platform Interface.
 *       For documentation of public methods related to platform operation,
 *       please refer IIdeaHub.sol Contract interface
 */
contract IdeaHub is Authenticated, IIdeaHub, IdeaHubSigning {
    // oso token contract address.
    address public foundationAddress;
    address public tokenSourceAddress = address(0x0);
    IERC20 public osoToken;

    // minimum validation count for publication of idea.
    uint16 public validationsThresholdForPublication = 5;

    // tokens received by each entities involved in idea publication.
    uint256 validatorShare = 20000;
    uint256 authorShare = 70000;
    uint256 foundationShare = 10000;


    struct User {
        // bit mask for user roles or types.
        // 0b00000001 = author
        // 0b00000010 = validator
        uint8 role;
        bytes32 id;
    }

    uint8 ROLE_AUTHOR = 1;
    uint8 ROLE_VALIDATOR = 2;


    // users in the platform
    mapping(address => User) users;
    // mapping for looking up user address when id is known
    mapping(bytes32 => address) userLookup;

    struct IdeaRevisionDetail {
        // flag to test whether infoHash was registered
        bool exists;
        // list of validators;
        address[] validators;
        // mapping to check for validator
        mapping(address => bool) isValidator;
    }

    struct Idea {
        address author;
        uint256 index;
        // maps content's infoHash or ipfs hash to the validation details
        mapping(bytes32 => IdeaRevisionDetail) revisions;
        bytes32[] revisionList;

        bool published;
    }


    bytes32[] ideaIds;
    mapping(bytes32 => Idea) _ideas;

    /**
    * @dev After deploying the contract immediately set the params using
    *       function setPlatformParams and setSigningParams
    * @param osoTokenAddress address OSO Erc20 Token
    * @param _foundationAddress OSO Foundation address. This address will receive a share of token on each idea publication
    *
    */
    constructor(address osoTokenAddress, address _foundationAddress) public {
        osoToken = IERC20(osoTokenAddress);
        foundationAddress = _foundationAddress;
        Authenticated.manualConstruct();
    }

    /**
    * @dev make sure that the 32 byte value is not filled with zeros
    */
    modifier nonZeroBytes(bytes32 _bytes){
        require(_bytes != bytes32(0x0));
        _;
    }

    /**
    * @dev get UserId for when address for given UserType is known
    * @param _address address to query
    * @param userType userType currently being queried, either author or validator
    */
    function _userId(address _address, uint8 userType) internal view returns (bytes32){
        User storage user = users[_address];
        if (user.role & userType == 0) {
            return bytes32("");
        }
        return user.id;
    }

    /**
    * @dev getUser address for given user Type when off-chain userId is known
    * @param id hashed Id of user
    * @param userType return the address only if the user is of required type
    */
    function _userAddress(bytes32 id, uint8 userType) internal view returns (address){
        address _address = userLookup[id];
        if (_address == address(0x0)) {
            return address(0x0);
        }
        User storage user = users[_address];
        require(user.role & userType != 0);
        return _address;
    }

    /**
    * @dev register User with userType. Can be called multiple times to register same user for  different userTypes.
    * @param _address Address of user
    * @param userType User type bit to mask. only one User type at a time.
    */
    function _registerUser(bytes32 userId, address _address, uint8 userType) internal {
        require(users[_address].role & userType == 0);
        User storage user = users[_address];
        require(userLookup[userId] == address(0x0) || userLookup[userId] == _address);
        user.role = user.role | userType;
        user.id = userId;
        userLookup[userId] = _address;
    }

    /**
    * Register an idea to platform. Can be called to update Content Hash of the idea
    * @param ideaId hashed Id of idea
    * @param contentHash InfoHash f
    * @param author Address of author of idea
    */
    function _register(bytes32 ideaId, bytes32 contentHash, address author) internal {
        Idea storage idea = _ideas[ideaId];
        if (idea.author == address(0x00)) {
            ideaIds.push(ideaId);
            idea.author = author;
        } else {
            require(idea.author == author);
        }
        IdeaRevisionDetail storage content = idea.revisions[contentHash];
        require(!content.exists);
        content.exists = true;
        idea.revisionList.push(contentHash);
        emit Registered(ideaIds.length, idea.revisionList.length);
    }

    /**
    * @dev mark idea as validated by the validator.
    * @param ideaNo Sequential no obtained on registering idea
    * @param revisionNo the revisionNo of idea to validate
    * @param validator address of the validator
    */
    function _validate(uint256 ideaNo, uint256 revisionNo, address validator) internal {
        require(users[validator].role & 2 != 0);
        Idea storage idea = _ideas[ideaIds[ideaNo - 1]];
        require(idea.author != address(0x00) && idea.author != validator);
        IdeaRevisionDetail storage content = idea.revisions[idea.revisionList[revisionNo - 1]];
        require(content.exists);
        require(!content.isValidator[validator]);
        content.isValidator[validator] = true;
        content.validators.push(validator);
        emit Validated(ideaNo, revisionNo, content.validators.length);
    }



    /**
    * @dev see IIdeaHub.ideas
    */

    function ideas(uint256 ideaNo) public view override(IIdeaHub) returns (bytes32 id, bytes32 author, bool isPublished, uint256 revisionCount){
        require(ideaNo > 0 && ideaNo <= ideaIds.length, "Index out of bounds");
        bytes32 ideaId = ideaIds[ideaNo - 1];
        Idea storage idea = _ideas[ideaId];
        return (ideaId, users[idea.author].id, idea.published, idea.revisionList.length);
    }
    /**
    * @dev see IIdeaHub.ideaRevision
    */
    function ideaRevision(uint256 ideaNo, uint256 revisionNo) public view override(IIdeaHub) returns (bytes32 contentHash, uint256 validations){
        require(ideaNo > 0 && ideaNo <= ideaIds.length, "Index out of bounds");
        Idea storage idea = _ideas[ideaIds[ideaNo - 1]];
        require(revisionNo > 0 && revisionNo <= idea.revisionList.length, "Index out of bounds");
        bytes32 _contentHash = idea.revisionList[revisionNo - 1];
        IdeaRevisionDetail storage content = idea.revisions[_contentHash];
        return (_contentHash, content.validators.length);
    }

    /**
    * @dev see IIdeaHub.ideaValidator
    */
    function ideaValidator(uint256 ideaNo, uint256 revisionNo, uint256 validatorNo) public view override(IIdeaHub) returns (address){
        require(ideaNo > 0 && ideaNo <= ideaIds.length, "Index out of bounds");
        Idea storage idea = _ideas[ideaIds[ideaNo - 1]];
        require(revisionNo > 0 && revisionNo <= idea.revisionList.length, "Index out of bounds");
        IdeaRevisionDetail storage content = idea.revisions[idea.revisionList[revisionNo - 1]];
        require(validatorNo > 0 && validatorNo <= content.validators.length, "Index out of bounds");
        return content.validators[validatorNo - 1];
    }

    /**
    * @dev see IIdeaHub.authorId
    */
    function authorId(address _address) public view override(IIdeaHub) returns (bytes32){
        return _userId(_address, ROLE_AUTHOR);
    }

    /**
    * @dev see IIdeaHub.authorAddress
    */
    function authorAddress(bytes32 id) public view override(IIdeaHub) returns (address){
        return _userAddress(id, ROLE_AUTHOR);
    }

    /**
    * @dev see IIdeaHub.validatorId
    */
    function validatorId(address _address) public view override(IIdeaHub) returns (bytes32){
        return _userId(_address, ROLE_VALIDATOR);
    }

    /**
    * @dev see IIdeaHub.validatorAddress
    */
    function validatorAddress(bytes32 id) public view override(IIdeaHub) returns (address){
        return _userAddress(id, ROLE_VALIDATOR);
    }


    /**
    * @dev see IIdeaHub.registerAuthor
    */
    function registerAuthor(bytes32 userId, address _address, bytes32 r, bytes32 s, uint8 v) public override(IIdeaHub) nonZeroBytes(userId) {
        AuthorRegistration memory registration = AuthorRegistration(userId, _address);
        bytes32 message = hash(domainSeparator, hash(registration));
        address signer = ecrecover(message, v < 27 ? v + 27 : v, r, s);
        require(signer == _address);
        _registerUser(userId, _address, 1);
        emit AuthorRegistered(userId);
    }
    /**
    * @dev see IIdeaHub.registerAuthor
    */
    function registerAuthor(bytes32 userId) public override(IIdeaHub) nonZeroBytes(userId) {
        _registerUser(userId, msg.sender, 1);
        emit AuthorRegistered(userId);
    }

    /**
    * @dev see IIdeaHub.registerValidator
    */
    function registerValidator(bytes32 userId, address _address) public override(IIdeaHub) authenticated(msg.sender) nonZeroBytes(userId) {
        _registerUser(userId, _address, 2);
    }

    /**
    * @dev see IIdeaHub.register
    */
    function register(bytes32 ideaId, bytes32 contentHash) public override(IIdeaHub) nonZeroBytes(ideaId) nonZeroBytes(contentHash) {
        _register(ideaId, contentHash, msg.sender);
    }

    /**
    * @dev see IIdeaHub.register
    */
    function register(bytes32 ideaId, address author, bytes32 contentHash, uint8 v, bytes32 r, bytes32 s) public override(IIdeaHub) nonZeroBytes(ideaId) nonZeroBytes(contentHash) {
        IdeaRegistration memory registration = IdeaRegistration(contentHash, ideaId, author);
        bytes32 message = hash(domainSeparator, hash(registration));
        address signer = ecrecover(message, v < 27 ? v + 27 : v, r, s);
        require(signer == author);
        _register(ideaId, contentHash, author);

    }

    /**
    * @dev see IIdeaHub.validate
    */
    function validate(uint256 ideaNo, uint256 revisionNo) public override(IIdeaHub) {
        _validate(ideaNo, revisionNo, msg.sender);
    }

    /**
    * @dev see IIdeaHub.validate
    */

    function validate(uint256 ideaNo, uint256 revisionNo, address validator, uint8 v, bytes32 r, bytes32 s) public override(IIdeaHub) {
        Validation memory validation = Validation(validator, ideaNo, revisionNo);
        bytes32 message = hash(domainSeparator, hash(validation));
        address signer = ecrecover(message, v < 27 ? v + 27 : v, r, s);
        require(signer == validator);
        _validate(ideaNo, revisionNo, validator);
    }

    /**
    * @dev see IIdeaHub.publish
    */
    function publish(uint256 ideaNo, uint256 revisionNo) public override(IIdeaHub) {
        Idea storage idea = _ideas[ideaIds[ideaNo - 1]];
        IdeaRevisionDetail storage content = idea.revisions[idea.revisionList[revisionNo - 1]];
        require(content.validators.length >= validationsThresholdForPublication);
        idea.published = true;

        // calculate the tokens each validator will receive.
        uint256 validatorSplit = validatorShare / content.validators.length;

        // distribute the tokens
        osoToken.transferFrom(tokenSourceAddress, idea.author, authorShare);
        osoToken.transferFrom(tokenSourceAddress, foundationAddress, foundationShare);
        for (uint z = 0; z < content.validators.length; z++) {
            osoToken.transferFrom(tokenSourceAddress, content.validators[z], validatorSplit);
        }
        emit Published(ideaNo, revisionNo);
    }

    /**
    * @dev Set parameters related to idea validation and token distribution
    * @param validationThreshold No of validations required before idea can be published
    * @param _authorShare the amount of token authors will receive when an idea is published
    * @param _validatorShare the amount of token validators will receive when an idea is published
    * @param _foundationShare the amount of tokens OSO foundation will receive when an idea is published
    */
    function setPlatformParams(uint16 validationThreshold, uint256 _authorShare, uint256 _validatorShare, uint256 _foundationShare) public onlyOwner {
        validationsThresholdForPublication = validationThreshold;
        validatorShare = _validatorShare;
        authorShare = _authorShare;
        foundationShare = _foundationShare;
    }

    /**
    * @dev Set parameters for Signing collision mitigation as per EIP 712 standard
    * @param name name of the contract
    * @param version contract version
    * @param chainId of the blockchain on which the contract is deployed. In future, current chainId can be directly accessed in solidity
    * @param verifyingContract the contract address that will verify the signature
    * @param salt extra parameter for ensuring uniqueness in case  all of the above values collide
    */
    function setSigningParams(string memory name, string memory version, uint256 chainId, address verifyingContract, bytes32 salt) public override(IdeaHubSigning) onlyOwner {
        domainSeparator.name = name;
        domainSeparator.version = version;
        domainSeparator.chainId = chainId;
        domainSeparator.verifyingContract = verifyingContract;
        domainSeparator.salt = salt;
    }

    /**
    * @dev set the addresses for token token transfer when distributing them
    * @param _tokenSourceAddress  the address from which tokens will be sent
    * @param _foundationAddress OSO Foundation address. This address will receive some tokens on each idea publication
    */
    function setTokenTransferParams(address _tokenSourceAddress, address _foundationAddress) public onlyOwner {
        tokenSourceAddress = _tokenSourceAddress;
        foundationAddress = _foundationAddress;
    }
}