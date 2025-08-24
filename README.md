# Prism - AI Art Platform

> *Metaphor for colors combining into art.*

Prism is an AI-driven art platform built on BaseColors, where creativity flows through the spectrum of owned colors. Each artwork is generated from palettes of existing color NFTs, transforming simple shades into vibrant, unique art pieces.

## 🌈 Features

- **AI-Driven Art Generation**: Create unique artworks from color palettes using advanced AI
- **Color NFT Ownership**: Own colors on BaseColors and earn royalties when they're used in art
- **Automatic Royalty Distribution**: Earn passive income when your colors are used in new artworks
- **Living Licensing Model**: Your color ownership becomes a participatory licensing model
- **Beautiful UI**: Modern, responsive design with glassmorphism effects and smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shapecraft/client
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 How It Works

1. **Choose Colors**: Select colors using the color picker, generate random palettes, or pick from presets
2. **Generate Art**: Use AI to create unique artworks from your selected color palette
3. **Mint & Share**: Mint your artwork as an NFT with automatic royalty distribution to color owners
4. **Earn Royalties**: Color NFT owners earn passive income when their colors are used in new artworks

## 📱 Pages & Features

### Landing Page (`/`)
- Hero section with animated color orbs
- Feature showcase
- Call-to-action sections

### Create Page (`/create`)
- Advanced color picker with hex input, visual picker, and presets
- Random color generation
- AI art generation with custom prompts
- Real-time preview
- One-click minting

### Gallery Page (`/gallery`)
- Browse all generated artworks
- Filter by price and royalty rates
- Sort by newest, price (low to high), price (high to low)
- Detailed artwork modals
- Purchase functionality

### Colors Page (`/colors`)
- Portfolio management for owned color NFTs
- Earnings tracking and statistics
- Color marketplace for purchasing new colors
- ROI calculations

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Web3**: RainbowKit, Wagmi, Viem
- **Styling**: Tailwind CSS with custom gradients and animations
- **Icons**: Emoji-based for simplicity and universal support

## 🔧 Mock Functions

Currently, the app uses mock functions for:
- Smart contract interactions (`lib/mockApi.js`)
- AI art generation
- NFT minting
- Marketplace operations

These will be replaced with real implementations:
- Smart contracts for color NFTs and art minting
- AI art generation API integration
- IPFS for metadata storage

## 🎯 Key Components

### ColorPicker Component
- Supports hex input, visual color picker, and preset colors
- Color harmony suggestions
- Drag and drop functionality
- Maximum color limits
- Validation for hex codes

### Mock API Layer
- `mockSmartContract`: Simulates blockchain interactions
- `mockAIService`: Simulates AI art generation
- `mockMarketplace`: Simulates marketplace operations
- `utils`: Helper functions for colors and formatting

## 🎨 Design System

- **Colors**: Purple/pink gradient theme with glassmorphism
- **Typography**: Geist Sans for body text, Geist Mono for code
- **Animations**: Smooth transitions, hover effects, and loading states
- **Responsive**: Mobile-first design with Tailwind CSS breakpoints

## 📄 License

This project is part of the Shapecraft ecosystem and follows the project's licensing terms.

## 🚧 Development Status

This is a prototype/demo version with mock functionality. The following features are planned for production:

- [ ] Smart contract integration
- [ ] Real AI art generation API
- [ ] IPFS integration for metadata
- [ ] User authentication and profiles
- [ ] Advanced filtering and search
- [ ] Mobile app version
- [ ] Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

For major changes, please open an issue first to discuss what you would like to change.