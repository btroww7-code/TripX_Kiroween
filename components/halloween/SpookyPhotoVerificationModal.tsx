/**
 * SpookyPhotoVerificationModal Component
 * 
 * Halloween-themed photo verification modal for completing spooky destination quests.
 * Full flow: upload photo → verify → complete quest → claim rewards (TPX, XP, NFT)
 * Shows NFT success screen with buttons before allowing page refresh.
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Camera, Upload, CheckCircle2, Loader2, 
  Coins, Zap, Gift, AlertCircle, ExternalLink, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { SpookyButton } from './SpookyButton';
import { HalloweenIcon } from './HalloweenIcons';
import { SpookyDestination, SpookyDestinationQuest } from '../../types/halloween';
import { supabase } from '../../lib/supabase';
import * as spookyQuestService from '../../services/spookyDestinationQuestService';
import * as spookyDestinationService from '../../services/spookyDestinationService';
import { sendHalloweenTPXReward, mintHalloweenNFTDirect } from '../../services/halloweenNFTService';
import { 
  monitorTPXTransaction, 
  monitorNFTTransaction,
  getCurrentBlockNumber, 
  getEtherscanTxUrl 
} from '../../services/etherscanMonitor';
import { markNFTAsAdded } from '../AddNFTToWallet';
import { notifyTokensClaimed, notifyNFTMinted, notifyQuestCompleted } from '../../services/notificationService';

interface SpookyPhotoVerificationModalProps {
  destination: SpookyDestination;
  quest: SpookyDestinationQuest;
  userId: string;
  walletAddress: string;
  onClose: () => void;
  onComplete: () => void;
}

// Step states for the modal
type ModalStep = 'upload' | 'verified' | 'claiming' | 'nft-success' | 'complete';

export const SpookyPhotoVerificationModal: React.FC<SpookyPhotoVerificationModalProps> = ({
  destination,
  quest,
  userId,
  walletAddress,
  onClose,
  onComplete,
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState<ModalStep>('upload');
  const [rewards, setRewards] = useState<{ xp: number; tpx: number; nft: boolean } | null>(null);
  const [nftData, setNftData] = useState<{ tokenId: number; contractAddress: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVerifyAndComplete = async () => {
    if (!photoFile) {
      toast.error('Please upload a photo first');
      return;
    }

    setVerifying(true);
    setErrorMessage(null);

    try {
      // 1. Upload photo to Supabase Storage
      const fileExt = photoFile.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${userId}/spooky-${destination.id}/${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('quest-proofs')
        .upload(fileName, photoFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('quest-proofs')
        .getPublicUrl(fileName);

      // 2. Complete quest locally
      spookyQuestService.completeQuest(quest.id, {
        photoUrl: publicUrl,
        latitude: destination.coordinates.lat,
        longitude: destination.coordinates.lng,
      });

      // Mark destination as visited
      spookyDestinationService.markAsVisited(destination.id);

      // 3. Set rewards and move to verified step
      setRewards({
        xp: quest.xpReward,
        tpx: quest.tpxReward,
        nft: quest.nftReward,
      });
      setStep('verified');

      toast.success('Quest Verified! 🎃', {
        description: 'Your photo has been accepted. Claim your rewards!',
      });
    } catch (error: any) {
      setErrorMessage(error.message || 'Verification failed. Please try again.');
      toast.error('Verification failed', { description: error.message });
    } finally {
      setVerifying(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!rewards) return;

    setStep('claiming');

    try {
      const startBlock = await getCurrentBlockNumber();
      let nftTokenId: number | null = null;

      const tpxContractAddress = import.meta.env.VITE_TPX_CONTRACT_ADDRESS;
      const nftContractAddress = import.meta.env.VITE_ACHIEVEMENT_NFT_CONTRACT_ADDRESS;

      // 1. Send TPX tokens
      if (rewards.tpx > 0) {
        toast.loading(`Sending ${rewards.tpx} TPX tokens...`, { id: 'tpx-claim' });
        
        const tpxResult = await sendHalloweenTPXReward(walletAddress, rewards.tpx, destination.id);
        
        if (tpxResult.success) {
          toast.dismiss('tpx-claim');
          toast.loading('🔍 Waiting for TPX confirmation...', { id: 'tpx-monitor' });
          
          // Monitor for confirmation
          await new Promise<void>((resolve) => {
            let resolved = false;
            monitorTPXTransaction(
              walletAddress,
              async (txResult) => {
                if (resolved) return;
                resolved = true;
                toast.dismiss('tpx-monitor');
                toast.success(`${rewards.tpx} TPX confirmed!`, {
                  action: {
                    label: 'View',
                    onClick: () => window.open(getEtherscanTxUrl(txResult.transactionHash!), '_blank'),
                  },
                });
                
                // Show MetaMask popup for TPX
                if (window.ethereum && tpxContractAddress) {
                  try {
                    await window.ethereum.request({
                      method: 'wallet_watchAsset',
                      params: {
                        type: 'ERC20',
                        options: {
                          address: tpxContractAddress,
                          symbol: 'TPX',
                          decimals: 18,
                          image: 'https://jjzksgzieuguuolfcekk.supabase.co/storage/v1/object/public/assets/tpx-logo.png',
                        },
                      },
                    });
                  } catch (e) {
                    // User declined
                  }
                }
                resolve();
              },
              () => {},
              60,
              startBlock
            ).then(() => {
              if (!resolved) {
                resolved = true;
                toast.dismiss('tpx-monitor');
                resolve();
              }
            });
          });
        } else {
          toast.dismiss('tpx-claim');
          toast.error('TPX transfer failed', { description: tpxResult.error });
        }
      }

      // 2. Mint NFT if quest has NFT reward
      if (rewards.nft) {
        toast.loading('Minting Halloween NFT...', { id: 'nft-mint' });
        
        const nftResult = await mintHalloweenNFTDirect(walletAddress, destination.id, userId);
        
        if (nftResult.success && nftResult.txHash) {
          toast.dismiss('nft-mint');
          toast.loading('🔍 Waiting for NFT confirmation on blockchain...', { id: 'nft-monitor' });
          
          // Wait for NFT transaction to be confirmed on Etherscan
          const monitorResult = await monitorNFTTransaction(
            walletAddress,
            () => {},
            () => {},
            nftContractAddress,
            60,
            startBlock
          );
          
          toast.dismiss('nft-monitor');
          
          if (monitorResult.found && monitorResult.tokenId) {
            nftTokenId = monitorResult.tokenId;
            
            toast.success('🎃 NFT confirmed on blockchain!', {
              description: `Token #${nftTokenId}`,
              action: {
                label: 'View TX',
                onClick: () => window.open(getEtherscanTxUrl(monitorResult.transactionHash!), '_blank'),
              },
            });
            
            setNftData({
              tokenId: nftTokenId,
              contractAddress: nftContractAddress || '',
            });
            
            // Mark rewards as claimed
            await spookyQuestService.claimQuestRewards(quest.id, userId);
            
            // Create notifications
            try {
              if (rewards.tpx > 0) {
                await notifyTokensClaimed(userId, rewards.tpx, monitorResult.transactionHash || '');
              }
              await notifyNFTMinted(userId, 'achievement', nftTokenId, monitorResult.transactionHash || '');
              await notifyQuestCompleted(userId, destination.name, rewards.xp, rewards.tpx);
            } catch (notifError) {
              console.warn('[SpookyVerification] Failed to create notifications:', notifError);
            }
            
            // Show NFT success screen
            setStep('nft-success');
            return;
          } else {
            // Transaction sent but not confirmed yet
            nftTokenId = nftResult.tokenId || 1;
            
            toast.success('🎃 NFT minted! Awaiting confirmation...', {
              description: `TX: ${nftResult.txHash.slice(0, 10)}...`,
            });
            
            setNftData({
              tokenId: nftTokenId,
              contractAddress: nftContractAddress || '',
            });
            
            await spookyQuestService.claimQuestRewards(quest.id, userId);
            
            // Create notifications
            try {
              if (rewards.tpx > 0) {
                await notifyTokensClaimed(userId, rewards.tpx, nftResult.txHash || '');
              }
              await notifyNFTMinted(userId, 'achievement', nftTokenId, nftResult.txHash || '');
              await notifyQuestCompleted(userId, destination.name, rewards.xp, rewards.tpx);
            } catch (notifError) {
              console.warn('[SpookyVerification] Failed to create notifications:', notifError);
            }
            
            setStep('nft-success');
            return;
          }
        } else {
          toast.dismiss('nft-mint');
          toast.error('NFT mint failed', { description: nftResult.error });
        }
      }

      // 3. If no NFT reward, just complete
      await spookyQuestService.claimQuestRewards(quest.id, userId);
      
      // Create notifications for quest without NFT
      try {
        if (rewards.tpx > 0) {
          await notifyTokensClaimed(userId, rewards.tpx, '');
        }
        await notifyQuestCompleted(userId, destination.name, rewards.xp, rewards.tpx);
      } catch (notifError) {
        console.warn('[SpookyVerification] Failed to create notifications:', notifError);
      }

      toast.success('All rewards claimed! 🎉', {
        description: `+${rewards.xp} XP, +${rewards.tpx} TPX`,
      });

      setStep('complete');

    } catch (error: any) {
      toast.error('Failed to claim rewards', { description: error.message });
      setStep('verified');
    }
  };

  const handleAddNFTToWallet = async () => {
    if (!nftData || !window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: nftData.contractAddress,
            tokenId: nftData.tokenId.toString(),
          },
        },
      });
      toast.success('NFT added to wallet!');
      markNFTAsAdded(nftData.tokenId, nftData.contractAddress);
    } catch (e) {
      markNFTAsAdded(nftData.tokenId, nftData.contractAddress);
    }
  };

  const handleFinish = () => {
    window.dispatchEvent(new CustomEvent('userDataUpdated', {
      detail: { userId, walletAddress },
    }));
    
    onComplete();
    onClose();
    window.location.reload();
  };

  const etherscanNftUrl = nftData 
    ? `https://sepolia.etherscan.io/nft/${nftData.contractAddress}/${nftData.tokenId}`
    : '';

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={(e) => {
        if (step === 'upload') onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-deepPurple to-midnightBlue border border-pumpkinOrange/40 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-pumpkinOrange/20">
          {step === 'upload' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            >
              <X className="w-5 h-5 text-ghostlyWhite" />
            </button>
          )}
          
          <div className="flex items-center gap-3">
            <HalloweenIcon name="ghost" size={40} className="text-pumpkinOrange" />
            <div>
              <h2 className="text-2xl font-spooky text-ghostlyWhite">
                {step === 'nft-success' ? '🎃 NFT Minted!' : 'Verify Quest'}
              </h2>
              <p className="text-ghostlyWhite/60 text-sm">{destination.name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Upload Step */}
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-6">
                  <label className="block text-ghostlyWhite font-medium mb-2">
                    <Camera className="w-4 h-4 inline mr-2" />
                    Upload Photo Proof
                  </label>
                  
                  {photoPreview ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
                      <button
                        onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-pumpkinOrange/40 rounded-xl cursor-pointer hover:border-pumpkinOrange/60 transition-colors bg-deepPurple/30">
                      <Upload className="w-10 h-10 text-pumpkinOrange/60 mb-2" />
                      <span className="text-ghostlyWhite/60 text-sm">Click to upload photo</span>
                      <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Rewards Preview */}
                <div className="bg-deepPurple/40 rounded-xl p-4 mb-6 border border-ghostlyWhite/10">
                  <h3 className="text-sm font-medium text-ghostlyWhite/70 mb-3">Rewards you'll earn:</h3>
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-yellow-400">{quest.xpReward}</div>
                      <div className="text-xs text-ghostlyWhite/50">XP</div>
                    </div>
                    <div className="text-center">
                      <Coins className="w-6 h-6 text-pumpkinOrange mx-auto mb-1" />
                      <div className="text-lg font-bold text-pumpkinOrange">{quest.tpxReward}</div>
                      <div className="text-xs text-ghostlyWhite/50">TPX</div>
                    </div>
                    <div className="text-center">
                      <Gift className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-purple-400">1</div>
                      <div className="text-xs text-ghostlyWhite/50">NFT</div>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 bg-bloodOrange/20 border border-bloodOrange/40 rounded-lg text-bloodOrange text-sm">
                    {errorMessage}
                  </div>
                )}

                <SpookyButton
                  variant="primary"
                  onClick={handleVerifyAndComplete}
                  disabled={!photoFile || verifying}
                  className="w-full"
                >
                  {verifying ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying...</>
                  ) : (
                    <><CheckCircle2 className="w-5 h-5 mr-2" /> Verify & Complete Quest</>
                  )}
                </SpookyButton>
              </motion.div>
            )}

            {/* Verified Step */}
            {step === 'verified' && rewards && (
              <motion.div
                key="verified"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-toxicGreen/20 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-toxicGreen" />
                </motion.div>
                <h3 className="text-2xl font-spooky text-toxicGreen mb-2">Quest Verified!</h3>
                <p className="text-ghostlyWhite/70 mb-6">Your photo has been accepted.</p>

                <div className="bg-deepPurple/40 rounded-xl p-4 mb-6 border border-toxicGreen/30">
                  <h4 className="text-sm font-medium text-ghostlyWhite/70 mb-3">Your Rewards:</h4>
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{rewards.xp}</div>
                      <div className="text-xs text-ghostlyWhite/50">XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pumpkinOrange">{rewards.tpx}</div>
                      <div className="text-xs text-ghostlyWhite/50">TPX</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">1</div>
                      <div className="text-xs text-ghostlyWhite/50">NFT</div>
                    </div>
                  </div>
                </div>

                <SpookyButton variant="primary" onClick={handleClaimRewards} className="w-full">
                  <Gift className="w-5 h-5 mr-2" /> Claim All Rewards
                </SpookyButton>
              </motion.div>
            )}

            {/* Claiming Step */}
            {step === 'claiming' && (
              <motion.div
                key="claiming"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Loader2 className="w-16 h-16 text-pumpkinOrange mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-spooky text-ghostlyWhite mb-2">Claiming Rewards...</h3>
                <p className="text-ghostlyWhite/60">Please wait and approve any wallet popups</p>
              </motion.div>
            )}

            {/* NFT Success Step */}
            {step === 'nft-success' && nftData && (
              <motion.div
                key="nft-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pumpkinOrange flex items-center justify-center"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-spooky text-purple-400 mb-2">Halloween NFT Minted!</h3>
                <p className="text-ghostlyWhite/70 mb-2">Token #{nftData.tokenId}</p>
                <p className="text-ghostlyWhite/50 text-sm mb-6">{destination.name}</p>

                <div className="space-y-3">
                  <button
                    onClick={handleAddNFTToWallet}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Gift className="w-5 h-5" /> Add NFT to MetaMask
                  </button>

                  <a
                    href={etherscanNftUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 bg-deepPurple/50 text-ghostlyWhite font-medium rounded-xl hover:bg-deepPurple/70 transition-colors border border-ghostlyWhite/20 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" /> View on Etherscan
                  </a>

                  <button
                    onClick={handleFinish}
                    className="w-full py-3 px-6 bg-gradient-to-r from-pumpkinOrange to-bloodOrange text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Done - Close & Refresh
                  </button>
                </div>
              </motion.div>
            )}

            {/* Complete Step (no NFT) */}
            {step === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-toxicGreen/20 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-toxicGreen" />
                </motion.div>
                <h3 className="text-2xl font-spooky text-toxicGreen mb-2">All Rewards Claimed!</h3>
                <p className="text-ghostlyWhite/70 mb-6">
                  +{rewards?.xp} XP, +{rewards?.tpx} TPX
                </p>

                <button
                  onClick={handleFinish}
                  className="w-full py-3 px-6 bg-gradient-to-r from-pumpkinOrange to-bloodOrange text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Done - Close & Refresh
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof document !== 'undefined') {
    return ReactDOM.createPortal(modalContent, document.body);
  }
  return modalContent;
};
