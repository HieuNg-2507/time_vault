/**
 * Types for the physics engine
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface PhysicsObject {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  mass: number; // Mass of the object, affects collision response
  restitution?: number; // Bounciness
  friction?: number;
  data?: any; // Additional data that can be attached to the object
}

export interface WorldBounds {
  width: number;
  height: number;
}

export interface CollisionResult {
  objectA: PhysicsObject;
  objectB: PhysicsObject;
  normal: Vector2D;
  penetration: number;
}

export interface PhysicsConfig {
  gravity: Vector2D;
  friction: number;
  bounce: number;
  collisionDamping: number;
}

export interface PhysicsState {
  objects: PhysicsObject[];
  bounds: WorldBounds;
  config: PhysicsConfig;
}

export type PhysicsUpdateCallback = (state: PhysicsState) => void;
