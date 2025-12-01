import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  HalloweenIcon,
  GhostIcon,
  CauldronIcon,
  HauntedCastleIcon,
  SkullIcon,
  WitchBroomIcon,
  GhostTrainIcon,
  VampireBatIcon,
  PumpkinIcon,
  PotionIcon,
  SpellBookIcon,
  CrystalBallIcon,
  CobwebIcon,
  CandyCornIcon,
  type HalloweenIconName,
} from '../components/halloween/HalloweenIcons';

/**
 * Unit tests for HalloweenIcons component
 * **Validates: Requirements 12.1, 12.2, 12.3**
 */
describe('HalloweenIcon Component', () => {
  const allIconNames: HalloweenIconName[] = [
    'ghost',
    'cauldron',
    'hauntedCastle',
    'skull',
    'witchBroom',
    'ghostTrain',
    'vampireBat',
    'pumpkin',
    'potion',
    'spellBook',
    'crystalBall',
    'cobweb',
    'candyCorn',
  ];

  describe('Icon Rendering', () => {
    it('should render each icon without crashing', () => {
      allIconNames.forEach((iconName) => {
        const { container } = render(<HalloweenIcon name={iconName} />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });

    it('should render ghost icon with correct aria-label', () => {
      render(<HalloweenIcon name="ghost" />);
      const icon = screen.getByLabelText('ghost icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render cauldron icon with correct aria-label', () => {
      render(<HalloweenIcon name="cauldron" />);
      const icon = screen.getByLabelText('cauldron icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render hauntedCastle icon with correct aria-label', () => {
      render(<HalloweenIcon name="hauntedCastle" />);
      const icon = screen.getByLabelText('hauntedCastle icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render skull icon with correct aria-label', () => {
      render(<HalloweenIcon name="skull" />);
      const icon = screen.getByLabelText('skull icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render witchBroom icon with correct aria-label', () => {
      render(<HalloweenIcon name="witchBroom" />);
      const icon = screen.getByLabelText('witchBroom icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render ghostTrain icon with correct aria-label', () => {
      render(<HalloweenIcon name="ghostTrain" />);
      const icon = screen.getByLabelText('ghostTrain icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render vampireBat icon with correct aria-label', () => {
      render(<HalloweenIcon name="vampireBat" />);
      const icon = screen.getByLabelText('vampireBat icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render pumpkin icon with correct aria-label', () => {
      render(<HalloweenIcon name="pumpkin" />);
      const icon = screen.getByLabelText('pumpkin icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render potion icon with correct aria-label', () => {
      render(<HalloweenIcon name="potion" />);
      const icon = screen.getByLabelText('potion icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render spellBook icon with correct aria-label', () => {
      render(<HalloweenIcon name="spellBook" />);
      const icon = screen.getByLabelText('spellBook icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render crystalBall icon with correct aria-label', () => {
      render(<HalloweenIcon name="crystalBall" />);
      const icon = screen.getByLabelText('crystalBall icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render cobweb icon with correct aria-label', () => {
      render(<HalloweenIcon name="cobweb" />);
      const icon = screen.getByLabelText('cobweb icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render candyCorn icon with correct aria-label', () => {
      render(<HalloweenIcon name="candyCorn" />);
      const icon = screen.getByLabelText('candyCorn icon');
      expect(icon).toBeInTheDocument();
    });

    it('should have role="img" for accessibility', () => {
      const { container } = render(<HalloweenIcon name="ghost" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
    });

    it('should have correct viewBox attribute', () => {
      const { container } = render(<HalloweenIcon name="ghost" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('Custom Size Prop', () => {
    it('should apply default size of 24 when no size prop is provided', () => {
      const { container } = render(<HalloweenIcon name="ghost" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('should apply custom size of 32', () => {
      const { container } = render(<HalloweenIcon name="ghost" size={32} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });

    it('should apply custom size of 48', () => {
      const { container } = render(<HalloweenIcon name="pumpkin" size={48} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('should apply custom size of 16', () => {
      const { container } = render(<HalloweenIcon name="skull" size={16} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
    });

    it('should apply custom size of 64', () => {
      const { container } = render(<HalloweenIcon name="cauldron" size={64} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '64');
      expect(svg).toHaveAttribute('height', '64');
    });

    it('should apply very small size of 8', () => {
      const { container } = render(<HalloweenIcon name="cobweb" size={8} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '8');
      expect(svg).toHaveAttribute('height', '8');
    });

    it('should apply large size of 128', () => {
      const { container } = render(<HalloweenIcon name="hauntedCastle" size={128} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '128');
      expect(svg).toHaveAttribute('height', '128');
    });
  });

  describe('Custom Color Prop', () => {
    it('should apply default color of currentColor when no color prop is provided', () => {
      const { container } = render(<HalloweenIcon name="ghost" />);
      const svg = container.querySelector('svg');
      // Check that the style attribute contains currentColor (case-insensitive)
      const style = svg?.getAttribute('style');
      expect(style?.toLowerCase()).toContain('currentcolor');
    });

    it('should apply custom color #ff6b35 (bloodOrange)', () => {
      const { container } = render(<HalloweenIcon name="ghost" color="#ff6b35" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ color: '#ff6b35' });
    });

    it('should apply custom color #1a0a2e (deepPurple)', () => {
      const { container } = render(<HalloweenIcon name="pumpkin" color="#1a0a2e" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ color: '#1a0a2e' });
    });

    it('should apply custom color #f0e6ff (ghostlyWhite)', () => {
      const { container } = render(<HalloweenIcon name="skull" color="#f0e6ff" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ color: '#f0e6ff' });
    });

    it('should apply custom color #ff9500 (pumpkinOrange)', () => {
      const { container } = render(<HalloweenIcon name="cauldron" color="#ff9500" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ color: '#ff9500' });
    });

    it('should apply custom color #39ff14 (toxicGreen)', () => {
      const { container } = render(<HalloweenIcon name="potion" color="#39ff14" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ color: '#39ff14' });
    });

    it('should apply custom color red', () => {
      const { container } = render(<HalloweenIcon name="vampireBat" color="red" />);
      const svg = container.querySelector('svg');
      // Browsers convert 'red' to 'rgb(255, 0, 0)'
      const computedStyle = window.getComputedStyle(svg!);
      expect(computedStyle.color).toBe('rgb(255, 0, 0)');
    });

    it('should apply custom color blue', () => {
      const { container } = render(<HalloweenIcon name="crystalBall" color="blue" />);
      const svg = container.querySelector('svg');
      // Browsers convert 'blue' to 'rgb(0, 0, 255)'
      const computedStyle = window.getComputedStyle(svg!);
      expect(computedStyle.color).toBe('rgb(0, 0, 255)');
    });
  });

  describe('Animated Prop', () => {
    it('should not have animation class when animated is false', () => {
      const { container } = render(<HalloweenIcon name="ghost" animated={false} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toHaveClass('halloween-icon-animated');
    });

    it('should not have animation class by default', () => {
      const { container } = render(<HalloweenIcon name="ghost" />);
      const svg = container.querySelector('svg');
      expect(svg).not.toHaveClass('halloween-icon-animated');
    });

    it('should have animation class when animated is true', () => {
      const { container } = render(<HalloweenIcon name="ghost" animated={true} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('halloween-icon-animated');
    });

    it('should always have base halloween-icon class', () => {
      const { container } = render(<HalloweenIcon name="ghost" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('halloween-icon');
    });
  });

  describe('Custom ClassName Prop', () => {
    it('should apply custom className', () => {
      const { container } = render(<HalloweenIcon name="ghost" className="custom-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });

    it('should apply multiple custom classes', () => {
      const { container } = render(
        <HalloweenIcon name="ghost" className="class-one class-two" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('class-one');
      expect(svg).toHaveClass('class-two');
    });

    it('should preserve base halloween-icon class when custom className is provided', () => {
      const { container } = render(<HalloweenIcon name="ghost" className="custom-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('halloween-icon');
      expect(svg).toHaveClass('custom-class');
    });
  });

  describe('Combined Props', () => {
    it('should apply size, color, and className together', () => {
      const { container } = render(
        <HalloweenIcon
          name="ghost"
          size={48}
          color="#ff6b35"
          className="custom-icon"
        />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
      expect(svg).toHaveStyle({ color: '#ff6b35' });
      expect(svg).toHaveClass('custom-icon');
    });

    it('should apply all props including animated', () => {
      const { container } = render(
        <HalloweenIcon
          name="pumpkin"
          size={64}
          color="#ff9500"
          animated={true}
          className="spooky-icon"
        />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '64');
      expect(svg).toHaveAttribute('height', '64');
      expect(svg).toHaveStyle({ color: '#ff9500' });
      expect(svg).toHaveClass('halloween-icon-animated');
      expect(svg).toHaveClass('spooky-icon');
    });
  });

  describe('Individual Icon Components', () => {
    it('should render GhostIcon component', () => {
      render(<GhostIcon />);
      const icon = screen.getByLabelText('ghost icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render CauldronIcon component', () => {
      render(<CauldronIcon />);
      const icon = screen.getByLabelText('cauldron icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render HauntedCastleIcon component', () => {
      render(<HauntedCastleIcon />);
      const icon = screen.getByLabelText('hauntedCastle icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render SkullIcon component', () => {
      render(<SkullIcon />);
      const icon = screen.getByLabelText('skull icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render WitchBroomIcon component', () => {
      render(<WitchBroomIcon />);
      const icon = screen.getByLabelText('witchBroom icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render GhostTrainIcon component', () => {
      render(<GhostTrainIcon />);
      const icon = screen.getByLabelText('ghostTrain icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render VampireBatIcon component', () => {
      render(<VampireBatIcon />);
      const icon = screen.getByLabelText('vampireBat icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render PumpkinIcon component', () => {
      render(<PumpkinIcon />);
      const icon = screen.getByLabelText('pumpkin icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render PotionIcon component', () => {
      render(<PotionIcon />);
      const icon = screen.getByLabelText('potion icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render SpellBookIcon component', () => {
      render(<SpellBookIcon />);
      const icon = screen.getByLabelText('spellBook icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render CrystalBallIcon component', () => {
      render(<CrystalBallIcon />);
      const icon = screen.getByLabelText('crystalBall icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render CobwebIcon component', () => {
      render(<CobwebIcon />);
      const icon = screen.getByLabelText('cobweb icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render CandyCornIcon component', () => {
      render(<CandyCornIcon />);
      const icon = screen.getByLabelText('candyCorn icon');
      expect(icon).toBeInTheDocument();
    });

    it('should accept custom props in individual icon components', () => {
      const { container } = render(<GhostIcon size={48} color="#ff6b35" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveStyle({ color: '#ff6b35' });
    });
  });

  describe('SVG Structure', () => {
    it('should have correct xmlns attribute', () => {
      const { container } = render(<HalloweenIcon name="ghost" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    });

    it('should have fill="none" attribute', () => {
      const { container } = render(<HalloweenIcon name="ghost" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('should contain SVG path elements', () => {
      const { container } = render(<HalloweenIcon name="ghost" />);
      const paths = container.querySelectorAll('path, circle, rect, ellipse');
      expect(paths.length).toBeGreaterThan(0);
    });
  });
});
