import { NextResponse } from "next/server";
import axios from "axios";
import { createWalletClient, http, createPublicClient, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { PRISM_COLLECTION_ADDRESS, PRISM_COLLECTION_ABI } from "@/lib/constants.js";
import { shapeSepolia } from "viem/chains";


// MINT_RECIPIENTS will be dynamically fetched based on hex colors

// Set up wallet client with private key
const account = privateKeyToAccount(process.env.PRISM_PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: shapeSepolia,
  transport: http()
});

const publicClient = createPublicClient({
  chain: shapeSepolia,
  transport: http()
});

// Function to get transaction sender from transaction hash
async function getTransactionSender(txHash) {
  try {
    const transaction = await publicClient.getTransaction({ hash: txHash });
    return transaction.from;
  } catch (error) {
    console.error("Error getting transaction sender:", error);
    throw error;
  }
}

// Function to fetch NFTs from Alchemy Base mainnet
async function getNFTsFromContract() {
  try {
    const response = await fetch("https://base-mainnet.g.alchemy.com/nft/v3/RJ-Ir6dl4t5uuC2nAy9ET/getNFTsForContract?contractAddress=0x7Bc1C072742D8391817EB4Eb2317F98dc72C61dB&withMetadata=true&limit=100", {
      method: "GET",
      headers: {},
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.json();
    console.log("NFTs fetched from contract:", body);
    return body.nfts || [];
  } catch (error) {
    console.error("Error fetching NFTs from contract:", error);
    throw error;
  }
}

// Function to get NFT owner by token ID
async function getNFTOwner(tokenId) {
  try {
    const response = await fetch(`https://base-mainnet.g.alchemy.com/nft/v3/RJ-Ir6dl4t5uuC2nAy9ET/getOwnersForNFT?contractAddress=0x7Bc1C072742D8391817EB4Eb2317F98dc72C61dB&tokenId=${tokenId}`, {
      method: "GET",
      headers: {},
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.json();
    console.log(`Owner for token ${tokenId}:`, body);
    return body.owners && body.owners.length > 0 ? body.owners[0] : null;
  } catch (error) {
    console.error(`Error fetching owner for token ${tokenId}:`, error);
    throw error;
  }
}

// Function to get mint recipients based on hex colors
async function getMintRecipientsFromHexColors(hexColors) {
  try {
    console.log("Fetching NFTs from contract to match hex colors...");
    const nfts = await getNFTsFromContract();
    
    const recipients = [];
    const matchedTokens = [];
    
    for (const hexColor of hexColors) {
      // Find NFT that matches this hex color in name
      const matchingNFT = nfts.find(nft => 
        nft.name && nft.name.toLowerCase().includes(hexColor.toLowerCase().replace('#', ''))
      );
      
      if (matchingNFT && matchingNFT.tokenId) {
        console.log(`Found matching NFT for ${hexColor}:`, {
          name: matchingNFT.name,
          tokenId: matchingNFT.tokenId
        });
        
        // Get the owner of this NFT
        const owner = await getNFTOwner(matchingNFT.tokenId);
        if (owner) {
          recipients.push(owner);
          matchedTokens.push({
            hexColor,
            tokenId: matchingNFT.tokenId,
            name: matchingNFT.name,
            owner
          });
        } else {
          console.warn(`No owner found for token ${matchingNFT.tokenId} (${hexColor})`);
          // Fallback to a default address if no owner found
          recipients.push('0xAD7c065112dCF8891b10F8e70eF74F5E4A168Fa4');
          matchedTokens.push({
            hexColor,
            tokenId: matchingNFT.tokenId,
            name: matchingNFT.name,
            owner: '0xAD7c065112dCF8891b10F8e70eF74F5E4A168Fa4' // fallback
          });
        }
      } else {
        console.warn(`No matching NFT found for hex color: ${hexColor}`);
        // Fallback to a default address if no matching NFT found
        recipients.push('0xAD7c065112dCF8891b10F8e70eF74F5E4A168Fa4');
        matchedTokens.push({
          hexColor,
          tokenId: null,
          name: null,
          owner: '0xAD7c065112dCF8891b10F8e70eF74F5E4A168Fa4' // fallback
        });
      }
    }
    
    console.log("=== HEX COLOR TO NFT MATCHING RESULTS ===");
    console.log("Matched tokens:", matchedTokens);
    console.log("Final recipients array:", recipients);
    console.log("========================================");
    
    return { recipients, matchedTokens };
  } catch (error) {
    console.error("Error getting mint recipients from hex colors:", error);
    // Return fallback recipients in case of error
    const fallbackRecipients = hexColors.map(() => '0xAD7c065112dCF8891b10F8e70eF74F5E4A168Fa4');
    return { 
      recipients: fallbackRecipients, 
      matchedTokens: hexColors.map(color => ({
        hexColor: color,
        tokenId: null,
        name: null,
        owner: '0xAD7c065112dCF8891b10F8e70eF74F5E4A168Fa4'
      }))
    };
  }
}

// Function to upload media file to IPFS
async function uploadMediaToIPFS(file) {
  const form = new FormData();
  form.append("file", file);

  try {
    const response = await axios.post(
      "https://ipfs-uploader.zora.co/api/v0/add?cid-version=1",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return `ipfs://${response.data.cid}`;
  } catch (error) {
    console.error("Error uploading media to IPFS:", error);
    throw error;
  }
}

async function uploadJSONToIPFS(json) {
  const form = new FormData();
  const blob = new Blob([json], { type: "application/json" });
  form.append("file", blob, "metadata.json");

  try {
    const response = await axios.post(
      "https://ipfs-uploader.zora.co/api/v0/add?cid-version=1",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return `ipfs://${response.data.cid}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { txHash, hexColors, imageUrl } = await request.json();

    // Validate input
    if (!txHash || !hexColors || !imageUrl) {
      return NextResponse.json(
        { error: "txHash, hexColors, and imageUrl are required" },
        { status: 400 }
      );
    }

    // Validate txHash format (basic validation)
    if (!txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
      return NextResponse.json(
        { error: "Invalid transaction hash format" },
        { status: 400 }
      );
    }

    // Validate hexColors array
    if (!Array.isArray(hexColors) || hexColors.length === 0) {
      return NextResponse.json(
        { error: "hexColors must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate hex color format
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    const invalidColors = hexColors.filter((color) => !hexColorRegex.test(color));
    
    if (invalidColors.length > 0) {
      return NextResponse.json(
        { error: `Invalid hex colors: ${invalidColors.join(", ")}` },
        { status: 400 }
      );
    }

    // Get the sender address from the payment transaction
    let senderAddress;
    try {
      senderAddress = await getTransactionSender(txHash);
    } catch (error) {
      console.error("Error getting transaction sender:", error);
      return NextResponse.json(
        { error: "Failed to decode transaction sender" },
        { status: 500 }
      );
    }

    // Get mint recipients based on hex colors
    let mintRecipients;
    let matchedTokens;
    try {
      const recipientData = await getMintRecipientsFromHexColors(hexColors);
      mintRecipients = recipientData.recipients;
      matchedTokens = recipientData.matchedTokens;
    } catch (error) {
      console.error("Error getting mint recipients:", error);
      return NextResponse.json(
        { error: "Failed to fetch NFT owners for hex colors" },
        { status: 500 }
      );
    }

    // Upload image to IPFS
    let imageIPFSHash;
    let metadataIPFSHash;
    
    try {
      // Download the image from the URL
      const imageResponse = await axios.get(imageUrl, { responseType: 'blob' });
      const imageBlob = imageResponse.data;
      
      // Create a File object from the blob
      const imageFile = new File([imageBlob], 'artwork.png', { type: 'image/png' });
      
      // Upload image to IPFS
      imageIPFSHash = await uploadMediaToIPFS(imageFile);
      
      // Create metadata JSON
      const metadata = {
        name: "PRISM",
        description: "Metaphor for colors combining into art",
        image: imageIPFSHash,
        attributes: hexColors.map((color, index) => ({
          trait_type: `Color ${index + 1}`,
          value: color
        }))
      };
      
      // Upload metadata to IPFS
      metadataIPFSHash = await uploadJSONToIPFS(JSON.stringify(metadata));
      
    } catch (ipfsError) {
      console.error("IPFS Upload Error:", ipfsError);
      return NextResponse.json(
        { error: "Failed to upload to IPFS" },
        { status: 500 }
      );
    }

    // Call the mint function on the contract
    let mintTxHash;
    try {
      const mintTx = await walletClient.writeContract({
        address: PRISM_COLLECTION_ADDRESS,
        abi: PRISM_COLLECTION_ABI,
        functionName: 'mint',
        args: [
          senderAddress, // to - the user who made the payment
          mintRecipients, // recipients array (dynamically fetched from NFT owners)
          `https://magic.decentralized-content.com/ipfs/${metadataIPFSHash.replace('ipfs://', '')}` // tokenURI - the metadata IPFS hash
        ],
        value: parseEther('0.001') // MINT_PRICE if needed
      });
      
      mintTxHash = mintTx;
      
      // Wait for transaction confirmation
      await publicClient.waitForTransactionReceipt({ hash: mintTxHash });
      
    } catch (mintError) {
      console.error("Mint Error:", mintError);
      return NextResponse.json(
        { error: "Failed to mint NFT on contract" },
        { status: 500 }
      );
    }

    // Log the relay data for now (as requested)
    console.log("=== RELAY API CALLED ===");
    console.log("Payment Transaction Hash:", txHash);
    console.log("Sender Address:", senderAddress);
    console.log("Hex Colors:", hexColors);
    console.log("Number of Colors:", hexColors.length);
    console.log("Matched Tokens:", matchedTokens);
    console.log("Mint Recipients (NFT Owners):", mintRecipients);
    console.log("Image URL:", imageUrl);
    console.log("Image IPFS Hash:", imageIPFSHash);
    console.log("Metadata IPFS Hash:", metadataIPFSHash);
    console.log("NFT Mint Transaction Hash:", mintTxHash);
    console.log("Timestamp:", new Date().toISOString());
    console.log("========================");

    // Extract the IPFS hash from the metadata IPFS hash (remove 'ipfs://' prefix)
    const metadataHash = metadataIPFSHash.replace('ipfs://', '');
    
    return NextResponse.json({
      success: true,
      message: "Artwork minted successfully",
      data: {
        paymentTxHash: txHash,
        mintTxHash: mintTxHash,
        senderAddress,
        hexColors,
        matchedTokens,
        mintRecipients,
        imageUrl,
        imageIPFSHash,
        metadataIPFSHash,
        metadataViewUrl: `https://magic.decentralized-content.com/ipfs/${metadataHash}`,
        processedAt: new Date().toISOString(),
        status: "minted",
        explorerUrls: {
          payment: `https://sepolia.shapescan.xyz/tx/${txHash}`,
          mint: `https://sepolia.shapescan.xyz/tx/${mintTxHash}`
        }
      }
    });

  } catch (error) {
    console.error("Relay API Error:", error);
    return NextResponse.json(
      { error: "Failed to process relay request" },
      { status: 500 }
    );
  }
}
