/**
 * SpookyDestinationCard Component
 * 
 * Card component for displaying spooky destinations with quest status, rewards, and actions.
 * Requirements: 16.1, 16.3
 */

import React from 'react';
import { motion } from 'framer-motion';
import { SpookyCard } from './SpookyCard';
import { SpookyButton } from './SpookyButton';
import { HalloweenIcon } from './HalloweenIcons';
import { SpookyDestination, SpookyDestinationQuest } from '../../types/halloween';
import { MapPin, Clock, Trophy, Coins, Zap, Camera, Gift, CheckCircle2, Loader2 } from 'lucide-react';

interface SpookyDestinationCardProps {
  destination: SpookyDestination;
  isVisited: boolean;
  quest?: SpookyDestinationQuest;
  onStartQuest?: () => void;
  onCompleteQuest?: () => void;
  onClaimRewards?: () => void;
  onMarkAsVisited?: (destinationId: string) => void;
  onViewDetails?: () => void;
  isClaimingRewards?: boolean;
}

export const SpookyDestinationCard: React.FC<SpookyDestinationCardProps> = ({
  destination,
  isVisited,
  quest,
  onStartQuest,
  onCompleteQuest,
  onClaimRewards,
  onMarkAsVisited,
  onViewDetails,
  isClaimingRewards,
}) => {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'legendary': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      case 'hard': return 'text-bloodOrange border-bloodOrange/30 bg-bloodOrange/10';
      case 'medium': return 'text-pumpkinOrange border-pumpkinOrange/30 bg-pumpkinOrange/10';
      case 'easy': return 'text-toxicGreen border-toxicGreen/30 bg-toxicGreen/10';
      default: return 'text-ghostlyWhite/70 border-ghostlyWhite/20 bg-ghostlyWhite/5';
    }
  };

  const getStatusBadge = () => {
    if (!quest) return null;
    
    switch (quest.status) {
      case 'claimed':
        return (
          <div className="absolute top-3 left-3 bg-toxicGreen/90 text-deepPurple px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </div>
        );
      case 'completed':
        return (
          <div className="absolute top-3 left-3 bg-yellow-500/90 text-deepPurple px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
            <Gift className="w-3 h-3" />
            Claim Rewards!
          </div>
        );
      case 'in_progress':
        return (
          <div className="absolute top-3 left-3 bg-pumpkinOrange/90 text-deepPurple px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Camera className="w-3 h-3" />
            In Progress
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SpookyCard variant="trip" hoverEffect={true}>
      {/* Image */}
      <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden group">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deepPurple/80 via-transparent to-transparent" />
        
        {/* Status Badge */}
        {getStatusBadge()}
        
        {/* Spookiness Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          {[...Array(5)].map((_, i) => (
            <HalloweenIcon
              key={i}
              name="skull"
              size={14}
              className={i < destination.spookinessRating ? 'text-bloodOrange' : 'text-white/20'}
            />
          ))}
        </div>

        {/* Difficulty Badge */}
        {quest && (
          <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(quest.difficulty)}`}>
            {quest.difficulty.toUpperCase()}
          </div>
        )}
      </div>

      {/* Title and Location */}
      <h3 className="text-xl font-bold text-ghostlyWhite mb-1 line-clamp-1">
        {destination.name}
      </h3>
      <div className="flex items-center gap-2 text-ghostlyWhite/60 mb-3">
        <MapPin className="w-3 h-3" />
        <span className="text-sm line-clamp-1">{destination.location}, {destination.country}</span>
      </div>

      {/* Description */}
      <p className="text-ghostlyWhite/70 text-sm mb-4 line-clamp-2">
        {destination.description}
      </p>

      {/* Rewards Preview */}
      {quest && (
        <div className="flex items-center gap-4 mb-4 p-3 bg-deepPurple/40 rounded-lg border border-ghostlyWhite/10">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{quest.xpReward}</span>
          </div>
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-pumpkinOrange" />
            <span className="text-pumpkinOrange font-bold text-sm">{quest.tpxReward}</span>
          </div>
          {quest.nftReward && (
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-bold text-sm">NFT</span>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {destination.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-deepPurple/50 text-ghostlyWhite/70 text-xs rounded-full border border-pumpkinOrange/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {/* Quest Actions */}
        {quest?.status === 'available' && onStartQuest && (
          <SpookyButton variant="primary" onClick={onStartQuest} size="sm" className="flex-1">
            Start Quest
          </SpookyButton>
        )}
        
        {quest?.status === 'in_progress' && onCompleteQuest && (
          <SpookyButton variant="primary" onClick={onCompleteQuest} size="sm" className="flex-1">
            <Camera className="w-4 h-4 mr-1" />
            Complete
          </SpookyButton>
        )}
        
        {quest?.status === 'completed' && onClaimRewards && (
          <SpookyButton 
            variant="primary" 
            onClick={onClaimRewards} 
            size="sm" 
            className="flex-1 animate-pulse"
            disabled={isClaimingRewards}
          >
            {isClaimingRewards ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <Gift className="w-4 h-4 mr-1" />
                Claim Rewards
              </>
            )}
          </SpookyButton>
        )}
        
        {quest?.status === 'claimed' && (
          <div className="flex-1 text-center py-2 bg-toxicGreen/10 rounded-lg border border-toxicGreen/30">
            <span className="text-toxicGreen text-sm font-medium flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </span>
          </div>
        )}

        {/* Legacy: Mark as Visited (if no quest system) */}
        {!quest && !isVisited && onMarkAsVisited && (
          <SpookyButton
            variant="primary"
            onClick={() => onMarkAsVisited(destination.id)}
            size="sm"
            className="flex-1"
          >
            Mark as Visited
          </SpookyButton>
        )}

        {/* View Details */}
        {onViewDetails && (
          <SpookyButton
            variant="secondary"
            onClick={onViewDetails}
            size="sm"
          >
            Details
          </SpookyButton>
        )}
      </div>
    </SpookyCard>
  );
};
