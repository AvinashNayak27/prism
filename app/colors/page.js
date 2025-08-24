"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Mock user's color NFTs
const mockUserColors = [
  {
    id: 1,
    color: "#ff6b6b",
    name: "Sunset Red",
    tokenId: 1001,
    purchasePrice: "0.1 ETH",
    totalEarned: "0.05 ETH",
    timesUsed: 12,
    lastUsed: "2 hours ago"
  },
  {
    id: 2,
    color: "#4ecdc4",
    name: "Ocean Teal",
    tokenId: 1002,
    purchasePrice: "0.08 ETH",
    totalEarned: "0.12 ETH",
    timesUsed: 28,
    lastUsed: "1 day ago"
  },
  {
    id: 3,
    color: "#a55eea",
    name: "Purple Dream",
    tokenId: 1003,
    purchasePrice: "0.15 ETH",
    totalEarned: "0.08 ETH",
    timesUsed: 15,
    lastUsed: "3 hours ago"
  },
  {
    id: 4,
    color: "#feca57",
    name: "Golden Hour",
    tokenId: 1004,
    purchasePrice: "0.12 ETH",
    totalEarned: "0.18 ETH",
    timesUsed: 35,
    lastUsed: "30 minutes ago"
  }
];

// Mock available colors for purchase
const mockAvailableColors = [
  { color: "#ff9ff3", name: "Pink Blossom", price: "0.09 ETH", rarity: "Common" },
  { color: "#54a0ff", name: "Sky Blue", price: "0.14 ETH", rarity: "Rare" },
  { color: "#5f27cd", name: "Deep Purple", price: "0.22 ETH", rarity: "Epic" },
  { color: "#00d2d3", name: "Mint Fresh", price: "0.11 ETH", rarity: "Common" },
  { color: "#ff6348", name: "Coral Sunset", price: "0.18 ETH", rarity: "Rare" },
  { color: "#2ed573", name: "Forest Green", price: "0.16 ETH", rarity: "Rare" }
];

export default function ColorsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('owned');
  const [userColors, setUserColors] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);

  useEffect(() => {
    setMounted(true);
    // Simulate loading
    setTimeout(() => {
      setUserColors(mockUserColors);
      setAvailableColors(mockAvailableColors);
    }, 500);
  }, []);

  const handlePurchaseColor = async (color) => {
    // Mock purchase function
    alert(`Purchasing ${color.name} for ${color.price}`);
  };

  const totalEarned = userColors.reduce((sum, color) => 
    sum + parseFloat(color.totalEarned.replace(' ETH', '')), 0
  );

  const totalInvested = userColors.reduce((sum, color) => 
    sum + parseFloat(color.purchasePrice.replace(' ETH', '')), 0
  );

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
          <Link href="/create" className="relative text-slate-300 hover:text-white transition-colors duration-300 font-dotted py-2">
            Create
          </Link>
          <Link href="/gallery" className="relative text-slate-300 hover:text-white transition-colors duration-300 font-dotted py-2">
            Gallery
          </Link>
          <Link href="/colors" className="relative text-white transition-colors duration-300 font-dotted py-2">
            My Colors
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full"></div>
          </Link>
          <ConnectButton />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-dotted text-white mb-4">
            My
            <span className="bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent"> Colors</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Manage your color NFT portfolio and track your earnings from AI art generation.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-dark rounded-2xl p-6 border border-slate-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-dotted">Colors Owned</p>
                <p className="text-3xl font-bold text-white">{userColors.length}</p>
              </div>
              <div className="text-4xl">🎨</div>
            </div>
          </div>
          
          <div className="glass-dark rounded-2xl p-6 border border-slate-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-dotted">Total Earned</p>
                <p className="text-3xl font-bold text-green-400">{totalEarned.toFixed(3)} ETH</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
          
          <div className="glass-dark rounded-2xl p-6 border border-slate-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-dotted">ROI</p>
                <p className="text-3xl font-bold text-purple-400">
                  {totalInvested > 0 ? `+${((totalEarned / totalInvested) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 glass-dark rounded-full p-1 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('owned')}
            className={`flex-1 py-3 px-6 rounded-full font-semibold font-dotted transition-all ${
              activeTab === 'owned'
                ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            My Colors
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex-1 py-3 px-6 rounded-full font-semibold font-dotted transition-all ${
              activeTab === 'marketplace'
                ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Marketplace
          </button>
        </div>

        {/* Content */}
        {activeTab === 'owned' ? (
          <div>
            {userColors.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎨</div>
                <p className="text-slate-400 text-xl mb-4 font-dotted">No colors owned yet</p>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white px-6 py-3 rounded-full font-semibold font-dotted transition-all button-shadow"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userColors.map((colorNft) => (
                  <div
                    key={colorNft.id}
                    className="glass-dark rounded-2xl p-6 border border-slate-600/30 hover:bg-slate-800/50 transition-all button-shadow"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-slate-600/30"
                        style={{ backgroundColor: colorNft.color }}
                      />
                      <div>
                        <h3 className="text-xl font-semibold font-dotted text-white">{colorNft.name}</h3>
                        <p className="text-slate-400 text-sm">Token #{colorNft.tokenId}</p>
                        <p className="text-slate-400 text-sm font-mono">{colorNft.color}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Purchase Price</span>
                        <span className="text-white">{colorNft.purchasePrice}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Total Earned</span>
                        <span className="text-green-400 font-semibold">{colorNft.totalEarned}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Times Used</span>
                        <span className="text-white">{colorNft.timesUsed}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Last Used</span>
                        <span className="text-slate-300 text-sm">{colorNft.lastUsed}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-600/30">
                      <div className="text-center">
                        <div className="text-sm text-slate-400 mb-1 font-dotted">Earning Rate</div>
                        <div className="text-lg font-semibold text-purple-400">
                          {colorNft.timesUsed > 0 ? 
                            `${(parseFloat(colorNft.totalEarned.replace(' ETH', '')) / colorNft.timesUsed).toFixed(4)} ETH/use` 
                            : 'No usage yet'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-slate-300 text-center font-dotted">
                Purchase color NFTs to start earning royalties from AI art generation
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableColors.map((color, index) => (
                <div
                  key={index}
                  className="glass-dark rounded-2xl p-6 border border-slate-600/30 hover:bg-slate-800/50 transition-all button-shadow"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-slate-600/30"
                      style={{ backgroundColor: color.color }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold font-dotted text-white">{color.name}</h3>
                      <p className="text-slate-400 text-sm font-mono">{color.color}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold font-dotted ${
                        color.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-300' :
                        color.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {color.rarity}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400">Price</span>
                    <span className="text-2xl font-bold text-white">{color.price}</span>
                  </div>
                  
                  <button
                    onClick={() => handlePurchaseColor(color)}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white py-3 rounded-full font-semibold font-dotted transition-all button-shadow transform hover:scale-105"
                  >
                    Purchase Color
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
