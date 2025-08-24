"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Function to fetch NFTs from Alchemy API
const fetchNFTs = async () => {
  try {
    const response = await fetch("https://shape-sepolia.g.alchemy.com/nft/v3/RJ-Ir6dl4t5uuC2nAy9ET/getNFTsForContract?contractAddress=0x53eEB3A7D3646735F779a539A52EC5E900D5a154&withMetadata=true&limit=100", {
      method: "GET",
      headers: {},
    });

    const body = await response.json();
    
    // Transform Alchemy NFT data to match our component structure
    const transformedNFTs = body.nfts?.map((nft) => {
      const colors = nft.raw?.metadata?.attributes
        ?.filter(attr => attr.trait_type && attr.trait_type.startsWith('Color'))
        ?.map(attr => attr.value) || [];

      return {
        id: nft.tokenId,
        title: nft.name || `${nft.contract.name} #${nft.tokenId}`,
        imageUrl: nft.image?.cachedUrl || nft.image?.thumbnailUrl || nft.image?.originalUrl || '',
        colors: colors,
        creator: nft.contract?.contractDeployer || '',
        description: nft.description || '',
        tokenId: nft.tokenId,
        contractAddress: nft.contract?.address || '',
        tokenUri: nft.tokenUri || '',
        lastUpdated: nft.timeLastUpdated || ''
      };
    }) || [];

    return transformedNFTs;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
};

export default function GalleryPage() {
  const [mounted, setMounted] = useState(false);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    const loadNFTs = async () => {
      setLoading(true);
      const nfts = await fetchNFTs();
      setArtworks(nfts);
      setLoading(false);
    };

    loadNFTs();
  }, []);

  const filteredAndSortedArtworks = artworks
    .filter(artwork => {
      if (filter === 'all') return true;
      if (filter === 'with-colors') return artwork.colors && artwork.colors.length > 0;
      if (filter === 'recent') return artwork.lastUpdated && new Date(artwork.lastUpdated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return parseInt(b.tokenId) - parseInt(a.tokenId);
      if (sortBy === 'oldest') return parseInt(a.tokenId) - parseInt(b.tokenId);
      if (sortBy === 'updated') return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      return 0;
    });

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
          <Link href="/gallery" className="relative text-white transition-colors duration-300 font-dotted py-2">
            Gallery
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full"></div>
          </Link>
          <Link href="/colors" className="relative text-slate-300 hover:text-white transition-colors duration-300 font-dotted py-2">
            My Colors
          </Link>
          <ConnectButton />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-dotted text-white mb-4">
            NFT
            <span className="bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent"> Gallery</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Explore PRISM NFTs with unique color combinations. Each NFT represents a unique blend of colors on the Shape network.
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="glass-dark border border-slate-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-slate-400 font-dotted"
            >
              <option value="all">All NFTs</option>
              <option value="with-colors">With Color Attributes</option>
              <option value="recent">Recently Updated</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-dark border border-slate-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-slate-400 font-dotted"
            >
              <option value="newest">Token ID: High to Low</option>
              <option value="oldest">Token ID: Low to High</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>
          
          <div className="text-slate-400 font-dotted">
            {filteredAndSortedArtworks.length} NFTs found
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-slate-400 text-xl font-dotted">Loading NFTs...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-slate-400 text-xl font-dotted">No NFTs found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="glass-dark rounded-2xl overflow-hidden hover:bg-slate-800/50 transition-all group cursor-pointer button-shadow"
                onClick={() => setSelectedArtwork(artwork)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold font-dotted text-white mb-2 group-hover:text-slate-300 transition-colors">
                    {artwork.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-slate-400 text-sm">Token ID:</span>
                    <span className="text-slate-300 text-sm font-mono">
                      #{artwork.tokenId}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-slate-400 text-sm">by</span>
                    <span className="text-slate-300 text-sm font-mono">
                      {artwork.creator.slice(0, 6)}...{artwork.creator.slice(-4)}
                    </span>
                  </div>
                  
                  {/* Color palette */}
                  {artwork.colors.length > 0 && (
                    <div className="flex space-x-1 mb-4">
                      {artwork.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border border-slate-600/30"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for artwork details */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-dark rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto button-shadow">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold font-dotted text-white">{selectedArtwork.title}</h2>
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    className="w-full aspect-square object-cover rounded-2xl"
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold font-dotted text-white mb-2">Token Details</h3>
                    <div className="glass-dark rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Token ID</span>
                        <span className="text-white font-mono">#{selectedArtwork.tokenId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Contract</span>
                        <span className="text-white font-mono text-sm">
                          {selectedArtwork.contractAddress?.slice(0, 6)}...{selectedArtwork.contractAddress?.slice(-4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold font-dotted text-white mb-2">Creator</h3>
                    <p className="text-slate-300 font-mono">{selectedArtwork.creator}</p>
                  </div>

                  {selectedArtwork.description && (
                    <div>
                      <h3 className="text-lg font-semibold font-dotted text-white mb-2">Description</h3>
                      <p className="text-slate-300">{selectedArtwork.description}</p>
                    </div>
                  )}
                  
                  {selectedArtwork.colors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold font-dotted text-white mb-2">Colors Used</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedArtwork.colors.map((color, index) => (
                          <div key={index} className="text-center">
                            <div
                              className="w-12 h-12 rounded-lg border border-slate-600/30 mx-auto mb-1"
                              style={{ backgroundColor: color }}
                            />
                            <p className="text-xs text-slate-400 font-mono">{color}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
