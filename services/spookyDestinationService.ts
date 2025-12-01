/**
 * Spooky Destination Service
 * 
 * Business logic for managing spooky destinations.
 * Requirements: 16.1, 16.3, 16.4
 */

import { SpookyDestination } from '../types/halloween';
import { SPOOKY_DESTINATIONS } from '../data/spookyDestinations';
import * as halloweenStorage from './halloweenStorageService';

/**
 * Get all spooky destinations
 */
export const getSpookyDestinations = (): SpookyDestination[] => {
  return SPOOKY_DESTINATIONS;
};

/**
 * Get a spooky destination by ID
 */
export const getSpookyDestinationById = (id: string): SpookyDestination | undefined => {
  return SPOOKY_DESTINATIONS.find(dest => dest.id === id);
};

/**
 * Get destinations filtered by spookiness rating
 */
export const getDestinationsBySpookiness = (minRating: number, maxRating: number = 5): SpookyDestination[] => {
  return SPOOKY_DESTINATIONS.filter(
    dest => dest.spookinessRating >= minRating && dest.spookinessRating <= maxRating
  );
};

/**
 * Get destinations by country
 */
export const getDestinationsByCountry = (country: string): SpookyDestination[] => {
  return SPOOKY_DESTINATIONS.filter(
    dest => dest.country.toLowerCase() === country.toLowerCase()
  );
};

/**
 * Get destinations by tag
 */
export const getDestinationsByTag = (tag: string): SpookyDestination[] => {
  return SPOOKY_DESTINATIONS.filter(
    dest => dest.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
};

/**
 * Mark a destination as visited
 */
export const markAsVisited = (destinationId: string): void => {
  halloweenStorage.addVisitedDestination(destinationId);
  halloweenStorage.incrementDestinationsVisited();
};

/**
 * Check if a destination has been visited
 */
export const isVisited = (destinationId: string): boolean => {
  return halloweenStorage.isDestinationVisited(destinationId);
};

/**
 * Get all visited destinations
 */
export const getVisitedDestinations = (): SpookyDestination[] => {
  const visitedIds = halloweenStorage.getVisitedDestinations();
  return SPOOKY_DESTINATIONS.filter(dest => visitedIds.includes(dest.id));
};

/**
 * Get unvisited destinations
 */
export const getUnvisitedDestinations = (): SpookyDestination[] => {
  const visitedIds = halloweenStorage.getVisitedDestinations();
  return SPOOKY_DESTINATIONS.filter(dest => !visitedIds.includes(dest.id));
};

/**
 * Validate a spooky destination
 */
export const validateSpookyDestination = (destination: SpookyDestination): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Check spookiness rating is between 1 and 5
  if (destination.spookinessRating < 1 || destination.spookinessRating > 5) {
    errors.push(`Spookiness rating must be between 1 and 5 (got ${destination.spookinessRating})`);
  }

  // Check required fields
  if (!destination.id) errors.push('Missing destination ID');
  if (!destination.name) errors.push('Missing destination name');
  if (!destination.location) errors.push('Missing location');
  if (!destination.country) errors.push('Missing country');
  if (!destination.coordinates) errors.push('Missing coordinates');
  if (!destination.description) errors.push('Missing description');

  // Check coordinates are valid
  if (destination.coordinates) {
    if (destination.coordinates.lat < -90 || destination.coordinates.lat > 90) {
      errors.push('Invalid latitude (must be between -90 and 90)');
    }
    if (destination.coordinates.lng < -180 || destination.coordinates.lng > 180) {
      errors.push('Invalid longitude (must be between -180 and 180)');
    }
  }

  // Check activities have valid spookiness levels
  if (destination.activities) {
    destination.activities.forEach((activity, index) => {
      if (activity.spookinessLevel < 1 || activity.spookinessLevel > 5) {
        errors.push(`Activity ${index + 1} has invalid spookiness level (must be 1-5)`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get destination statistics
 */
export const getDestinationStats = () => {
  const visited = halloweenStorage.getVisitedDestinations();
  return {
    total: SPOOKY_DESTINATIONS.length,
    visited: visited.length,
    unvisited: SPOOKY_DESTINATIONS.length - visited.length,
    visitedPercentage: (visited.length / SPOOKY_DESTINATIONS.length) * 100,
  };
};
