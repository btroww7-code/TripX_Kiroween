import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * **Feature: tripx-core, Property 1: Gitignore Does Not Ignore Kiro Directory**
 * **Validates: Requirements 1.5**
 * 
 * This property ensures that the .gitignore file does not contain any patterns
 * that would ignore the .kiro directory or its contents, which is required for
 * hackathon submission.
 */
describe('Kiroween Requirements - Gitignore Validation', () => {
  it('Property 1: .gitignore should NOT ignore .kiro directory', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '.kiro',
          '.kiro/',
          '.kiro/*',
          '.kiro/**',
          '/.kiro',
          '/.kiro/',
          '**/.kiro',
          '**/.kiro/',
          '.kiro/**/*'
        ),
        (kiroPattern) => {
          // Read .gitignore file
          const gitignorePath = path.join(process.cwd(), '.gitignore');
          
          // Check if .gitignore exists
          if (!fs.existsSync(gitignorePath)) {
            // If .gitignore doesn't exist, .kiro is not ignored (pass)
            return true;
          }
          
          const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
          const lines = gitignoreContent.split('\n').map(line => line.trim());
          
          // Check that none of the lines match patterns that would ignore .kiro
          const ignoresKiro = lines.some(line => {
            // Skip empty lines and comments
            if (!line || line.startsWith('#')) {
              return false;
            }
            
            // Check if line matches any .kiro pattern
            return line === kiroPattern || 
                   line.includes('.kiro') && !line.startsWith('!');
          });
          
          // Property: .kiro should NOT be ignored
          return !ignoresKiro;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Unit test: .gitignore should contain .env but not .kiro', () => {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    
    expect(fs.existsSync(gitignorePath), '.gitignore file should exist').toBe(true);
    
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    const lines = gitignoreContent.split('\n').map(line => line.trim());
    
    // Check that .env is ignored
    const ignoresEnv = lines.some(line => 
      line === '.env' || 
      line === '.env.local' || 
      line.startsWith('.env')
    );
    expect(ignoresEnv, '.gitignore should contain .env pattern').toBe(true);
    
    // Check that .kiro is NOT ignored
    const ignoresKiro = lines.some(line => {
      if (!line || line.startsWith('#')) return false;
      return line.includes('.kiro') && !line.startsWith('!');
    });
    expect(ignoresKiro, '.gitignore should NOT ignore .kiro directory').toBe(false);
  });
});

/**
 * **Feature: tripx-core, Property 2: Spec Folder Structure Completeness**
 * **Validates: Requirements 1.7**
 * 
 * This property ensures that each spec folder contains all required files:
 * requirements.md, design.md, and tasks.md
 */
describe('Kiroween Requirements - Spec Folder Structure', () => {
  const requiredSpecs = [
    'tripx-core',
    'ai-trip-generator',
    'nft-passport',
    'quest-system'
  ];

  const requiredFiles = ['requirements.md', 'design.md', 'tasks.md'];

  it('Property 2: All spec folders should contain requirements.md, design.md, and tasks.md', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...requiredSpecs),
        fc.constantFrom(...requiredFiles),
        (specName, fileName) => {
          const specPath = path.join(process.cwd(), '.kiro', 'specs', specName);
          const filePath = path.join(specPath, fileName);
          
          // Property: For any spec folder and any required file, the file should exist
          const specExists = fs.existsSync(specPath);
          if (!specExists) {
            // If spec folder doesn't exist, this is a failure
            return false;
          }
          
          const fileExists = fs.existsSync(filePath);
          return fileExists;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Unit test: .kiro/specs directory should exist with all required specs', () => {
    const specsPath = path.join(process.cwd(), '.kiro', 'specs');
    expect(fs.existsSync(specsPath), '.kiro/specs directory should exist').toBe(true);
    
    // Check each required spec folder
    for (const specName of requiredSpecs) {
      const specPath = path.join(specsPath, specName);
      expect(fs.existsSync(specPath), `Spec folder ${specName} should exist`).toBe(true);
      
      // Check each required file in the spec folder
      for (const fileName of requiredFiles) {
        const filePath = path.join(specPath, fileName);
        expect(
          fs.existsSync(filePath), 
          `File ${fileName} should exist in ${specName}`
        ).toBe(true);
      }
    }
  });

  it('Unit test: .kiro directory should contain steering and hooks subdirectories', () => {
    const kiroPath = path.join(process.cwd(), '.kiro');
    expect(fs.existsSync(kiroPath), '.kiro directory should exist').toBe(true);
    
    const steeringPath = path.join(kiroPath, 'steering');
    expect(fs.existsSync(steeringPath), '.kiro/steering directory should exist').toBe(true);
    
    const hooksPath = path.join(kiroPath, 'hooks');
    expect(fs.existsSync(hooksPath), '.kiro/hooks directory should exist').toBe(true);
    
    const usagePath = path.join(kiroPath, 'KIRO_USAGE.md');
    expect(fs.existsSync(usagePath), '.kiro/KIRO_USAGE.md should exist').toBe(true);
  });
});


/**
 * **Feature: tripx-core, Property 8: Spookiness Rating Validity**
 * **Validates: Requirements 16.3**
 * 
 * This property ensures that all spooky destinations have a valid spookiness rating
 * between 1 and 5 (inclusive).
 */
