/**
 * Premium FAQ Component
 * Ultra-realistic glassmorphism with advanced animations
 */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  ChevronDown, Wallet, MapPin, Trophy, Sparkles, Shield, Gift,
  User, Compass, Coins, BadgeCheck, HelpCircle, Rocket, Camera, Search
} from 'lucide-react';
import { HalloweenIcon } from '../../halloween/HalloweenIcons';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
  steps?: string[];
}

const faqData: FAQItem[] = [
  {
    id: 'start-1',
    category: 'Getting Started',
    question: 'How do I get started with TripX?',
    answer: 'TripX is an AI-powered travel planning platform with Web3 gamification. You can use basic features without logging in, but full experience requires creating an account.',
    icon: <Rocket className="w-5 h-5" />,
    steps: [
      'Visit the TripX homepage',
      'Click "Sign In" button in the top right corner',
      'Choose your login method: Email or Wallet',
      'Complete your profile and start planning trips!'
    ]
  },
  {
    id: 'start-2',
    category: 'Getting Started',
    question: 'How do I sign up with email?',
    answer: 'Email signup is the simplest way to get started. Just provide your email address and create a password.',
    icon: <User className="w-5 h-5" />,
    steps: [
      'Click "Sign In" in the navigation bar',
      'Select the "Email" tab',
      'Enter your email address',
      'Create a strong password (min. 8 characters)',
      'Click "Create Account" or "Sign In"',
      'Check your email and confirm your account (if new)'
    ]
  },
  {
    id: 'start-3',
    category: 'Getting Started',
    question: 'How do I connect my crypto wallet (MetaMask)?',
    answer: 'Connecting your wallet enables Web3 features: minting NFTs, claiming TPX tokens, and earning blockchain rewards.',
    icon: <Wallet className="w-5 h-5" />,
    steps: [
      'Install MetaMask (metamask.io) as a browser extension',
      'Create a new wallet or import an existing one',
      'Switch network to Sepolia Testnet in MetaMask',
      'On TripX, click "Connect Wallet"',
      'Select MetaMask from the wallet list',
      'Approve the connection in the MetaMask popup',
      'Done! Your wallet is now connected'
    ]
  },
  {
    id: 'start-4',
    category: 'Getting Started',
    question: 'How do I switch MetaMask to Sepolia network?',
    answer: 'TripX runs on the Sepolia testnet. You need to switch MetaMask to this network to use blockchain features.',
    icon: <Shield className="w-5 h-5" />,
    steps: [
      'Open MetaMask extension',
      'Click on the network name at the top (e.g., "Ethereum Mainnet")',
      'Enable "Show test networks" in settings',
      'Select "Sepolia" from the network list',
      'If Sepolia is not visible, add it manually:',
      '  • Network Name: Sepolia',
      '  • RPC URL: https://sepolia.infura.io/v3/YOUR_KEY',
      '  • Chain ID: 11155111',
      '  • Symbol: ETH'
    ]
  },
  {
    id: 'trip-1',
    category: 'Trip Planning',
    question: 'How do I create a new trip with AI?',
    answer: 'Our AI generator (Google Gemini 2.5 Pro) creates personalized travel itineraries based on your preferences.',
    icon: <Sparkles className="w-5 h-5" />,
    steps: [
      'Navigate to "Create Trip" in the menu',
      'Enter your destination (e.g., "Transylvania, Romania")',
      'Select start and end dates',
      'Set your budget level (Low/Medium/High/Luxury)',
      'Check your interests (Food, Culture, Nature, Nightlife)',
      'Click "Generate Trip" and wait for AI magic',
      'Browse the generated day-by-day itinerary',
      'Save your trip by clicking "Save Trip"'
    ]
  },
  {
    id: 'trip-2',
    category: 'Trip Planning',
    question: 'How do I view my saved trips?',
    answer: 'All your saved trips are available in the "My Trips" section.',
    icon: <Compass className="w-5 h-5" />,
    steps: [
      'Click "My Trips" in the sidebar menu',
      'You will see a list of all saved trips',
      'Click on any trip to view details',
      'You can edit, delete, or share your trips'
    ]
  },
  {
    id: 'spooky-1',
    category: 'Spooky Destinations',
    question: 'What are Spooky Destinations?',
    answer: 'Spooky Destinations is a curated collection of 19 most haunted places worldwide. Each has a unique "spookiness" rating and special Halloween quests.',
    icon: <HalloweenIcon name="ghost" className="w-5 h-5" />,
    steps: [
      'Navigate to "Spooky Destinations" in the menu',
      'Browse the interactive map with haunted locations',
      'Click on any marker to see details',
      'Check the spookiness rating (1-5 skulls)',
      'Mark places as "visited" after your visit',
      'Earn badges for visiting spooky places!'
    ]
  },
  {
    id: 'spooky-2',
    category: 'Spooky Destinations',
    question: 'How do I mark a place as visited?',
    answer: 'After visiting a spooky destination, you can mark it to earn points and badges.',
    icon: <MapPin className="w-5 h-5" />,
    steps: [
      'Find the location in Spooky Destinations list',
      'Click the "Mark as Visited" button',
      'System will verify your GPS location',
      'After verification, you receive XP points',
      'Visit 3+ places to earn the "Ghost Hunter" badge'
    ]
  },
  {
    id: 'quest-1',
    category: 'Quests & Challenges',
    question: 'How do quests work?',
    answer: 'Quests are location-based challenges you can complete during your travels. Completing them rewards you with XP, TPX tokens, and badges.',
    icon: <Trophy className="w-5 h-5" />,
    steps: [
      'Navigate to "Quests" in the menu',
      'Browse available quests',
      'Select a quest and click "Start Quest"',
      'Travel to the specified location',
      'Complete the task (e.g., take a photo)',
      'Submit your proof of completion',
      'Claim your rewards!'
    ]
  },
  {
    id: 'quest-2',
    category: 'Quests & Challenges',
    question: 'How do I verify quest completion with a photo?',
    answer: 'Some quests require photo verification. Our AI checks if your photo matches the quest requirements.',
    icon: <Camera className="w-5 h-5" />,
    steps: [
      'Start a quest that requires photo verification',
      'Travel to the specified location',
      'Take a photo matching the quest requirements',
      'Click "Upload Photo" in quest details',
      'Select photo from gallery or take a new one',
      'Wait for AI verification',
      'If photo is valid, quest will be completed'
    ]
  },
  {
    id: 'web3-1',
    category: 'Web3 & Rewards',
    question: 'How do I claim TPX tokens?',
    answer: 'TPX tokens are rewards for completed trips and quests. You can claim them after connecting your wallet.',
    icon: <Coins className="w-5 h-5" />,
    steps: [
      'Make sure your wallet is connected',
      'Navigate to your Profile page',
      'Find the "Pending Rewards" section',
      'Click "Claim TPX Tokens"',
      'Approve the transaction in MetaMask',
      'Wait for confirmation (~15 seconds)',
      'Tokens will appear in your wallet!'
    ]
  },
  {
    id: 'web3-2',
    category: 'Web3 & Rewards',
    question: 'How do I mint my NFT Passport?',
    answer: 'NFT Passport is your unique traveler identity on the blockchain. It contains your level, stats, and achievements.',
    icon: <BadgeCheck className="w-5 h-5" />,
    steps: [
      'Connect your MetaMask wallet',
      'Navigate to "Profile" section',
      'Find the "NFT Passport" card',
      'Click "Mint NFT Passport"',
      'Approve the transaction in MetaMask (gas fee required)',
      'Wait for transaction confirmation',
      'Your NFT Passport is ready!',
      'View it on OpenSea (Sepolia testnet)'
    ]
  },
  {
    id: 'web3-3',
    category: 'Web3 & Rewards',
    question: 'How do I add TPX token to MetaMask?',
    answer: 'To see your TPX balance in MetaMask, you need to add the token manually.',
    icon: <Wallet className="w-5 h-5" />,
    steps: [
      'Open MetaMask extension',
      'Go to the "Tokens" tab',
      'Click "Import tokens"',
      'Paste the TPX contract address:',
      '  0x6A19B0E01cB227B9fcc7eD95b8f13D2894d63Ffd',
      'Symbol: TPX, Decimals: 18',
      'Click "Add Custom Token"',
      'Now you can see TPX balance in your wallet!'
    ]
  },
  {
    id: 'web3-4',
    category: 'Web3 & Rewards',
    question: 'Where can I get test ETH for Sepolia?',
    answer: 'For transactions on Sepolia, you need test ETH (for gas fees). You can get it for free from faucets.',
    icon: <Gift className="w-5 h-5" />,
    steps: [
      'Copy your wallet address from MetaMask',
      'Visit one of these faucets:',
      '  • sepoliafaucet.com',
      '  • alchemy.com/faucets/ethereum-sepolia',
      '  • infura.io/faucet/sepolia',
      'Paste your wallet address',
      'Complete the captcha and click "Send"',
      'Wait a few minutes for ETH to arrive',
      'Check your balance in MetaMask'
    ]
  },
  {
    id: 'badge-1',
    category: 'Badges & Achievements',
    question: 'How do I earn Halloween badges?',
    answer: 'Halloween badges are special achievements you earn by completing various activities in TripX.',
    icon: <HalloweenIcon name="pumpkin" className="w-5 h-5" />,
    steps: [
      'Ghost Hunter: Visit 3+ spooky destinations',
      'Pumpkin Master: Complete 5+ Halloween quests',
      'Candy Collector: Earn 1000+ TPX tokens',
      "Witch's Apprentice: Create 3+ AI-generated trips",
      'Vampire Voyager: Visit Transylvania',
      'Night Owl: Complete a quest after midnight',
      'Check your badges in the Profile section'
    ]
  },
  {
    id: 'badge-2',
    category: 'Badges & Achievements',
    question: 'How does the XP and leveling system work?',
    answer: 'You earn XP (experience points) for various activities. As you level up, you unlock new features and rewards.',
    icon: <Trophy className="w-5 h-5" />,
    steps: [
      'Creating a trip: +50 XP',
      'Completing a quest: +100-500 XP',
      'Visiting spooky destination: +200 XP',
      'Earning a badge: +300 XP',
      'Daily login streak: +25 XP per day',
      'Level thresholds: 0, 500, 1500, 3000, 5000...',
      'Higher levels unlock exclusive quests and rewards'
    ]
  },
  {
    id: 'leader-1',
    category: 'Leaderboard',
    question: 'How does the leaderboard work?',
    answer: 'The leaderboard ranks travelers worldwide based on XP, achievements, and Halloween activities.',
    icon: <Trophy className="w-5 h-5" />,
    steps: [
      'Navigate to "Leaderboard" in the menu',
      'View global rankings by total XP',
      'Check seasonal Halloween rankings',
      'See top badge collectors',
      'Your rank updates in real-time',
      'Compete with friends and other travelers!'
    ]
  },
  {
    id: 'trouble-1',
    category: 'Troubleshooting',
    question: "My wallet won't connect. What should I do?",
    answer: 'Wallet connection issues are usually caused by network or browser settings.',
    icon: <HelpCircle className="w-5 h-5" />,
    steps: [
      'Make sure MetaMask is installed and unlocked',
      "Check if you're on Sepolia network",
      'Try refreshing the page',
      'Clear browser cache and cookies',
      'Disable other wallet extensions temporarily',
      'Try a different browser (Chrome recommended)',
      'If issues persist, disconnect and reconnect wallet'
    ]
  },
  {
    id: 'trouble-2',
    category: 'Troubleshooting',
    question: 'Transaction failed. What went wrong?',
    answer: "Failed transactions can happen for several reasons. Here's how to troubleshoot.",
    icon: <Shield className="w-5 h-5" />,
    steps: [
      'Check if you have enough Sepolia ETH for gas',
      "Make sure you're on the correct network (Sepolia)",
      'Wait a few minutes and try again',
      'Check Sepolia network status (may be congested)',
      'Try increasing gas limit in MetaMask',
      'If stuck, reset MetaMask account in settings',
      'Contact support if issues persist'
    ]
  }
];

