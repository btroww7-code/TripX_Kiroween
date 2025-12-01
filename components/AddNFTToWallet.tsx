import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { useWalletAuth } from '../hooks/useWalletAuth';
import { useEmailAuth } from '../hooks/useEmailAuth';
import { getNFTTransactions } from '../services/nftTransactionService';
import { glassEffects } from '../styles/glassEffects';

interface AddNFTToWalletProps {
  className?: string;
}

interface NFTToAdd {
  tokenId: number;
  contractAddress: string;
  nftType: 'passport' | 'achievement';
  txHash: string;
}

const STORAGE_KEY = 'nft_added_to_metamask';

// Get list of NFTs that have been added to MetaMask
function getAddedNFTs(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('[AddNFTToWallet] Error reading localStorage:', error);
  }
  return new Set();
}

// Mark NFT as added to MetaMask (exported for use in other components)
export function markNFTAsAdded(tokenId: number, contractAddress: string): void {
  try {
    const added = getAddedNFTs();
    const key = `${contractAddress.toLowerCase()}_${tokenId}`;
    added.add(key);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(added)));
    console.log('[AddNFTToWallet] Marked NFT as added:', key);
  } catch (error) {
    console.error('[AddNFTToWallet] Error saving to localStorage:', error);
  }
}

export const AddNFTToWallet: React.FC<AddNFTToWalletProps> = ({ className = '' }) => {
  const { user: walletUser, address } = useWalletAuth();
  const { user: emailUser } = useEmailAuth();
  const user = walletUser || emailUser;

  const [nftsToAdd, setNftsToAdd] = useState<NFTToAdd[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !address) {
      setLoading(false);
      return;
    }

    loadNFTsToAdd();
  }, [user?.id, address]);

  const loadNFTsToAdd = async () => {
    if (!user?.id || !address) return;

    setLoading(true);
    try {
      console.log('[AddNFTToWallet] Loading NFTs for user:', user.id);
      
      // Get all NFT transactions
      const transactions = await getNFTTransactions(user.id, 100, address);
      
      // Filter only confirmed transactions with token_id
      const confirmedNFTs = transactions.filter(
        tx => tx.status === 'confirmed' && 
        tx.token_id && 
        tx.token_id > 0 &&
        tx.contract_address &&
        (tx.nft_type === 'passport' || tx.nft_type === 'achievement')
      );

      console.log('[AddNFTToWallet] Found', confirmedNFTs.length, 'confirmed NFTs');

      // Get list of already added NFTs
      const addedNFTs = getAddedNFTs();

      // Filter out NFTs that have already been added
      const nftsToAddList: NFTToAdd[] = [];
      for (const tx of confirmedNFTs) {
        const key = `${tx.contract_address.toLowerCase()}_${tx.token_id}`;
        if (!addedNFTs.has(key)) {
          nftsToAddList.push({
            tokenId: tx.token_id!,
            contractAddress: tx.contract_address,
            nftType: tx.nft_type as 'passport' | 'achievement',
            txHash: tx.tx_hash,
          });
        }
      }

      // Remove duplicates (same tokenId + contractAddress)
      const uniqueNFTs = Array.from(
        new Map(nftsToAddList.map(nft => [`${nft.contractAddress}_${nft.tokenId}`, nft])).values()
      );

      console.log('[AddNFTToWallet] NFTs to add:', uniqueNFTs.length);
      setNftsToAdd(uniqueNFTs);
    } catch (error) {
      console.error('[AddNFTToWallet] Error loading NFTs:', error);
      setNftsToAdd([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNFTs = async () => {
    if (!window.ethereum) {
      // Open Etherscan instead if no MetaMask
      const firstNFT = nftsToAdd[0];
      if (firstNFT) {
        window.open(
          `https://sepolia.etherscan.io/token/${firstNFT.contractAddress}?a=${address}`,
          '_blank'
        );
      }
      return;
    }

    if (nftsToAdd.length === 0) {
      return;
    }

    setIsAdding(true);
    try {
      console.log('[AddNFTToWallet] Adding', nftsToAdd.length, 'NFTs to MetaMask...');

      // Ensure user is on Sepolia network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://ethereum-sepolia.publicnode.com'],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }]
          });
        }
      }

      // Add each NFT to MetaMask
      // Note: MetaMask's wallet_watchAsset for ERC721 has limited support
      // We'll try the standard method first, then fall back to opening Etherscan
      let addedCount = 0;
      const failedNFTs: typeof nftsToAdd = [];
      
      for (const nft of nftsToAdd) {
        try {
          // Try the standard ERC721 method first
          const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC721',
              options: {
                address: nft.contractAddress,
                tokenId: nft.tokenId.toString(),
              },
            },
          });

          if (wasAdded) {
            console.log('[AddNFTToWallet] ✅ Added NFT:', nft.tokenId, 'from', nft.contractAddress);
            markNFTAsAdded(nft.tokenId, nft.contractAddress);
            addedCount++;
          } else {
            console.log('[AddNFTToWallet] User declined to add NFT:', nft.tokenId);
            failedNFTs.push(nft);
          }
        } catch (nftError: any) {
          console.warn('[AddNFTToWallet] wallet_watchAsset failed for NFT', nft.tokenId, ':', nftError.message);
          
          // MetaMask may not support ERC721 watchAsset - this is expected
          // Mark as added anyway since the NFT exists on-chain
          if (nftError.code === -32602 || nftError.message?.includes('not supported')) {
            console.log('[AddNFTToWallet] ERC721 watchAsset not supported, marking as added');
            markNFTAsAdded(nft.tokenId, nft.contractAddress);
            addedCount++;
          } else {
            failedNFTs.push(nft);
          }
        }
      }
      
      // If some NFTs couldn't be added via wallet_watchAsset, show Etherscan links
      if (failedNFTs.length > 0 && addedCount === 0) {
        // Open Etherscan to view NFTs instead
        const firstNFT = failedNFTs[0];
        const etherscanUrl = `https://sepolia.etherscan.io/token/${firstNFT.contractAddress}?a=${address}`;
        
        const openEtherscan = window.confirm(
          `MetaMask doesn't fully support viewing NFTs directly.\n\nWould you like to view your NFTs on Etherscan instead?`
        );
        
        if (openEtherscan) {
          window.open(etherscanUrl, '_blank');
        }
        
        // Mark all as "added" since they exist on-chain
        failedNFTs.forEach(nft => markNFTAsAdded(nft.tokenId, nft.contractAddress));
        addedCount = failedNFTs.length;
      }

      console.log('[AddNFTToWallet] ✅ Added', addedCount, 'out of', nftsToAdd.length, 'NFTs');

      if (addedCount > 0) {
        setIsAdded(true);
        // Reload NFTs to update the list
        await loadNFTsToAdd();
        setTimeout(() => setIsAdded(false), 3000);
      }
    } catch (error: any) {
      console.error('[AddNFTToWallet] Error adding NFTs:', error);
      if (error.code !== 4001) {
        alert(`Failed to add NFTs: ${error.message || 'Please try again'}`);
      }
    } finally {
      setIsAdding(false);
    }
  };

  // Don't show if no user or no wallet address
  if (!user || !address) {
    return null;
  }

  // Don't show if loading
  if (loading) {
    return null;
  }

  // Don't show if no NFTs to add
  if (nftsToAdd.length === 0) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAddNFTs}
      disabled={isAdding || isAdded}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all backdrop-blur-xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.7) 0%, rgba(40, 40, 40, 0.7) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        color: 'white',
        boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.15)',
      }}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4" />
          <span>Added to MetaMask!</span>
        </>
      ) : isAdding ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Adding {nftsToAdd.length} NFT{nftsToAdd.length > 1 ? 's' : ''}...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span>Add {nftsToAdd.length} NFT{nftsToAdd.length > 1 ? 's' : ''} to Wallet</span>
        </>
      )}
    </motion.button>
  );
};

