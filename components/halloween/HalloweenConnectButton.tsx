/**
 * HalloweenConnectButton Component
 * 
 * Halloween-themed wallet connect button with skull (disconnected) and candy (connected) icons.
 * Premium glassmorphic design with flickering effects.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit';
import { useWalletAuth } from '../../hooks/useWalletAuth';
import { HalloweenIcon } from './HalloweenIcons';

interface HalloweenConnectButtonProps {
  className?: string;
}

export const HalloweenConnectButton: React.FC<HalloweenConnectButtonProps> = ({ className = '' }) => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useWalletAuth();

  const handleClick = () => {
    if (isConnected) {
      openAccountModal?.();
    } else {
      openConnectModal?.();
    }
  };

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group ${className}`}
    >
      {/* Glassmorphic background */}
      <div
        className="relative px-4 py-2.5 rounded-xl overflow-hidden"
        style={{
          background: isConnected 
            ? 'linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(255, 149, 0, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(26, 10, 46, 0.8) 0%, rgba(13, 27, 42, 0.8) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isConnected 
            ? '1px solid rgba(57, 255, 20, 0.3)'
            : '1px solid rgba(255, 107, 53, 0.3)',
          boxShadow: isConnected
            ? '0 8px 32px rgba(57, 255, 20, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(255, 107, 53, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Flickering glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            opacity: [0.3, 0.6, 0.3, 0.5, 0.3],
            boxShadow: isConnected
              ? [
                  '0 0 10px rgba(57, 255, 20, 0.3)',
                  '0 0 20px rgba(57, 255, 20, 0.5)',
                  '0 0 10px rgba(57, 255, 20, 0.3)',
                  '0 0 15px rgba(57, 255, 20, 0.4)',
                  '0 0 10px rgba(57, 255, 20, 0.3)',
                ]
              : [
                  '0 0 10px rgba(255, 107, 53, 0.3)',
                  '0 0 20px rgba(255, 107, 53, 0.5)',
                  '0 0 10px rgba(255, 107, 53, 0.3)',
                  '0 0 15px rgba(255, 107, 53, 0.4)',
                  '0 0 10px rgba(255, 107, 53, 0.3)',
                ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Content */}
        <div className="relative flex items-center gap-2">
          {/* Icon with animation */}
          <motion.div
            animate={isConnected ? {} : {
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {isConnected ? (
              <HalloweenIcon name="candyCorn" size={20} className="text-toxicGreen" />
            ) : (
              <HalloweenIcon name="skull" size={20} className="text-bloodOrange" />
            )}
          </motion.div>

          {/* Text with flickering */}
          <motion.span
            className="font-medium text-sm"
            animate={!isConnected ? {
              textShadow: [
                'none',
                '0 0 8px rgba(255, 107, 53, 0.6)',
                'none',
                '0 0 8px rgba(255, 107, 53, 0.6)',
              ],
              color: [
                '#f0e6ff',
                '#ff6b35',
                '#f0e6ff',
                '#ff6b35',
              ],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              times: [0, 0.1, 0.2, 1],
            }}
            style={{
              color: isConnected ? '#39ff14' : '#f0e6ff',
            }}
          >
            {isConnected ? shortAddress : 'Connect Wallet'}
          </motion.span>

          {/* Disconnect indicator */}
          {isConnected && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-ghostlyWhite/50 ml-1 group-hover:text-bloodOrange transition-colors"
            >
              (disconnect)
            </motion.span>
          )}
        </div>

        {/* Hover shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.button>
  );
};