const categories = [...new Set(faqData.map(item => item.category))];

// Premium 3D Glass Card with mouse tracking
const Premium3DCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  glowColor?: string;
}> = ({ children, className = '', glowColor = 'rgba(255, 107, 53, 0.4)' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {/* Outer glow */}
      <div 
        className="absolute -inset-1 rounded-2xl opacity-50 blur-xl transition-opacity duration-500"
        style={{ background: glowColor }}
      />
      
      {/* Main glass container */}
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 50%,
              rgba(255, 255, 255, 0.02) 100%
            )
          `,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.37),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
          `
        }}
      >
        {/* Top highlight reflection */}
        <div 
          className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
            borderRadius: 'inherit'
          }}
        />
        
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
              'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
            ],
            backgroundPosition: ['-200% 0', '200% 0'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut'
          }}
          style={{ backgroundSize: '200% 100%' }}
        />
        
        {children}
      </div>
    </motion.div>
  );
};

// Animated glowing icon container
const GlowingIcon: React.FC<{ children: React.ReactNode; color?: string }> = ({ 
  children, 
  color = '#ff6b35' 
}) => (
  <motion.div
    className="relative p-3 rounded-xl"
    whileHover={{ scale: 1.1 }}
    style={{
      background: `linear-gradient(145deg, ${color}40 0%, ${color}20 100%)`,
      boxShadow: `
        0 0 30px ${color}50,
        0 0 60px ${color}20,
        inset 0 1px 1px rgba(255,255,255,0.3),
        inset 0 -1px 1px rgba(0,0,0,0.2)
      `,
      border: '1px solid rgba(255,255,255,0.15)'
    }}
  >
    {/* Pulsing glow */}
    <motion.div
      className="absolute inset-0 rounded-xl"
      animate={{
        boxShadow: [
          `0 0 20px ${color}30`,
          `0 0 40px ${color}50`,
          `0 0 20px ${color}30`,
        ]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div className="relative" style={{ color, filter: `drop-shadow(0 0 8px ${color})` }}>
      {children}
    </div>
  </motion.div>
);

// Premium step indicator with glow
const PremiumStepNumber: React.FC<{ number: number }> = ({ number }) => (
  <motion.div
    className="relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
    whileHover={{ scale: 1.15 }}
    style={{
      background: 'linear-gradient(145deg, rgba(255,107,53,0.5) 0%, rgba(255,149,0,0.3) 100%)',
      boxShadow: `
        0 0 20px rgba(255,107,53,0.5),
        0 0 40px rgba(255,107,53,0.2),
        inset 0 2px 4px rgba(255,255,255,0.3),
        inset 0 -2px 4px rgba(0,0,0,0.2)
      `,
      border: '1px solid rgba(255,255,255,0.2)'
    }}
  >
    {/* Inner glow */}
    <div 
      className="absolute inset-1 rounded-full"
      style={{
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 70%)'
      }}
    />
    <span 
      className="relative font-bold text-sm"
      style={{ 
        color: '#ff6b35',
        textShadow: '0 0 10px rgba(255,107,53,0.8)'
      }}
    >
      {number}
    </span>
  </motion.div>
);

// Premium FAQ Accordion Item
const FAQAccordionItem: React.FC<{ 
  item: FAQItem; 
  isOpen: boolean; 
  onToggle: () => void;
  index: number;
}> = ({ item, isOpen, onToggle, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Premium3DCard glowColor={isOpen ? 'rgba(255, 107, 53, 0.3)' : 'rgba(255, 255, 255, 0.1)'}>
        <motion.button
          onClick={onToggle}
          className="w-full px-6 py-5 flex items-center justify-between text-left group"
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-4">
            <GlowingIcon>{item.icon}</GlowingIcon>
            <span 
              className="text-lg font-medium"
              style={{ 
                color: '#f0e6ff',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              {item.question}
            </span>
          </div>
          
          <motion.div
            animate={{ 
              rotate: isOpen ? 180 : 0,
              scale: isOpen ? 1.2 : 1
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="p-2 rounded-full"
            style={{
              background: isOpen 
                ? 'linear-gradient(145deg, rgba(255,107,53,0.3) 0%, rgba(255,107,53,0.1) 100%)'
                : 'rgba(255,255,255,0.05)',
              boxShadow: isOpen 
                ? '0 0 20px rgba(255,107,53,0.4)' 
                : 'none'
            }}
          >
            <ChevronDown 
              className="w-5 h-5" 
              style={{ 
                color: isOpen ? '#ff6b35' : 'rgba(240,230,255,0.6)',
                filter: isOpen ? 'drop-shadow(0 0 8px rgba(255,107,53,0.8))' : 'none'
              }} 
            />
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div 
                className="px-6 pb-6 pt-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
              >
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-5 leading-relaxed"
                  style={{ color: 'rgba(240,230,255,0.8)' }}
                >
                  {item.answer}
                </motion.p>
                
                {item.steps && item.steps.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-5 rounded-xl relative overflow-hidden"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          rgba(255,107,53,0.1) 0%, 
                          rgba(26,10,46,0.8) 50%,
                          rgba(255,107,53,0.05) 100%
                        )
                      `,
                      boxShadow: `
                        inset 0 1px 1px rgba(255,255,255,0.1),
                        inset 0 0 30px rgba(255,107,53,0.05),
                        0 4px 20px rgba(0,0,0,0.3)
                      `,
                      border: '1px solid rgba(255,107,53,0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {/* Animated border glow */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          'inset 0 0 20px rgba(255,107,53,0.1)',
                          'inset 0 0 40px rgba(255,107,53,0.2)',
                          'inset 0 0 20px rgba(255,107,53,0.1)',
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    
                    <h4 
                      className="text-sm font-semibold mb-4 flex items-center gap-2"
                      style={{ color: '#ff6b35', textShadow: '0 0 15px rgba(255,107,53,0.5)' }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Step-by-step guide:
                    </h4>
                    
                    <ol className="space-y-3 relative">
                      {item.steps.map((step, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          {step.startsWith('  ') ? (
                            <span 
                              className="ml-11 text-sm"
                              style={{ color: 'rgba(240,230,255,0.6)' }}
                            >
                              {step.trim()}
                            </span>
                          ) : (
                            <>
                              <PremiumStepNumber number={idx + 1} />
                              <span 
                                className="text-sm leading-relaxed pt-1.5"
                                style={{ color: 'rgba(240,230,255,0.85)' }}
                              >
                                {step}
                              </span>
                            </>
                          )}
                        </motion.li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Premium3DCard>
    </motion.div>
  );
};

// Premium Category Button
const CategoryButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}> = ({ label, isActive, onClick, count }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="relative px-5 py-2.5 rounded-full text-sm font-medium overflow-hidden"
    style={isActive ? {
      background: 'linear-gradient(145deg, rgba(255,107,53,0.9) 0%, rgba(255,149,0,0.8) 100%)',
      boxShadow: `
        0 0 30px rgba(255,107,53,0.6),
        0 0 60px rgba(255,107,53,0.3),
        inset 0 2px 4px rgba(255,255,255,0.3),
        inset 0 -2px 4px rgba(0,0,0,0.2),
        0 4px 15px rgba(0,0,0,0.3)
      `,
      border: '1px solid rgba(255,255,255,0.3)',
      color: 'white',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    } : {
      background: 'rgba(255,255,255,0.05)',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 15px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: 'rgba(240,230,255,0.7)',
      backdropFilter: 'blur(10px)'
    }}
  >
    {/* Shimmer effect on active */}
    {isActive && (
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: [
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          ],
          x: ['-100%', '100%'],
        }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      />
    )}
    
    {/* Glass reflection */}
    <div 
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)'
      }}
    />
    
    <span className="relative flex items-center gap-2">
      {label}
      {count !== undefined && (
        <span 
          className="px-1.5 py-0.5 rounded-full text-xs"
          style={{
            background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,107,53,0.3)',
            color: isActive ? 'white' : '#ff6b35'
          }}
        >
          {count}
        </span>
      )}
    </span>
  </motion.button>
);

// Main FAQ Component
export const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const expandAll = () => setOpenItems(new Set(filteredFAQ.map(item => item.id)));
  const collapseAll = () => setOpenItems(new Set());

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(255,107,53,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(57,255,20,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.1) 0%, transparent 60%),
            linear-gradient(180deg, #1a0a2e 0%, #0d1b2a 50%, #1a0a2e 100%)
          `
        }}
      />
      
      {/* Floating orbs */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          top: '10%',
          left: '5%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <motion.div
        className="fixed w-80 h-80 rounded-full pointer-events-none"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          bottom: '20%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(57,255,20,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <motion.div 
            className="flex items-center justify-center gap-4 mb-6"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <HalloweenIcon 
                name="ghost" 
                className="w-12 h-12 text-bloodOrange drop-shadow-[0_0_20px_rgba(255,107,53,0.6)]"
              />
            </motion.div>
            
            <h1 
              className="text-5xl md:text-6xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #f0e6ff 0%, #ff6b35 50%, #ff9500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 60px rgba(255,107,53,0.3)'
              }}
            >
              FAQ & Help
            </h1>
            
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <HalloweenIcon 
                name="pumpkin" 
                className="w-12 h-12 text-pumpkinOrange drop-shadow-[0_0_20px_rgba(255,149,0,0.6)]"
              />
            </motion.div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'rgba(240,230,255,0.7)' }}
          >
            Everything you need to know about TripX — from getting started to claiming your blockchain rewards.
          </motion.p>
        </motion.div>

        {/* Premium Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div 
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.05)',
              boxShadow: `
                0 0 40px rgba(255,107,53,0.1),
                inset 0 1px 1px rgba(255,255,255,0.1),
                0 8px 32px rgba(0,0,0,0.3)
              `,
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Glass reflection */}
            <div 
              className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
              }}
            />
            
            <div className="relative flex items-center">
              <Search 
                className="absolute left-5 w-5 h-5" 
                style={{ color: 'rgba(240,230,255,0.4)' }} 
              />
              <input
                type="text"
                placeholder="Search FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-transparent text-lg outline-none"
                style={{ 
                  color: '#f0e6ff',
                  caretColor: '#ff6b35'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <CategoryButton
              label="All Topics"
              isActive={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              count={faqData.length}
            />
            {categories.map(category => (
              <CategoryButton
                key={category}
                label={category}
                isActive={activeCategory === category}
                onClick={() => {
                  setActiveCategory(category);
                  setTimeout(() => {
                    const element = document.getElementById(`faq-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                count={faqData.filter(item => item.category === category).length}
              />
            ))}
          </div>
        </motion.div>

        {/* Expand/Collapse Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, color: '#ff6b35' }}
            onClick={expandAll}
            className="text-sm transition-colors"
            style={{ color: 'rgba(240,230,255,0.6)' }}
          >
            Expand All
          </motion.button>
          <span style={{ color: 'rgba(240,230,255,0.3)' }}>|</span>
          <motion.button
            whileHover={{ scale: 1.05, color: '#ff6b35' }}
            onClick={collapseAll}
            className="text-sm transition-colors"
            style={{ color: 'rgba(240,230,255,0.6)' }}
          >
            Collapse All
          </motion.button>
        </motion.div>

        {/* FAQ Items - Grouped by Category */}
        <div className="space-y-12">
          {filteredFAQ.length > 0 ? (
            // Group items by category
            categories
              .filter(cat => activeCategory === 'all' || cat === activeCategory)
              .filter(cat => filteredFAQ.some(item => item.category === cat))
              .map((category, catIndex) => {
                const categoryItems = filteredFAQ.filter(item => item.category === category);
                const categoryIcons: Record<string, React.ReactNode> = {
                  'Getting Started': <Rocket className="w-6 h-6" />,
                  'Trip Planning': <Compass className="w-6 h-6" />,
                  'Spooky Destinations': <HalloweenIcon name="ghost" className="w-6 h-6" />,
                  'Quests & Challenges': <Trophy className="w-6 h-6" />,
                  'Web3 & Rewards': <Coins className="w-6 h-6" />,
                  'Badges & Achievements': <HalloweenIcon name="pumpkin" className="w-6 h-6" />,
                  'Leaderboard': <Trophy className="w-6 h-6" />,
                  'Troubleshooting': <HelpCircle className="w-6 h-6" />
                };
                const categoryColors: Record<string, string> = {
                  'Getting Started': '#ff6b35',
                  'Trip Planning': '#ff9500',
                  'Spooky Destinations': '#a855f7',
                  'Quests & Challenges': '#f59e0b',
                  'Web3 & Rewards': '#39ff14',
                  'Badges & Achievements': '#ff6b35',
                  'Leaderboard': '#3b82f6',
                  'Troubleshooting': '#ef4444'
                };
                const color = categoryColors[category] || '#ff6b35';
                
                return (
                  <motion.div
                    key={category}
                    id={`faq-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIndex * 0.1 }}
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className="p-3 rounded-xl"
                        style={{
                          background: `linear-gradient(145deg, ${color}40 0%, ${color}20 100%)`,
                          boxShadow: `0 0 25px ${color}40, inset 0 1px 2px rgba(255,255,255,0.2)`,
                          border: '1px solid rgba(255,255,255,0.15)'
                        }}
                      >
                        <div style={{ color, filter: `drop-shadow(0 0 8px ${color})` }}>
                          {categoryIcons[category] || <HelpCircle className="w-6 h-6" />}
                        </div>
                      </div>
                      <div>
                        <h2 
                          className="text-2xl font-bold"
                          style={{ 
                            color: '#f0e6ff',
                            textShadow: `0 0 30px ${color}40`
                          }}
                        >
                          {category}
                        </h2>
                        <p className="text-sm" style={{ color: 'rgba(240,230,255,0.5)' }}>
                          {categoryItems.length} question{categoryItems.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    {/* Category Items */}
                    <div className="space-y-4 pl-2 border-l-2" style={{ borderColor: `${color}30` }}>
                      {categoryItems.map((item, index) => (
                        <FAQAccordionItem
                          key={item.id}
                          item={item}
                          isOpen={openItems.has(item.id)}
                          onToggle={() => toggleItem(item.id)}
                          index={index}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <HalloweenIcon 
                name="ghost" 
                className="w-20 h-20 mx-auto mb-6 text-ghostlyWhite/20 drop-shadow-[0_0_20px_rgba(240,230,255,0.1)]"
              />
              <p className="text-xl" style={{ color: 'rgba(240,230,255,0.6)' }}>
                No results found for "{searchQuery}"
              </p>
              <p className="text-sm mt-2" style={{ color: 'rgba(240,230,255,0.4)' }}>
                Try a different search term
              </p>
            </motion.div>
          )}
        </div>

        {/* Quick Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          {/* Premium Section Header */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full mb-4"
              style={{
                background: 'linear-gradient(145deg, rgba(255,107,53,0.2) 0%, rgba(255,107,53,0.05) 100%)',
                border: '1px solid rgba(255,107,53,0.3)',
                boxShadow: '0 0 30px rgba(255,107,53,0.2)'
              }}
            >
              <Sparkles className="w-5 h-5 text-bloodOrange" />
              <span className="text-sm font-medium text-bloodOrange">Jump to Section</span>
            </motion.div>
            <h2 
              className="text-4xl font-bold"
              style={{
                color: '#f0e6ff',
                textShadow: '0 0 40px rgba(255,107,53,0.4), 0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              Quick Links
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: <Rocket className="w-8 h-8" />, 
                title: 'Getting Started', 
                desc: 'New to TripX? Start here!', 
                color: '#ff6b35',
                category: 'Getting Started'
              },
              { 
                icon: <Wallet className="w-8 h-8" />, 
                title: 'Web3 & Rewards', 
                desc: 'Connect wallet & earn rewards', 
                color: '#39ff14',
                category: 'Web3 & Rewards'
              },
              { 
                icon: <HelpCircle className="w-8 h-8" />, 
                title: 'Troubleshooting', 
                desc: 'Fix common issues', 
                color: '#ef4444',
                category: 'Troubleshooting'
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => {
                  setActiveCategory(card.category);
                  const element = document.getElementById(`faq-${card.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <Premium3DCard glowColor={`${card.color}40`}>
                  <div className="p-8 text-center">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      style={{
                        background: `linear-gradient(145deg, ${card.color}50 0%, ${card.color}20 100%)`,
                        boxShadow: `0 0 30px ${card.color}50, inset 0 2px 4px rgba(255,255,255,0.3)`,
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <div style={{ color: card.color, filter: `drop-shadow(0 0 10px ${card.color})` }}>
                        {card.icon}
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#f0e6ff' }}>
                      {card.title}
                    </h3>
                    <p className="mb-3" style={{ color: 'rgba(240,230,255,0.6)' }}>{card.desc}</p>
                    <div 
                      className="inline-flex items-center gap-2 text-sm font-medium"
                      style={{ color: card.color }}
                    >
                      <span>View section</span>
                      <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                    </div>
                  </div>
                </Premium3DCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contract Addresses */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Premium3DCard glowColor="rgba(57, 255, 20, 0.2)">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <GlowingIcon color="#39ff14">
                  <Shield className="w-6 h-6" />
                </GlowingIcon>
                <h3 className="text-xl font-semibold" style={{ color: '#f0e6ff' }}>
                  Smart Contract Addresses (Sepolia Testnet)
                </h3>
              </div>
              
              <div className="space-y-4 font-mono text-sm">
                {[
                  { label: 'TPX Token', address: '0x6A19B0E01cB227B9fcc7eD95b8f13D2894d63Ffd' },
                  { label: 'NFT Passport', address: '0xFc22556bb4ae5740610bE43457d46AdA5200b994' },
                  { label: 'Achievement NFT', address: '0x110D62545d416d3DFEfA12D0298aBf197CF0e828' }
                ].map((contract, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <span 
                      className="min-w-[140px] font-medium"
                      style={{ color: 'rgba(240,230,255,0.7)' }}
                    >
                      {contract.label}:
                    </span>
                    <code 
                      className="px-4 py-2 rounded-lg break-all"
                      style={{
                        background: 'linear-gradient(145deg, rgba(57,255,20,0.15) 0%, rgba(57,255,20,0.05) 100%)',
                        color: '#39ff14',
                        textShadow: '0 0 15px rgba(57,255,20,0.6)',
                        border: '1px solid rgba(57,255,20,0.3)',
                        boxShadow: '0 0 20px rgba(57,255,20,0.2)'
                      }}
                    >
                      {contract.address}
                    </code>
                  </motion.div>
                ))}
              </div>
            </div>
          </Premium3DCard>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
