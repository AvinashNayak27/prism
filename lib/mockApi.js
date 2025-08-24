// Mock API functions for Prism platform
// These will be replaced with real smart contract interactions later

export const mockSmartContract = {
  // Color NFT functions
  async purchaseColor(colorHex, price) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      tokenId: Math.floor(Math.random() * 10000),
      color: colorHex,
      price: price
    };
  },

  async getUserColors(address) {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Return mock user colors based on address
    return [
      {
        tokenId: 1001,
        color: "#ff6b6b",
        name: "Sunset Red",
        purchasePrice: "0.1 ETH",
        owner: address
      },
      {
        tokenId: 1002,
        color: "#4ecdc4",
        name: "Ocean Teal",
        purchasePrice: "0.08 ETH",
        owner: address
      }
    ];
  },

  async getColorRoyalties(tokenId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalEarned: (Math.random() * 0.5).toFixed(4) + " ETH",
      timesUsed: Math.floor(Math.random() * 50),
      lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
};

export const mockAIService = {
  async generateArt(colors, prompt = "", style = "abstract") {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    const artId = Math.random().toString(36).substr(2, 9);
    
    return {
      id: artId,
      title: prompt ? `${prompt} #${Math.floor(Math.random() * 1000)}` : `Generated Art #${Math.floor(Math.random() * 1000)}`,
      imageUrl: `https://picsum.photos/512/512?random=${artId}`,
      colors: colors,
      style: style,
      prompt: prompt,
      metadata: {
        resolution: "512x512",
        model: "PrismAI v2.1",
        seed: Math.floor(Math.random() * 1000000),
        steps: 50
      }
    };
  },

  async mintArtwork(artData, creatorAddress) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      tokenId: Math.floor(Math.random() * 100000),
      artworkId: artData.id,
      creator: creatorAddress,
      royaltyDistribution: artData.colors.map(color => ({
        color: color,
        owner: '0x' + Math.random().toString(16).substr(2, 40),
        percentage: 100 / artData.colors.length
      }))
    };
  }
};

export const mockMarketplace = {
  async listArtwork(tokenId, price) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      listingId: Math.floor(Math.random() * 10000),
      price: price,
      listedAt: new Date().toISOString()
    };
  },

  async purchaseArtwork(listingId, buyerAddress) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      buyer: buyerAddress,
      purchasePrice: (Math.random() * 2 + 0.1).toFixed(2) + " ETH",
      royaltiesPaid: (Math.random() * 0.1).toFixed(4) + " ETH"
    };
  },

  async getMarketplaceListings(filter = {}) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate mock listings
    const listings = [];
    for (let i = 0; i < 20; i++) {
      const colors = [];
      const numColors = Math.floor(Math.random() * 4) + 2;
      for (let j = 0; j < numColors; j++) {
        colors.push('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
      }
      
      listings.push({
        id: i + 1,
        title: `AI Artwork #${1000 + i}`,
        imageUrl: `https://picsum.photos/400/400?random=${i + 100}`,
        colors: colors,
        price: (Math.random() * 3 + 0.1).toFixed(2) + " ETH",
        creator: '0x' + Math.random().toString(16).substr(2, 40),
        royalties: Math.floor(Math.random() * 20) + 10,
        listedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    return listings;
  }
};

// Utility functions
export const utils = {
  generateRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  },

  generateRandomPalette(count = 5) {
    const palette = [];
    for (let i = 0; i < count; i++) {
      palette.push(this.generateRandomColor());
    }
    return palette;
  },

  isValidHexColor(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex);
  },

  formatAddress(address, chars = 4) {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  },

  formatEthAmount(amount) {
    return parseFloat(amount).toFixed(4) + ' ETH';
  },

  calculateRoyaltyDistribution(colors) {
    const basePercentage = 100 / colors.length;
    return colors.map(color => ({
      color: color,
      percentage: basePercentage,
      owner: '0x' + Math.random().toString(16).substr(2, 40) // Mock owner
    }));
  }
};
