# 🎨 Prism: Where Colors Become Art

*Metaphor for colors combining into art.*

[![Demo Video](https://img.shields.io/badge/Watch-Demo%20Video-blue?style=for-the-badge&logo=video)](https://cap.so/s/5pe31j5xww2v1yg)

**Built for the Shapecraft Hackathon** - Prism transforms color ownership into living art through AI generation and automatic royalty distribution.

## 🌟 Overview

Prism is a revolutionary Web3 platform that bridges AI art generation with NFT color ownership. Users can select color NFTs from BaseColors, generate unique AI artworks using those colors, and automatically distribute royalties to color owners when artworks are minted.

### 🎯 Core Concept

- **Color NFT Ownership**: Own specific colors as NFTs on the Base network
- **AI Art Generation**: Transform color palettes into unique digital artworks using OpenAI's latest models
- **Automatic Royalties**: Color owners earn ETH when their colors are used in new artworks
- **Living Licensing**: Color ownership becomes a participatory licensing model

## ✨ Key Features

### 🎨 AI-Driven Art Creation
- Select up to 5 colors from your owned NFT collection
- Generate unique artworks using OpenAI's GPT-4.1-mini with image generation
- Precise color matching using reference swatches
- Modern, digital art style optimized for NFT collections

### 🌈 Color NFT Integration
- Browse and purchase color NFTs from BaseColors marketplace
- Track your color portfolio with earnings analytics
- View usage statistics and ROI for each color
- Automatic royalty distribution to color owners

### 💰 Smart Contract Royalties
- **Mint Price**: 0.001 ETH per artwork
- **Royalty Distribution**: 0.0001 ETH per color owner (up to 5 colors)
- **Automatic Payouts**: Smart contract handles instant royalty distribution
- **Transparent Transactions**: All payments tracked on-chain

### 🖼️ NFT Gallery
- Explore all minted Prism artworks
- Filter by color attributes and creation date
- Detailed metadata and color attribution
- IPFS-hosted artwork and metadata

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15.5.0 with React 19
- **Styling**: Tailwind CSS 4 with custom glass morphism effects
- **Web3**: Wagmi + RainbowKit for wallet connectivity
- **Blockchain**: Shape Sepolia testnet integration

### Smart Contract
- **Contract**: ERC-721 NFT collection ("PRISM" - PRSM)
- **Network**: Shape Sepolia
- **Features**: 
  - Mint function with automatic royalty distribution
  - Owner-only minting with payment validation
  - IPFS metadata storage

### AI Integration
- **Model**: OpenAI GPT-4.1-mini with image generation
- **Color Precision**: Base64 color swatch references for exact color matching
- **Prompt Engineering**: Specialized prompts for digital art generation

### Infrastructure
- **IPFS**: Zora's IPFS uploader for decentralized storage
- **APIs**: Alchemy for NFT data and blockchain interactions
- **Metadata**: ERC-721 compliant with color attributes

## 🚀 Getting Started

### 1. Connect Your Wallet
- Click "Connect Wallet" in the navigation
- Select your preferred wallet provider
- Ensure you're on Shape Sepolia testnet

### 2. Browse Colors
- Visit "My Colors" to see owned color NFTs
- Use the "Marketplace" tab to purchase new colors
- Each color shows earning potential and usage statistics

### 3. Create Artwork
- Go to "Create" page
- Select up to 5 colors from your collection
- Click "Generate Artwork" to create AI art
- Preview your unique artwork

### 4. Mint NFT
- Click "Mint Artwork" (costs 0.001 ETH)
- Automatic royalty distribution to color owners
- Receive your NFT with IPFS metadata
- View transaction details and explorer links

### 5. Explore Gallery
- Browse all minted Prism artworks
- Filter by color attributes
- View detailed NFT information
- See color attribution and creator details

## 🔗 Contract Addresses

### Shape Sepolia Testnet
- **Prism Collection**: `0x53eEB3A7D3646735F779a539A52EC5E900D5a154`
- **Prism Wallet**: `0xB62E542B161DbcF5adA06ddb17815B13b63FeE0f`

### Base Mainnet (Color NFTs)
- **BaseColors Contract**: `0x7Bc1C072742D8391817EB4Eb2317F98dc72C61dB`

## 📊 Economics Model

### Revenue Flow
1. **User Payment**: 0.001 ETH to mint artwork
2. **Color Royalties**: 0.0001 ETH per color owner (max 5 colors = 0.0005 ETH)
3. **Platform Fee**: Remaining ETH goes to Prism treasury

### Color Owner Benefits
- **Passive Income**: Earn ETH when colors are used
- **Usage Tracking**: Monitor artwork creation with your colors
- **ROI Analytics**: Track return on color NFT investments
- **Participatory Licensing**: Your colors enable creative expression

## 🛠️ API Endpoints

### `/api/generate-artwork`
- **Method**: POST
- **Body**: `{ colors: string[] }`
- **Response**: AI-generated artwork with metadata

### `/api/relay`
- **Method**: POST  
- **Body**: `{ txHash: string, hexColors: string[], imageUrl: string }`
- **Response**: NFT minting result with royalty distribution

## 🔍 Code Structure

```
prism/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── create/            # Artwork creation page
│   ├── gallery/           # NFT gallery
│   ├── colors/            # Color management
│   └── page.js           # Landing page
├── components/            # React components
├── contracts/             # Smart contract
├── lib/                   # Utilities and constants
└── public/               # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Slate grays with gradient overlays
- **Accents**: Dynamic colors based on user selections
- **Effects**: Glass morphism, subtle animations, gradient backgrounds

### Typography
- **Font**: Geist Sans and Geist Mono
- **Styles**: Modern, clean, Web3-native aesthetic

## 🚧 Future Roadmap

- [ ] **Advanced AI Models**: Integrate more sophisticated art generation
- [ ] **Color Marketplace**: Direct color trading within Prism
- [ ] **Social Features**: Artist profiles and collection curation


*Prism: Where every color tells a story, and every artwork shares its success.*