describe('Kiroween Requirements - Spookiness Rating Validation', () => {
  it('Property 8: All spooky destinations should have spookinessRating between 1 and 5', async () => {
    // Dynamic import to handle ESM module
    const { SPOOKY_DESTINATIONS } = await import('../data/spookyDestinations');
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: SPOOKY_DESTINATIONS.length - 1 }),
        (index) => {
          const destination = SPOOKY_DESTINATIONS[index];
          
          // Property: spookinessRating must be between 1 and 5
          const rating = destination.spookinessRating;
          return rating >= 1 && rating <= 5 && Number.isInteger(rating);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Unit test: All destinations should have valid spookiness ratings', async () => {
    const { SPOOKY_DESTINATIONS } = await import('../data/spookyDestinations');
    
    expect(SPOOKY_DESTINATIONS.length).toBeGreaterThanOrEqual(6);
    
    for (const destination of SPOOKY_DESTINATIONS) {
      expect(destination.spookinessRating).toBeGreaterThanOrEqual(1);
      expect(destination.spookinessRating).toBeLessThanOrEqual(5);
      expect(Number.isInteger(destination.spookinessRating)).toBe(true);
      expect(destination.name).toBeTruthy();
      expect(destination.id).toBeTruthy();
      expect(destination.coordinates).toBeDefined();
      expect(destination.activities.length).toBeGreaterThan(0);
    }
  });

  it('Unit test: All activity spookiness levels should be valid', async () => {
    const { SPOOKY_DESTINATIONS } = await import('../data/spookyDestinations');
    
    for (const destination of SPOOKY_DESTINATIONS) {
      for (const activity of destination.activities) {
        expect(activity.spookinessLevel).toBeGreaterThanOrEqual(1);
        expect(activity.spookinessLevel).toBeLessThanOrEqual(5);
        expect(activity.name).toBeTruthy();
        expect(activity.description).toBeTruthy();
      }
    }
  });
});


/**
 * **Feature: tripx-core, Property 10: Error Message User-Friendliness**
 * **Validates: Requirements 21.5**
 * 
 * This property ensures that error messages shown to users do not contain
 * technical details like stack traces, file paths, or exception names.
 */
describe('Kiroween Requirements - Error Message Validation', () => {
  it('Property 10: Error messages should not contain technical details', async () => {
    const { getUserFriendlyMessage, isUserFriendlyMessage } = await import('../lib/errorMessages');
    
    // Technical error examples that should be converted to user-friendly messages
    const technicalErrors = [
      new Error('TypeError: Cannot read property "x" of undefined at Component.tsx:123'),
      new Error('ECONNREFUSED: Connection refused at 127.0.0.1:3000'),
      new Error('Error: Network request failed\n    at fetch (node_modules/...)\n    at async getData'),
      new Error('401 Unauthorized: Invalid token'),
      new Error('ReferenceError: variable is not defined'),
      new Error('SyntaxError: Unexpected token < in JSON at position 0'),
      'fetch failed: ETIMEDOUT',
      { message: 'Internal Server Error', statusCode: 500 },
    ];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...technicalErrors),
        (error) => {
          const friendlyMessage = getUserFriendlyMessage(error);
          
          // Property: User-friendly message should not contain technical details
          const isFriendly = isUserFriendlyMessage(friendlyMessage);
          return isFriendly;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Unit test: getUserFriendlyMessage should return appropriate messages', async () => {
    const { getUserFriendlyMessage } = await import('../lib/errorMessages');
    
    // Network errors
    expect(getUserFriendlyMessage(new Error('Network request failed'))).toContain('connect');
    expect(getUserFriendlyMessage(new Error('ETIMEDOUT'))).toContain('connect');
    
    // Auth errors
    expect(getUserFriendlyMessage(new Error('401 Unauthorized'))).toContain('sign in');
    expect(getUserFriendlyMessage(new Error('403 Forbidden'))).toContain('permission');
    
    // Wallet errors
    expect(getUserFriendlyMessage(new Error('User rejected transaction'))).toContain('cancelled');
    expect(getUserFriendlyMessage(new Error('Insufficient funds'))).toContain('funds');
    
    // Server errors
    expect(getUserFriendlyMessage(new Error('500 Internal Server Error'))).toContain('wrong');
    
    // Default fallback
    expect(getUserFriendlyMessage(new Error('Some random error xyz123'))).toContain('try again');
  });

  it('Unit test: isUserFriendlyMessage should detect technical content', async () => {
    const { isUserFriendlyMessage } = await import('../lib/errorMessages');
    
    // User-friendly messages
    expect(isUserFriendlyMessage('Please check your internet connection.')).toBe(true);
    expect(isUserFriendlyMessage('Something went wrong. Please try again.')).toBe(true);
    expect(isUserFriendlyMessage('Transaction was cancelled.')).toBe(true);
    
    // Technical messages (should return false)
    expect(isUserFriendlyMessage('at Component.render (Component.tsx:45)')).toBe(false);
    expect(isUserFriendlyMessage('TypeError: Cannot read property')).toBe(false);
    expect(isUserFriendlyMessage('Error in node_modules/react/index.js')).toBe(false);
    expect(isUserFriendlyMessage('[object Object]')).toBe(false);
  });
});
