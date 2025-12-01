import React from 'react';

export type HalloweenIconName = 
  | 'ghost'
  | 'cauldron'
  | 'hauntedCastle'
  | 'skull'
  | 'witchBroom'
  | 'ghostTrain'
  | 'vampireBat'
  | 'pumpkin'
  | 'potion'
  | 'spellBook'
  | 'crystalBall'
  | 'cobweb'
  | 'candyCorn';

interface HalloweenIconProps {
  name: HalloweenIconName;
  size?: number;
  color?: string;
  animated?: boolean;
  className?: string;
}

const iconPaths: Record<HalloweenIconName, React.ReactNode> = {
  ghost: (
    <>
      <path d="M12 2C8.5 2 6 4.5 6 8v8c0 1 .5 2 1.5 2s1.5-.5 1.5-1.5c0 .5.5 1.5 1.5 1.5s1.5-1 1.5-1.5c0 .5.5 1.5 1.5 1.5s1.5-1 1.5-2V8c0-3.5-2.5-6-6-6z" fill="currentColor"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
    </>
  ),
  
  cauldron: (
    <>
      <path d="M4 8h16M6 8l1 10c.2 1.5 1.5 2 3 2h4c1.5 0 2.8-.5 3-2l1-10" stroke="currentColor" strokeWidth="2" fill="none"/>
      <ellipse cx="12" cy="8" rx="8" ry="2" fill="currentColor"/>
      <path d="M8 6c0-1 1-2 2-2h4c1 0 2 1 2 2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="10" cy="12" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="14" cy="14" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="12" cy="16" r="1" fill="currentColor" opacity="0.6"/>
    </>
  ),
  
  hauntedCastle: (
    <>
      <path d="M4 22h16V10L12 4 4 10z" fill="currentColor"/>
      <rect x="9" y="14" width="6" height="8" fill="currentColor" opacity="0.7"/>
      <rect x="6" y="12" width="3" height="4" fill="currentColor"/>
      <rect x="15" y="12" width="3" height="4" fill="currentColor"/>
      <path d="M2 10h4M18 10h4M10 8h4M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="11" cy="18" r="0.5" fill="white"/>
      <circle cx="13" cy="18" r="0.5" fill="white"/>
    </>
  ),
  
  skull: (
    <>
      <path d="M12 2C8 2 5 5 5 9c0 3 1.5 5.5 3.5 7L8 22h8l-.5-6c2-1.5 3.5-4 3.5-7 0-4-3-7-7-7z" fill="currentColor"/>
      <circle cx="9" cy="10" r="1.5" fill="white"/>
      <circle cx="15" cy="10" r="1.5" fill="white"/>
      <path d="M10 14h1M13 14h1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 15v2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
    </>
  ),
  
  witchBroom: (
    <>
      <path d="M8 2l8 8M14 8l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 10l-2 12h2l2-12z" fill="currentColor"/>
      <path d="M18 18l2 2M20 18l2 2M22 18l2 2M16 20l-2 2M14 20l-2 2M12 20l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </>
  ),
  
  ghostTrain: (
    <>
      <rect x="4" y="10" width="16" height="8" rx="2" fill="currentColor"/>
      <circle cx="7" cy="19" r="1.5" fill="currentColor"/>
      <circle cx="17" cy="19" r="1.5" fill="currentColor"/>
      <rect x="6" y="12" width="4" height="3" fill="white" opacity="0.3"/>
      <rect x="14" y="12" width="4" height="3" fill="white" opacity="0.3"/>
      <path d="M2 10h20M12 6v4" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 4h8l-2 2H10z" fill="currentColor"/>
      <circle cx="10" cy="14" r="0.5" fill="white"/>
      <circle cx="14" cy="14" r="0.5" fill="white"/>
    </>
  ),
  
  vampireBat: (
    <>
      <path d="M12 8c-2 0-3 1-4 2-1-1-2-1-3 0-1 1-1 2 0 3l3 3 4 6 4-6 3-3c1-1 1-2 0-3-1-1-2-1-3 0-1-1-2-2-4-2z" fill="currentColor"/>
      <circle cx="10" cy="10" r="1" fill="red"/>
      <circle cx="14" cy="10" r="1" fill="red"/>
      <path d="M2 10c0-2 1-3 2-3s2 1 2 3M18 10c0-2 1-3 2-3s2 1 2 3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </>
  ),
  
  pumpkin: (
    <>
      <ellipse cx="12" cy="13" rx="7" ry="8" fill="currentColor"/>
      <path d="M12 5c0-1 .5-2 1.5-2s1.5.5 1.5 1.5" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M5 13c1-1 2-1 3 0M16 13c1-1 2-1 3 0" fill="none" stroke="black" strokeWidth="1.5"/>
      <path d="M8 16l1 1 1-1 1 1 1-1 1 1 1-1 1 1" stroke="black" strokeWidth="1.5" fill="none"/>
      <path d="M12 5v8" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    </>
  ),
  
  potion: (
    <>
      <path d="M8 2h8v4l2 2v10c0 2-1.5 4-4 4h-4c-2.5 0-4-2-4-4V8l2-2V2z" fill="currentColor"/>
      <rect x="9" y="2" width="6" height="2" fill="currentColor" opacity="0.7"/>
      <ellipse cx="12" cy="14" rx="4" ry="6" fill="currentColor" opacity="0.5"/>
      <circle cx="10" cy="12" r="1" fill="white" opacity="0.6"/>
      <circle cx="14" cy="14" r="1" fill="white" opacity="0.6"/>
      <circle cx="11" cy="16" r="0.5" fill="white" opacity="0.6"/>
    </>
  ),
  
  spellBook: (
    <>
      <path d="M6 2h12c1 0 2 1 2 2v16c0 1-1 2-2 2H6c-1 0-2-1-2-2V4c0-1 1-2 2-2z" fill="currentColor"/>
      <path d="M4 4v16c0 1 1 2 2 2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M10 8h6M10 12h6M10 16h4" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="12" cy="6" r="1" fill="white" opacity="0.5"/>
    </>
  ),
  
  crystalBall: (
    <>
      <circle cx="12" cy="12" r="7" fill="currentColor" opacity="0.8"/>
      <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.4"/>
      <path d="M8 10c1-1 2-1 3 0M13 10c1-1 2-1 3 0" stroke="white" strokeWidth="1" opacity="0.6"/>
      <circle cx="10" cy="11" r="1" fill="white" opacity="0.8"/>
      <circle cx="14" cy="13" r="0.5" fill="white" opacity="0.6"/>
      <ellipse cx="12" cy="20" rx="4" ry="1" fill="currentColor"/>
      <path d="M8 19h8" stroke="currentColor" strokeWidth="2"/>
    </>
  ),
  
  cobweb: (
    <>
      <path d="M12 2L12 22M2 12L22 12M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="20" cy="4" r="1" fill="currentColor"/>
    </>
  ),
  
  candyCorn: (
    <>
      <path d="M12 2L6 14h12L12 2z" fill="#FFD700"/>
      <path d="M6 14h12v4H6z" fill="#FF8C00"/>
      <path d="M6 18h12l-2 4H8z" fill="#FFFFFF"/>
      <path d="M12 2L6 14M12 2L18 14M6 14v4M18 14v4M8 22l2-4M16 22l-2-4" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
    </>
  ),
};

