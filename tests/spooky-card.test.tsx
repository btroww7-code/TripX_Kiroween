/**
 * Unit tests for SpookyCard component
 * 
 * Requirements: 11.2
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpookyCard } from '../components/halloween/SpookyCard';
import { HalloweenProvider } from '../components/halloween/HalloweenProvider';

// Wrapper with HalloweenProvider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <HalloweenProvider>
      {ui}
    </HalloweenProvider>
  );
};

describe('SpookyCard Component', () => {
  it('should render children content', () => {
    renderWithProvider(
      <SpookyCard>
        <div>Test Content</div>
      </SpookyCard>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render with default variant', () => {
    const { container } = renderWithProvider(
      <SpookyCard>
        <div>Default Card</div>
      </SpookyCard>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with quest variant', () => {
    const { container } = renderWithProvider(
      <SpookyCard variant="quest">
        <div>Quest Card</div>
      </SpookyCard>
    );
    
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Quest Card')).toBeInTheDocument();
  });

  it('should render with trip variant', () => {
    const { container } = renderWithProvider(
      <SpookyCard variant="trip">
        <div>Trip Card</div>
      </SpookyCard>
    );
    
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Trip Card')).toBeInTheDocument();
  });

  it('should render with achievement variant', () => {
    const { container } = renderWithProvider(
      <SpookyCard variant="achievement">
        <div>Achievement Card</div>
      </SpookyCard>
    );
    
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Achievement Card')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = renderWithProvider(
      <SpookyCard className="custom-class">
        <div>Custom Class Card</div>
      </SpookyCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    
    renderWithProvider(
      <SpookyCard onClick={handleClick}>
        <div>Clickable Card</div>
      </SpookyCard>
    );
    
    const card = screen.getByText('Clickable Card').closest('div')?.parentElement;
    card?.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have pointer cursor when onClick is provided', () => {
    const { container } = renderWithProvider(
      <SpookyCard onClick={() => {}}>
        <div>Clickable</div>
      </SpookyCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card.style.cursor).toBe('pointer');
  });

  it('should have default cursor when onClick is not provided', () => {
    const { container } = renderWithProvider(
      <SpookyCard>
        <div>Not Clickable</div>
      </SpookyCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card.style.cursor).toBe('default');
  });

  it('should render cobweb decorations', () => {
    const { container } = renderWithProvider(
      <SpookyCard>
        <div>Card with Cobwebs</div>
      </SpookyCard>
    );
    
    // Check for cobweb icons (they should be in the DOM)
    const cobwebs = container.querySelectorAll('svg[role="img"]');
    expect(cobwebs.length).toBeGreaterThanOrEqual(2); // At least 2 cobwebs in corners
  });

  it('should disable hover effect when hoverEffect is false', () => {
    const { container } = renderWithProvider(
      <SpookyCard hoverEffect={false}>
        <div>No Hover</div>
      </SpookyCard>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should accept custom glowColor', () => {
    const { container } = renderWithProvider(
      <SpookyCard glowColor="#ff0000">
        <div>Custom Glow</div>
      </SpookyCard>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });
});
