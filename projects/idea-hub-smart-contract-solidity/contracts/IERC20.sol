pragma solidity >=0.6;

// copied from https://en.bitcoinwiki.org/wiki/ERC20#The_ERC20_Token_Standard_Interface
abstract contract IERC20 {
    function totalSupply() virtual public view returns (uint);

    function balanceOf(address tokenOwner) virtual public view returns (uint balance);

    function allowance(address tokenOwner, address spender) virtual public view returns (uint remaining);

    function transfer(address to, uint tokens) virtual public returns (bool success);

    // allow spender to spend tokens.
    function approve(address spender, uint tokens) virtual public returns (bool success);

    // transfer from another address when the sender is approved for the spending
    function transferFrom(address from, address to, uint tokens) virtual public returns (bool success);

    // erc20 events.
    event Transfer(address indexed from, address indexed to, uint tokens, bytes data);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens, bytes data);
}