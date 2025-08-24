"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ColorPicker from "@/components/ColorPicker";
import { downloadImage } from "@/lib/image";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { parseEther } from "viem";
// Removed mock API import - now using real OpenAI API

// Prism wallet address for receiving minting payments
const PRISM_WALLET_ADDRESS = '0xB62E542B161DbcF5adA06ddb17815B13b63FeE0f';
const MINT_AMOUNT = parseEther('0.001'); // 0.001 ETH

// Real minting function with wallet transaction
const mintArtwork = async (artData, walletClient, account, publicClient) => {
  console.log('=== STARTING MINT PROCESS ===');
  console.log('Artwork Data:', artData);
  console.log('Colors Used:', artData.colors);
  console.log('Account:', account);
  console.log('================================');

  try {
    // Step 1: Send 0.001 ETH transaction to Prism wallet
    console.log('Sending transaction...');
    const txHash = await walletClient.sendTransaction({
      account,
      to: PRISM_WALLET_ADDRESS,
      value: MINT_AMOUNT,
    });

    console.log('Transaction sent! Hash:', txHash);

    // Step 2: Wait for transaction confirmation
    console.log('Waiting for transaction confirmation...');
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash
    });

    console.log('Transaction confirmed! Receipt:', receipt);

    // Step 3: Call relay API with transaction hash and hex colors
    console.log('Calling relay API...');
    const relayResponse = await fetch('/api/relay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        txHash: txHash,
        hexColors: artData.colors,
        imageUrl: artData.imageUrl
      }),
    });

    if (!relayResponse.ok) {
      const errorData = await relayResponse.json();
      throw new Error(`Relay API error: ${errorData.error}`);
    }

    const relayResult = await relayResponse.json();
    console.log('Relay API response:', relayResult);

    // Step 4: Return success result with relay data
    const mintResult = {
      transactionHash: txHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      success: true,
      artworkData: artData,
      mintedAt: new Date().toISOString(),
      relayData: relayResult.data // Extract the data from relay response
    };

    console.log('=== MINT COMPLETED SUCCESSFULLY ===');
    console.log('Payment Transaction Hash:', mintResult.transactionHash);
    console.log('NFT Mint Transaction Hash:', mintResult.relayData.mintTxHash);
    console.log('Block Number:', mintResult.blockNumber);
    console.log('Gas Used:', mintResult.gasUsed);
    console.log('Minted At:', mintResult.mintedAt);
    console.log('====================================');

    return mintResult;

  } catch (error) {
    console.error('=== MINT FAILED ===');
    console.error('Error:', error);
    console.error('==================');
    throw error;
  }
};

