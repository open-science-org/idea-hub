pragma solidity >=0.6 <0.7;


// for details about the concept look at
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
// and https://docs.metamask.io/guide/signing-data.html
abstract contract IdeaHubSigning {
    struct EIP712Domain {
        string name;
        string version;
        uint256 chainId;
        address verifyingContract;
        bytes32 salt;
    }

    struct AuthorRegistration {
        bytes32 id;
        address wallet;
    }

    struct IdeaRegistration {
        bytes32 content;
        bytes32 id;
        address author;
    }

    struct Validation {
        address validator;
        uint256 ideaNo;
        uint256 revisionNo;
    }

    EIP712Domain domainSeparator;


    bytes32 private constant AUTHOR_REGISTRATION_TYPEHASH = keccak256("AuthorRegistration(uint256 id,address wallet)");
    bytes32 private constant IDEA_VALIDATION_TYPEHASH = keccak256("Validation(address validator,uint256 ideaNo,uint256 revisionNo)");
    bytes32 private constant IDEA_REGISTRATION_TYPEHASH = keccak256("IdeaRegistration(bytes32 content,bytes32 id,address author)");
    bytes32 private constant EIP712DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)");

    function setSigningParams(string memory name, string  memory version, uint256 chainId, address verifyingContract, bytes32 salt) virtual public;

    function hash(EIP712Domain memory eip712Domain) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                EIP712DOMAIN_TYPEHASH,
                keccak256(bytes(eip712Domain.name)),
                keccak256(bytes(eip712Domain.version)),
                eip712Domain.chainId,
                eip712Domain.verifyingContract,
                eip712Domain.salt

            ));
    }

    function hash(AuthorRegistration memory registration) internal pure returns (bytes32){
        return keccak256(abi.encode(
                AUTHOR_REGISTRATION_TYPEHASH,
                registration.id,
                registration.wallet
            ));
    }

    function hash(IdeaRegistration memory registration) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                IDEA_REGISTRATION_TYPEHASH,
                registration.content,
                registration.id,
                registration.author
            ));
    }

    function hash(Validation memory validation) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                IDEA_VALIDATION_TYPEHASH,
                validation.validator,
                validation.ideaNo,
                validation.revisionNo
            ));
    }

    function hash(EIP712Domain memory domain, bytes32 message) internal pure returns (bytes32){
        return keccak256(abi.encodePacked(
                "\\x19\\x01",
                hash(domain), message));
    }

}