export const HalloweenIcon: React.FC<HalloweenIconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  animated = false,
  className = '',
}) => {
  const animationClass = animated ? 'halloween-icon-animated' : '';
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`halloween-icon ${animationClass} ${className}`}
      style={{ color }}
      aria-label={`${name} icon`}
      role="img"
    >
      {iconPaths[name]}
    </svg>
  );
};

// Export individual icon components for convenience
export const GhostIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="ghost" {...props} />
);

export const CauldronIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="cauldron" {...props} />
);

export const HauntedCastleIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="hauntedCastle" {...props} />
);

export const SkullIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="skull" {...props} />
);

export const WitchBroomIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="witchBroom" {...props} />
);

export const GhostTrainIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="ghostTrain" {...props} />
);

export const VampireBatIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="vampireBat" {...props} />
);

export const PumpkinIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="pumpkin" {...props} />
);

export const PotionIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="potion" {...props} />
);

export const SpellBookIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="spellBook" {...props} />
);

export const CrystalBallIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="crystalBall" {...props} />
);

export const CobwebIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="cobweb" {...props} />
);

export const CandyCornIcon: React.FC<Omit<HalloweenIconProps, 'name'>> = (props) => (
  <HalloweenIcon name="candyCorn" {...props} />
);

export default HalloweenIcon;
