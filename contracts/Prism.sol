// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFTCollection is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 public constant DISTRIBUTION_AMOUNT = 0.0001 ether;

    constructor() ERC721("PRISM", "PRSM") Ownable(msg.sender) {}

    /// @notice Mint an NFT (only owner can call)
    /// @param to recipient of the NFT
    /// @param recipients 5 addresses to distribute 0.0001 ETH each
    /// @param tokenURI off-chain metadata URI (IPFS/Arweave/HTTPS)
    function mint(
        address to,
        address[5] calldata recipients,
        string memory tokenURI
    ) external payable onlyOwner {
        require(msg.value == MINT_PRICE, "Must send 0.001 ETH");

        // distribute 0.0001 ETH to each recipient
        for (uint256 i = 0; i < 5; i++) {
            require(recipients[i] != address(0), "Invalid address");
            payable(recipients[i]).transfer(DISTRIBUTION_AMOUNT);
        }

        // mint NFT to `to`
        _tokenIds++;
        _mint(to, _tokenIds);
        _setTokenURI(_tokenIds, tokenURI);
    }

    /// @notice Withdraw remaining ETH from the contract
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
