/**
 * SpookyDestinations Page
 * 
 * Browse and explore Halloween-themed spooky destinations with quests, NFT rewards, XP and TPX.
 * Requirements: 16.1, 16.2, 16.3, 16.5
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SpookyDestinationCard } from '../../halloween/SpookyDestinationCard';
import { HalloweenLoader } from '../../halloween/HalloweenLoader';
import { HalloweenCelebration } from '../../halloween/HalloweenCelebration';
import { SpookyButton } from '../../halloween/SpookyButton';
import { HalloweenIcon } from '../../halloween/HalloweenIcons';
import * as spookyDestinationService from '../../../services/spookyDestinationService';
import * as spookyQuestService from '../../../services/spookyDestinationQuestService';
import * as halloweenBadgeService from '../../../services/halloweenBadgeService';
import { SpookyDestination, SpookyDestinationQuest } from '../../../types/halloween';
import { useWalletAuth } from '../../../hooks/useWalletAuth';
import { useEmailAuth } from '../../../hooks/useEmailAuth';
import { toast } from 'sonner';
import { 
  Filter, MapPin, Skull, Trophy, Coins,
  Camera, CheckCircle2, Gift, ExternalLink, X,
  Sparkles, Zap, ArrowRight
} from 'lucide-react';
import { SpookyMapbox } from '../../halloween/SpookyMapbox';
import { SpookyPhotoVerificationModal } from '../../halloween/SpookyPhotoVerificationModal';

interface SpookyDestinationsProps {
  onNavigate?: (page: string) => void;
}

export const SpookyDestinations: React.FC<SpookyDestinationsProps> = ({ onNavigate }) => {
  const { user: walletUser, address } = useWalletAuth();
  const { user: emailUser } = useEmailAuth();
  const user = walletUser || emailUser;

  const [destinations, setDestinations] = useState<SpookyDestination[]>([]);
  const [quests, setQuests] = useState<SpookyDestinationQuest[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<SpookyDestination[]>([]);
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [spookinessFilter, setSpookinessFilter] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'quest' | 'badge' | 'achievement'>('quest');
  const [selectedDestination, setSelectedDestination] = useState<SpookyDestination | null>(null);
  const [claimingRewards, setClaimingRewards] = useState<string | null>(null);
  const [verificationDestination, setVerificationDestination] = useState<SpookyDestination | null>(null);

  // Set current user for per-user storage (quests and visited destinations)
  useEffect(() => {
    const userId = user?.id || null;
    spookyQuestService.setCurrentUser(userId);
    // Also set for halloweenStorage (visited destinations, badges, progress)
    import('../../../services/halloweenStorageService').then(storage => {
      storage.setCurrentUser(userId);
    });
    
    // Sync quests from Supabase when user logs in
    if (userId) {
      spookyQuestService.syncQuestsFromSupabase().then(() => {
        loadDestinations();
      });
    }
  }, [user?.id]);

  useEffect(() => {
    // Only load if not already loading from sync
    if (!user?.id) {
      loadDestinations();
    }
  }, []); // Initial load for anonymous users

  useEffect(() => {
    applyFilters();
  }, [destinations, spookinessFilter]);

  const loadDestinations = () => {
    setLoading(true);
    try {
      const allDestinations = spookyDestinationService.getSpookyDestinations();
      const visited = spookyDestinationService.getVisitedDestinations();
      const allQuests = spookyQuestService.getAllSpookyQuests();
      
      setDestinations(allDestinations);
      setVisitedIds(visited.map(d => d.id));
      setQuests(allQuests);
    } catch (error) {
      console.error('Error loading destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...destinations];

    if (spookinessFilter > 0) {
      filtered = filtered.filter(d => d.spookinessRating >= spookinessFilter);
    }

    // Sort by spookiness rating (highest first)
    filtered.sort((a, b) => b.spookinessRating - a.spookinessRating);

    setFilteredDestinations(filtered);
  };

  const getQuestForDestination = (destinationId: string): SpookyDestinationQuest | undefined => {
    return quests.find(q => q.destinationId === destinationId);
  };

  const handleStartQuest = async (destinationId: string) => {
    const quest = getQuestForDestination(destinationId);
    if (!quest) return;

    if (!user) {
      toast.error('Please connect your wallet to start quests');
      return;
    }

    // Start quest locally
    const result = spookyQuestService.startQuest(quest.id);
    if (result) {
      // Also add to My Quests in Supabase for full integration
      try {
        const { addQuestToUser } = await import('../../../services/questService');
        const destination = destinations.find(d => d.id === destinationId);
        
        // Create quest data for Supabase
        const questData = {
          id: `spooky-${destinationId}`,
          title: result.title,
          description: result.description,
          category: 'halloween',
          difficulty: result.difficulty,
          xp_reward: result.xpReward,
          token_reward: result.tpxReward,
          nft_reward: result.nftReward,
          location: destination?.location || 'Unknown',
          latitude: destination?.coordinates.lat || 0,
          longitude: destination?.coordinates.lng || 0,
          requirements: result.requirements,
        };

        await addQuestToUser(user.id, questData);
        
        toast.success('Quest Started! 🎃', {
          description: `Quest added to My Quests. Visit the location to complete it!`,
        });
      } catch (error) {
        console.error('Error adding quest to user:', error);
        // Still show success for local quest
        toast.success('Quest Started!', {
          description: `You've started the quest for ${result.title}`,
        });
      }
      
      loadDestinations();
    }
  };

  const handleCompleteQuest = async (destinationId: string) => {
    const quest = getQuestForDestination(destinationId);
    if (!quest) return;

    if (!user) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet to complete quests');
      return;
    }

    // Open photo verification modal
    const destination = destinations.find(d => d.id === destinationId);
    if (destination) {
      setVerificationDestination(destination);
      setSelectedDestination(null); // Close details modal if open
    }
  };

  const handleClaimRewards = async (destinationId: string) => {
    if (!user || !address) {
      toast.error('Please connect your wallet to claim rewards');
      return;
    }

    const quest = getQuestForDestination(destinationId);
    if (!quest) return;

    setClaimingRewards(quest.id);

    try {
      const result = await spookyQuestService.claimQuestRewards(quest.id, user?.id);

      if (result.success && result.rewards) {
        // Trigger NFT celebration
        setCelebrationType('achievement');
        setShowCelebration(true);

        toast.success('Rewards Claimed! 🎁', {
          description: `+${result.rewards.xp} XP, +${result.rewards.tpx} TPX${result.rewards.nft ? ', +1 NFT' : ''}`,
          duration: 5000,
        });

        // If NFT reward, try to mint it
        if (result.rewards.nft && result.rewards.nftImageUrl) {
          try {
            const { mintAchievementAPI } = await import('../../../services/web3ApiClient');
            const mintResult = await mintAchievementAPI(
              user.id,
              `spooky-${destinationId}`,
              address
            );

            if (mintResult.success) {
              toast.success('NFT Minted! 🖼️', {
                description: `Token #${mintResult.data?.tokenId} minted successfully!`,
                action: {
                  label: 'View on Etherscan',
                  onClick: () => window.open(
                    `https://sepolia.etherscan.io/tx/${mintResult.data?.txHash}`,
                    '_blank'
                  ),
                },
              });
            }
          } catch (mintError) {
            console.error('NFT mint error:', mintError);
          }
        }

        // Claim TPX tokens
        if (result.rewards.tpx > 0) {
          try {
            const { claimQuestRewardAPI } = await import('../../../services/web3ApiClient');
            await claimQuestRewardAPI(
              user.id,
              `spooky-${destinationId}`,
              address,
              result.rewards.tpx
            );
          } catch (claimError) {
            console.error('TPX claim error:', claimError);
          }
        }

        loadDestinations();
      } else {
        toast.error('Failed to claim rewards', {
          description: result.error,
        });
      }
    } finally {
      setClaimingRewards(null);
    }
  };

  const stats = spookyDestinationService.getDestinationStats();
  const questStats = spookyQuestService.getQuestStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <HalloweenLoader variant="ghost" text="Loading spooky destinations..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <HalloweenIcon name="hauntedCastle" size={48} className="text-pumpkinOrange" />
          <div>
            <h1 className="text-4xl md:text-5xl font-spooky text-ghostlyWhite tracking-wider">
              Spooky Destinations
            </h1>
            <p className="text-ghostlyWhite/70 text-lg">
              Explore haunted locations, complete quests, earn NFTs & TPX tokens
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-deepPurple/40 backdrop-blur-xl rounded-xl p-4 border border-pumpkinOrange/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-pumpkinOrange" />
              <span className="text-ghostlyWhite/70 text-sm">Destinations</span>
            </div>
            <div className="text-3xl font-bold text-pumpkinOrange">{stats.total}</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-deepPurple/40 backdrop-blur-xl rounded-xl p-4 border border-toxicGreen/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-toxicGreen" />
              <span className="text-ghostlyWhite/70 text-sm">Visited</span>
            </div>
            <div className="text-3xl font-bold text-toxicGreen">{stats.visited}</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-deepPurple/40 backdrop-blur-xl rounded-xl p-4 border border-bloodOrange/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-bloodOrange" />
              <span className="text-ghostlyWhite/70 text-sm">Quests Done</span>
            </div>
            <div className="text-3xl font-bold text-bloodOrange">{questStats.claimed}</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-deepPurple/40 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-5 h-5 text-purple-400" />
              <span className="text-ghostlyWhite/70 text-sm">TPX Earned</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{questStats.earnedTPX}</div>
          </motion.div>
        </div>

        {/* Total Rewards Available */}
        <div className="bg-gradient-to-r from-deepPurple/60 to-midnightBlue/60 backdrop-blur-xl rounded-xl p-4 border border-ghostlyWhite/10 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-pumpkinOrange" />
              <span className="text-ghostlyWhite font-medium">Total Rewards Available:</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{questStats.totalXPAvailable} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-pumpkinOrange" />
                <span className="text-pumpkinOrange font-bold">{questStats.totalTPXAvailable} TPX</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-bold">{stats.total} NFTs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 bg-deepPurple/30 backdrop-blur-lg rounded-xl p-4 border border-ghostlyWhite/10">
          <Filter className="w-5 h-5 text-ghostlyWhite" />
          <span className="text-ghostlyWhite font-medium">Min Spookiness:</span>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setSpookinessFilter(level)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  spookinessFilter === level
                    ? 'bg-pumpkinOrange text-deepPurple font-bold shadow-lg shadow-pumpkinOrange/30'
                    : 'bg-deepPurple/50 text-ghostlyWhite/70 hover:bg-deepPurple/70 hover:text-ghostlyWhite'
                }`}
              >
                {level === 0 ? 'All' : (
                  <span className="flex items-center gap-1">
                    {level} <Skull className="w-3 h-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((destination, index) => {
          const quest = getQuestForDestination(destination.id);
          const isVisited = visitedIds.includes(destination.id);
          
          return (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SpookyDestinationCard
                destination={destination}
                isVisited={isVisited}
                quest={quest}
                onStartQuest={() => handleStartQuest(destination.id)}
                onCompleteQuest={() => handleCompleteQuest(destination.id)}
                onClaimRewards={() => handleClaimRewards(destination.id)}
                onViewDetails={() => setSelectedDestination(destination)}
                isClaimingRewards={claimingRewards === quest?.id}
              />
            </motion.div>
          );
        })}
      </div>

      {/* No results */}
      {filteredDestinations.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <HalloweenIcon name="ghost" size={64} className="text-ghostlyWhite/30 mx-auto mb-4" />
          <p className="text-ghostlyWhite/70 text-lg">
            No destinations match your filter. Try adjusting the spookiness level.
          </p>
        </motion.div>
      )}

      {/* Destination Details Modal */}
      <AnimatePresence>
        {selectedDestination && (
          <DestinationDetailsModal
            destination={selectedDestination}
            quest={getQuestForDestination(selectedDestination.id)}
            isVisited={visitedIds.includes(selectedDestination.id)}
            onClose={() => setSelectedDestination(null)}
            onStartQuest={() => {
              handleStartQuest(selectedDestination.id);
              setSelectedDestination(null);
            }}
            onCompleteQuest={() => {
              handleCompleteQuest(selectedDestination.id);
              setSelectedDestination(null);
            }}
            onClaimRewards={() => {
              handleClaimRewards(selectedDestination.id);
              setSelectedDestination(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Photo Verification Modal */}
      <AnimatePresence>
        {verificationDestination && user && address && (
          <SpookyPhotoVerificationModal
            destination={verificationDestination}
            quest={getQuestForDestination(verificationDestination.id)!}
            userId={user.id}
            walletAddress={address}
            onClose={() => setVerificationDestination(null)}
            onComplete={() => {
              setCelebrationType('achievement');
              setShowCelebration(true);
              loadDestinations();
            }}
          />
        )}
      </AnimatePresence>

      {/* Celebration */}
      {showCelebration && (
        <HalloweenCelebration
          type={celebrationType}
          onComplete={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
};


// Destination Details Modal Component
interface DestinationDetailsModalProps {
  destination: SpookyDestination;
  quest?: SpookyDestinationQuest;
  isVisited: boolean;
  onClose: () => void;
  onStartQuest: () => void;
  onCompleteQuest: () => void;
  onClaimRewards: () => void;
}

const DestinationDetailsModal: React.FC<DestinationDetailsModalProps> = ({
  destination,
  quest,
  isVisited,
  onClose,
  onStartQuest,
  onCompleteQuest,
  onClaimRewards,
}) => {
  // Use portal to render modal at document body level for proper viewport centering
  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-deepPurple to-midnightBlue border border-pumpkinOrange/30 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl my-auto"
        style={{
          margin: 'auto',
        }}
      >
        {/* Header Image */}
        <div className="relative h-56">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deepPurple via-transparent to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {/* Spookiness Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {[...Array(5)].map((_, i) => (
              <Skull
                key={i}
                className={`w-4 h-4 ${i < destination.spookinessRating ? 'text-bloodOrange' : 'text-white/20'}`}
              />
            ))}
          </div>
          
          {/* Visited Badge */}
          {isVisited && (
            <div className="absolute bottom-4 right-4 bg-toxicGreen/90 text-deepPurple px-4 py-2 rounded-full font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Visited
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h2 className="text-3xl font-spooky text-ghostlyWhite mb-2">{destination.name}</h2>
          <div className="flex items-center gap-2 text-ghostlyWhite/70 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{destination.location}, {destination.country}</span>
          </div>

          {/* Interactive Mapbox Map */}
          <div className="mb-6">
            <SpookyMapbox
              latitude={destination.coordinates.lat}
              longitude={destination.coordinates.lng}
              name={destination.name}
              className="w-full h-56 rounded-xl"
              showPulse={true}
            />
            <div className="bg-deepPurple/30 px-4 py-2 rounded-b-xl -mt-2 flex items-center justify-between border border-t-0 border-ghostlyWhite/10">
              <span className="text-ghostlyWhite/60 text-xs">
                📍 {destination.coordinates.lat.toFixed(4)}, {destination.coordinates.lng.toFixed(4)}
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${destination.coordinates.lat},${destination.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pumpkinOrange text-xs hover:underline flex items-center gap-1"
              >
                Open in Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Description */}
          <p className="text-ghostlyWhite/80 mb-6">{destination.description}</p>

          {/* Historical Background */}
          <div className="bg-deepPurple/50 rounded-xl p-4 mb-6 border border-ghostlyWhite/10">
            <h3 className="text-lg font-bold text-pumpkinOrange mb-2">Historical Background</h3>
            <p className="text-ghostlyWhite/70 text-sm">{destination.historicalBackground}</p>
          </div>

          {/* Activities */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-ghostlyWhite mb-3">Spooky Activities</h3>
            <div className="space-y-3">
              {destination.activities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-deepPurple/30 rounded-lg p-3 border border-ghostlyWhite/10"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-ghostlyWhite">{activity.name}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Skull
                          key={i}
                          className={`w-3 h-3 ${i < activity.spookinessLevel ? 'text-bloodOrange' : 'text-white/20'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-ghostlyWhite/60 text-sm">{activity.description}</p>
                  <span className="text-ghostlyWhite/40 text-xs">{activity.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quest Rewards */}
          {quest && (
            <div className="bg-gradient-to-r from-pumpkinOrange/20 to-bloodOrange/20 rounded-xl p-4 mb-6 border border-pumpkinOrange/30">
              <h3 className="text-lg font-bold text-pumpkinOrange mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Quest Rewards
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{quest.xpReward}</div>
                  <div className="text-ghostlyWhite/60 text-sm">XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pumpkinOrange">{quest.tpxReward}</div>
                  <div className="text-ghostlyWhite/60 text-sm">TPX</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">1</div>
                  <div className="text-ghostlyWhite/60 text-sm">NFT</div>
                </div>
              </div>
              
              {/* Quest Status */}
              <div className="mt-4 pt-4 border-t border-pumpkinOrange/20">
                <div className="flex items-center justify-between">
                  <span className="text-ghostlyWhite/70">Status:</span>
                  <span className={`font-medium ${
                    quest.status === 'claimed' ? 'text-toxicGreen' :
                    quest.status === 'completed' ? 'text-yellow-400' :
                    quest.status === 'in_progress' ? 'text-pumpkinOrange' :
                    'text-ghostlyWhite/50'
                  }`}>
                    {quest.status === 'claimed' ? '✓ Rewards Claimed' :
                     quest.status === 'completed' ? '⏳ Ready to Claim' :
                     quest.status === 'in_progress' ? '🎯 In Progress' :
                     '📋 Available'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {quest?.status === 'available' && (
              <SpookyButton variant="primary" onClick={onStartQuest} className="flex-1">
                Start Quest
              </SpookyButton>
            )}
            {quest?.status === 'in_progress' && (
              <SpookyButton variant="primary" onClick={onCompleteQuest} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Verify & Complete
                <ArrowRight className="w-4 h-4 ml-2" />
              </SpookyButton>
            )}
            {quest?.status === 'completed' && (
              <SpookyButton variant="primary" onClick={onClaimRewards} className="flex-1">
                <Gift className="w-4 h-4 mr-2" />
                Claim Rewards
              </SpookyButton>
            )}
            {quest?.status === 'claimed' && (
              <div className="flex-1 text-center py-3 bg-toxicGreen/20 rounded-xl border border-toxicGreen/30">
                <span className="text-toxicGreen font-medium">✓ All Rewards Claimed!</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Render using createPortal to ensure modal is at document body level
  if (typeof document !== 'undefined') {
    return ReactDOM.createPortal(modalContent, document.body);
  }
  return modalContent;
};
