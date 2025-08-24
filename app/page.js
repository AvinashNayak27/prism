"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      title: "AI-Driven Art",
      description: "Generate unique artworks from your color palette using advanced AI",
      icon: "🎨"
    },
    {
      title: "Color NFT Ownership",
      description: "Own colors on BaseColors and earn royalties when they're used in art",
      icon: "🌈"
    },
    {
      title: "Automatic Royalties",
      description: "Earn passive income when your colors are used in new artworks",
      icon: "💰"
    },
    {
      title: "Living Licensing",
      description: "Your color ownership becomes a participatory licensing model",
      icon: "⚡"
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <img src="/icon.png" alt="Prism" className="w-12 h-12 rounded-lg" />
          <span className="text-2xl font-bold font-dotted text-white">Prism</span>
        </div>
        <div className="flex items-center space-x-8">
          <Link href="/create" className="relative text-slate-300 hover:text-white transition-colors duration-300 font-dotted py-2">
            Create
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 glass-dark rounded-full px-4 py-2 text-slate-300 text-sm font-dotted">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
              <span>Built on BaseColors</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold font-dotted text-white mb-6 leading-tight">
            Where Colors
            <br />
            <span className="bg-gradient-to-r from-slate-200 via-white to-slate-400 bg-clip-text text-transparent">
              Become Art
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Prism transforms color ownership into living art. Generate unique AI artworks from your color NFTs 
            and earn royalties every time your hues bring new creations to life.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/create"
              className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white px-8 py-4 rounded-full font-semibold font-dotted text-lg transition-all button-shadow"
            >
              Start Creating
            </Link>
            <Link 
              href="/gallery"
              className="glass-dark hover:bg-slate-800/50 text-white px-8 py-4 rounded-full font-semibold font-dotted text-lg transition-all button-shadow"
            >
              Explore Gallery
            </Link>
          </div>
        </div>

        {/* Floating Color Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-slate-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-slate-600/10 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-slate-400/10 rounded-full blur-xl animate-pulse delay-3000"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-dotted text-white mb-4">
            The Future of Color Ownership
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Experience the revolutionary intersection of AI art generation and NFT color ownership
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-dark rounded-2xl p-6 hover:bg-slate-800/50 transition-all group button-shadow"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold font-dotted text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm rounded-3xl p-12 text-center border border-slate-600/20 button-shadow">
          <h2 className="text-4xl font-bold font-dotted text-white mb-4">
            Ready to Paint with Purpose?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join the creative revolution where every color tells a story and every artwork shares its success.
          </p>
          <Link 
            href="/create"
            className="bg-gradient-to-r from-slate-700 to-black hover:from-slate-600 hover:to-slate-900 text-white px-10 py-5 rounded-full font-semibold font-dotted text-xl transition-all button-shadow inline-block"
          >
            Begin Your Journey
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src="/icon.png" alt="Prism" className="w-8 h-8 rounded" />
            <span className="text-xl font-bold font-dotted text-white">Prism</span>
          </div>
          <p className="text-slate-400">
            Metaphor for colors combining into art.
          </p>
        </div>
      </footer>
    </div>
  );
}