export default function CreatePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [generatedArt, setGeneratedArt] = useState(null);
  const [mintedArt, setMintedArt] = useState(null);
  
  // Wagmi hooks for wallet functionality
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerateArt = async () => {
    if (selectedColors.length === 0) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-artwork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          colors: selectedColors,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate artwork');
      }

      const result = await response.json();
      setGeneratedArt(result);
    } catch (error) {
      console.error('Error generating art:', error);
      alert(`Failed to generate artwork: ${error.message}`);
    }
    setIsGenerating(false);
  };

  const handleMintArt = async () => {
    if (!generatedArt) return;
    
    // Check wallet connection
    if (!isConnected) {
      alert('Please connect your wallet first to mint artwork.');
      return;
    }
    
    if (!walletClient) {
      alert('Wallet client not ready. Please try again.');
      return;
    }
    
    if (!address) {
      alert('No wallet address found. Please connect your wallet.');
      return;
    }
    
    setIsMinting(true);
    try {
      const result = await mintArtwork(generatedArt, walletClient, address, publicClient);
      if (result.success) {
        // Set minted state instead of showing alert
        setMintedArt(result);
        // Clear the generated art to show minted state
        setGeneratedArt(null);
      }
    } catch (error) {
      console.error('Error minting art:', error);
      
      // Handle specific error types
      if (error.message?.includes('User rejected')) {
        alert('Transaction was rejected. Please try again if you want to mint.');
      } else if (error.message?.includes('insufficient funds')) {
        alert('Insufficient funds. You need at least 0.001 ETH plus gas fees to mint.');
      } else if (error.message?.includes('Relay API error')) {
        alert(`Minting transaction succeeded but relay API failed: ${error.message}`);
      } else {
        alert(`Failed to mint artwork: ${error.message || 'Unknown error'}`);
      }
    }
    setIsMinting(false);
  };

  const handleDownloadArt = () => {
    if (!generatedArt) return;
    
    try {
      const filename = `${generatedArt.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
      downloadImage(generatedArt.imageUrl, filename);
    } catch (error) {
      console.error('Error downloading art:', error);
      alert('Failed to download artwork. Please try again.');
    }
  };

  const handleCreateNew = () => {
    setMintedArt(null);
    setGeneratedArt(null);
    setSelectedColors([]);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-3">
          <img src="/icon.png" alt="Prism" className="w-12 h-12 rounded-lg" />
          <span className="text-2xl font-bold font-dotted text-white">Prism</span>
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/create" className="relative text-white transition-colors duration-300 font-dotted py-2">
            Create
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full"></div>
          </Link>
          <Link href="/gallery" className="relative text-slate-300 hover:text-white transition-colors duration-300 font-dotted py-2">
            Gallery
          </Link>
          <Link href="/colors" className="relative text-slate-300 hover:text-white transition-colors duration-300 font-dotted py-2">
            My Colors
          </Link>
          <ConnectButton />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-dotted text-white mb-4">
            Create Your
            <span className="bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent"> Masterpiece</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Select your colors and let AI transform them into unique artworks. Every color owner earns royalties.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Color Selection Panel */}
          <div className="glass-dark rounded-3xl p-8">
            <h2 className="text-2xl font-bold font-dotted text-white mb-6">Choose Your Colors</h2>
            
            <ColorPicker
              selectedColors={selectedColors}
              onColorsChange={setSelectedColors}
              showRandomGenerator={true}
            />

            {/* Generate Button */}
            <button
              onClick={handleGenerateArt}
              disabled={selectedColors.length === 0 || isGenerating}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 disabled:from-gray-600 disabled:to-gray-800 text-white py-4 rounded-full font-semibold font-dotted text-lg transition-all button-shadow disabled:cursor-not-allowed mt-4"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Art...</span>
                </div>
              ) : (
                '🎨 Generate Artwork'
              )}
            </button>
          </div>

          {/* Art Preview Panel */}
          <div className="glass-dark rounded-3xl p-8">
            <h2 className="text-2xl font-bold font-dotted text-white mb-6">
              {mintedArt ? '🎉 Artwork Minted!' : 'Preview'}
            </h2>
            
            {!generatedArt && !mintedArt ? (
              <div className="aspect-square bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-600/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-slate-400">Your artwork will appear here</p>
                </div>
              </div>
            ) : mintedArt ? (
              <div className="space-y-6">
                <div className="aspect-square bg-slate-900/30 rounded-2xl overflow-hidden">
                  <img
                    src={mintedArt.artworkData.imageUrl}
                    alt={mintedArt.artworkData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold font-dotted text-white mb-2">{mintedArt.artworkData.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Minted successfully • {new Date(mintedArt.mintedAt).toLocaleTimeString()}
                  </p>
                  
                  {/* Color palette used */}
                  <div className="mb-6">
                    <p className="text-slate-400 text-xs font-dotted mb-2">Colors Used:</p>
                    <div className="flex space-x-2">
                      {mintedArt.artworkData.colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center"
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2 border-slate-600/30 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                          <span className="text-xs text-slate-500 mt-1 font-mono">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Transaction Links */}
                  <div className="mb-6">
                    <p className="text-slate-400 text-xs font-dotted mb-3">Transaction Links:</p>
                    <div className="space-y-2">
                      <a
                        href={mintedArt.relayData.explorerUrls.payment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/50 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-slate-300">Payment Transaction</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {mintedArt.relayData.paymentTxHash.slice(0, 8)}...{mintedArt.relayData.paymentTxHash.slice(-6)}
                        </div>
                      </a>
                      
                      <a
                        href={mintedArt.relayData.explorerUrls.mint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/50 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-slate-300">NFT Minted</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {mintedArt.relayData.mintTxHash.slice(0, 8)}...{mintedArt.relayData.mintTxHash.slice(-6)}
                        </div>
                      </a>
                      
                      {mintedArt.relayData.metadataViewUrl && (
                        <a
                          href={mintedArt.relayData.metadataViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/50 p-3 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                            <span className="text-sm text-slate-300">View NFT Metadata</span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            IPFS
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Create New Button */}
                  <button
                    onClick={handleCreateNew}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-4 rounded-full font-semibold font-dotted text-lg transition-all button-shadow"
                  >
                    🎨 Create New Artwork
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="aspect-square bg-slate-900/30 rounded-2xl overflow-hidden">
                  <img
                    src={generatedArt.imageUrl}
                    alt={generatedArt.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold font-dotted text-white mb-2">{generatedArt.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Generated from {generatedArt.colors.length} colors • {new Date(generatedArt.generatedAt).toLocaleTimeString()}
                  </p>
                  
                  {/* Color palette used */}
                  <div className="mb-6">
                    <p className="text-slate-400 text-xs font-dotted mb-2">Colors Used:</p>
                    <div className="flex space-x-2">
                      {generatedArt.colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center"
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2 border-slate-600/30 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                          <span className="text-xs text-slate-500 mt-1 font-mono">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="space-y-3">
                    {/* <button
                      onClick={handleDownloadArt}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-3 rounded-full font-semibold font-dotted text-lg transition-all button-shadow"
                    >
                      📥 Download Artwork
                    </button>
                     */}
                    <button
                      onClick={handleMintArt}
                      disabled={isMinting || !isConnected}
                      className={`w-full py-4 rounded-full font-semibold font-dotted text-lg transition-all button-shadow disabled:cursor-not-allowed ${
                        !isConnected 
                          ? 'bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700 text-white'
                          : isMinting
                          ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white'
                          : 'bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700 text-white'
                      }`}
                    >
                      {!isConnected ? (
                        '🔗 Connect Wallet to Mint'
                      ) : isMinting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Minting (0.001 ETH)...</span>
                        </div>
                      ) : (
                        '⚡ Mint Artwork (0.001 ETH)'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
