pragma solidity >=0.6 <0.7;
abstract contract IIdeaHub {

    //// Views ////

    /**
    * @dev getIdea info by hash
    * @param ideaNo Sequential no obtained on registering idea (starts from 1)
    * @return id Hashed identity of idea
    * @return author Author of the idea
    * @return isPublished true if idea is already published
    * @return revisionCount No of revisions submitted for the idea
    **/
    function ideas(uint256 ideaNo) virtual public view returns (bytes32 id, bytes32 author, bool isPublished, uint256 revisionCount);

    /**
    * @dev Get details of particular revision of an idea.
    *      Each  idea can have multiple revisions. revision with highest no is the latest
    * @param ideaNo Sequential no obtained on registering idea (starts from 1)
    * @param revisionNo the revision position in list to return details about, the last position gives the latest revision.
    * @return contentHash InfoHash of the content in this revision
    * @return validations No of validations received by the revision
    */
    function ideaRevision(uint256 ideaNo, uint256 revisionNo) virtual public view returns (bytes32 contentHash, uint256 validations);

    /**
    * @dev Get the validator address at given position in the validator list for an idea revision
    *      Validators validate particular revision of the idea.
    * @param ideaNo Sequential no obtained on registering idea
    * @param revisionNo position for the revision to select
    * @param validatorNo position in the validator list for idea revision (starts from 1)
    */
    function ideaValidator(uint256 ideaNo, uint256 revisionNo, uint256 validatorNo) virtual public view returns (address);
    /**
    * @dev get off-chain id of an author.
    * @param _address Address of author
    */
    function authorId(address _address) virtual public view returns (bytes32);

    /**
    * @dev get address of author given id.
    * @param id off-chain generated id of the author
    */
    function authorAddress(bytes32 id) virtual public view returns (address);

    /**
    * @dev get off-chain id of validator.
    * @param _address Address of validator.
    */
    function validatorId(address _address) virtual public view returns (bytes32);

    /**
    * @dev get address of validator given known id.
    * @param id off-chain generated id of the validator
    */
    function validatorAddress(bytes32 id) virtual public view returns (address);

    //// Transaction Functions ////

    /**
    * @dev register an userId and assosiate it with a user.
    * When user doesn't want to spend fee it is called by foundation, it requires the signature of user.
    * @param userId off-chain generated identifier for the user
    * @param _address associated address of the user.
    * @param v Signature fragment - v
    * @param r Signature fragment - r
    * @param s Signature fragment - s
    */
    function registerAuthor(bytes32 userId, address _address, bytes32 r, bytes32 s, uint8 v) virtual public;
    /**
    * @dev Register yourself as an user in the platform.
    * @param userId off-chain generated user Identifier
    */
    function registerAuthor(bytes32 userId) virtual public;

    /**
    * @dev Register a validator in the platform.
    *      Validators can be added only by specific authorized addresses.
    * @param userId off-chain generated id for the validator;
    * @param _address Validator's ethereum address
    */
    function registerValidator(bytes32 userId, address _address) virtual public;

    /**
     * @dev Register an idea
     * @param ideaId Id for the idea, may be generated randomly or with hash functions
     * @param contentHash InfoHash of the idea content
     */
    function register(bytes32 ideaId, bytes32 contentHash) virtual public;

    /**
    * @dev Register an idea. When user cannot pay gasPrice for transaction, user can sign the request and send details to foundation for transaction submission.
     * @param ideaId Id for the idea, may be generated randomly or with hash functions
    * @param author Address of the author.
    * @param contentHash InfoHash of the idea content
    * @param v Signature fragment - v
    * @param r Signature fragment - r
    * @param s Signature fragment - s
    */
    function register(bytes32 ideaId, address author, bytes32 contentHash, uint8 v, bytes32 r, bytes32 s) virtual public;

    /**
    * @dev Validate an idea. Validators can call this function to validate other people's idea (not their own).
    * @param ideaNo Sequential no obtained on registering idea
    * @param revisionNo Idea revision to validate
    */
    function validate(uint256 ideaNo, uint256 revisionNo) virtual public;

    /**
    * @dev Validate an idea. Validators can sign the validation details and send it to foundation if they cannot pay for the gas price.
    * @param ideaNo Sequential no obtained on registering idea
    * @param revisionNo Idea revision to validate
    * @param validator Validator's address
    * @param v Signature fragment - v
    * @param r Signature fragment - r
    * @param s Signature fragment - s
    */
    function validate(uint256 ideaNo, uint256 revisionNo, address validator, uint8 v, bytes32 r, bytes32 s) virtual public;


    /**
    * @dev Publish an idea. Call is successful only if the idea has already reached validation threshold.
    * Anyone can publish an idea which has reached it's validation threshold.
    * @param ideaNo Sequential no obtained on registering idea
    * @param revisionNo Idea revision to validate
    */
    function publish(uint256 ideaNo, uint256 revisionNo) virtual public;

    // events
    event AuthorRegistered(bytes32 id);
    event ValidatorRegistered(bytes32 id);
    event Registered(uint256 ideaNo, uint256 revisionNo);
    event Validated(uint256 ideaNo, uint256 revisionNo, uint256 newValidationCount);
    event Published(uint256 ideaNo, uint256 revisionNo);

}