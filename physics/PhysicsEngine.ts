import {
  PhysicsObject,
  WorldBounds,
  PhysicsConfig,
  PhysicsState,
  PhysicsUpdateCallback,
  Vector2D,
  CollisionResult
} from './types';

/**
 * Default physics configuration
 */
const DEFAULT_CONFIG: PhysicsConfig = {
  gravity: { x: 0, y: 0.2 },
  friction: 0.95, // Slightly reduced friction for smoother movement
  bounce: 0.7,    // Reduced bounce for less bouncy balls
  collisionDamping: 0.3 // Reduced damping for less separation between balls
};

/**
 * Physics engine class that handles all physics calculations
 */
export class PhysicsEngine {
  private state: PhysicsState;
  private updateCallbacks: PhysicsUpdateCallback[] = [];
  private animationFrameId: number | null = null;
  private lastTimestamp: number = 0;
  private isRunning: boolean = false;

  /**
   * Creates a new physics engine
   * @param bounds The world bounds
   * @param config Optional physics configuration
   */
  constructor(bounds: WorldBounds, config: Partial<PhysicsConfig> = {}) {
    this.state = {
      objects: [],
      bounds,
      config: { ...DEFAULT_CONFIG, ...config }
    };
  }

  /**
   * Adds an object to the physics simulation
   * @param object The physics object to add
   */
  addObject(object: PhysicsObject): void {
    // Make sure we don't add duplicates
    if (!this.state.objects.some(obj => obj.id === object.id)) {
      this.state.objects.push(object);
    }
  }

  /**
   * Removes an object from the physics simulation
   * @param id The ID of the object to remove
   */
  removeObject(id: string): void {
    this.state.objects = this.state.objects.filter(obj => obj.id !== id);
  }

  /**
   * Updates an existing object in the physics simulation
   * @param updatedObject The updated object
   */
  updateObject(updatedObject: PhysicsObject): void {
    const index = this.state.objects.findIndex(obj => obj.id === updatedObject.id);
    if (index !== -1) {
      this.state.objects[index] = updatedObject;
    }
  }

  /**
   * Clears all objects from the physics simulation
   */
  clearObjects(): void {
    this.state.objects = [];
  }

  /**
   * Updates the world bounds
   * @param bounds The new world bounds
   */
  updateBounds(bounds: WorldBounds): void {
    this.state.bounds = bounds;
  }

  /**
   * Updates the physics configuration
   * @param config The new physics configuration
   */
  updateConfig(config: Partial<PhysicsConfig>): void {
    this.state.config = { ...this.state.config, ...config };
  }

  /**
   * Subscribes to physics updates
   * @param callback The callback to call on each physics update
   * @returns A function to unsubscribe
   */
  subscribe(callback: PhysicsUpdateCallback): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Starts the physics simulation
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.animationFrameId = requestAnimationFrame(this.update);
  }

  /**
   * Stops the physics simulation
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isRunning = false;
  }

  /**
   * The main update loop
   */
  private update = (timestamp: number): void => {
    // Calculate delta time (in seconds)
    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    // Update physics
    this.updatePhysics(deltaTime);

    // Notify subscribers
    this.updateCallbacks.forEach(callback => callback({ ...this.state }));

    // Request next frame
    this.animationFrameId = requestAnimationFrame(this.update);
  };

  /**
   * Updates the physics state
   * @param deltaTime The time since the last update in seconds
   */
  private updatePhysics(deltaTime: number): void {
    // Apply forces and update positions
    this.applyForces(deltaTime);

    // Handle collisions
    this.handleCollisions();
  }

  /**
   * Applies forces to all objects and updates their positions
   * @param deltaTime The time since the last update in seconds
   */
  private applyForces(deltaTime: number): void {
    const { gravity, friction } = this.state.config;
    const { width, height } = this.state.bounds;

    // Maximum velocity to prevent balls from moving too fast
    const MAX_VELOCITY = 5.0;

    // Update each object
    this.state.objects = this.state.objects.map(obj => {
      // Apply gravity
      const newVelocity = {
        x: obj.velocity.x * friction + gravity.x,
        y: obj.velocity.y * friction + gravity.y
      };

      // Limit velocity to prevent excessive speed
      if (Math.abs(newVelocity.x) > MAX_VELOCITY) {
        newVelocity.x = Math.sign(newVelocity.x) * MAX_VELOCITY;
      }
      if (Math.abs(newVelocity.y) > MAX_VELOCITY) {
        newVelocity.y = Math.sign(newVelocity.y) * MAX_VELOCITY;
      }

      // Calculate new position
      const newPosition = {
        x: obj.position.x + newVelocity.x,
        y: obj.position.y + newVelocity.y
      };

      // Handle wall collisions
      const result = this.handleWallCollisions(newPosition, newVelocity, obj.radius, width, height);

      // Return updated object
      return {
        ...obj,
        position: result.position,
        velocity: result.velocity
      };
    });
  }

  /**
   * Handles collisions with walls
   * @param position The object's position
   * @param velocity The object's velocity
   * @param radius The object's radius
   * @param width The world width
   * @param height The world height
   * @returns The updated position and velocity
   */
  private handleWallCollisions(
    position: Vector2D,
    velocity: Vector2D,
    radius: number,
    width: number,
    height: number
  ): { position: Vector2D; velocity: Vector2D } {
    const { bounce } = this.state.config;
    let newPosition = { ...position };
    let newVelocity = { ...velocity };

    // Right wall
    if (newPosition.x + radius > width) {
      newPosition.x = width - radius;
      newVelocity.x = -newVelocity.x * bounce;
    }

    // Left wall
    if (newPosition.x - radius < 0) {
      newPosition.x = radius;
      newVelocity.x = -newVelocity.x * bounce;
    }

    // Bottom wall
    if (newPosition.y + radius > height) {
      newPosition.y = height - radius;
      newVelocity.y = -newVelocity.y * bounce;
    }

    // Top wall
    if (newPosition.y - radius < 0) {
      newPosition.y = radius;
      newVelocity.y = -newVelocity.y * bounce;
    }

    return { position: newPosition, velocity: newVelocity };
  }

  /**
   * Handles collisions between objects
   */
  private handleCollisions(): void {
    const { collisionDamping } = this.state.config;
    const objects = [...this.state.objects];

    // Check for collisions between all pairs of objects
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        const objA = objects[i];
        const objB = objects[j];

        // Check if objects are colliding
        const collision = this.checkCollision(objA, objB);
        if (collision) {
          // Resolve collision
          this.resolveCollision(collision, collisionDamping);
        }
      }
    }
  }

  /**
   * Checks if two objects are colliding
   * @param objA The first object
   * @param objB The second object
   * @returns The collision result or null if no collision
   */
  private checkCollision(objA: PhysicsObject, objB: PhysicsObject): CollisionResult | null {
    // Calculate distance between objects
    const dx = objB.position.x - objA.position.x;
    const dy = objB.position.y - objA.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if objects are colliding
    if (distance < objA.radius + objB.radius) {
      // Calculate collision normal
      const normal: Vector2D = {
        x: dx / distance,
        y: dy / distance
      };

      // Calculate penetration depth
      const penetration = objA.radius + objB.radius - distance;

      return {
        objectA: objA,
        objectB: objB,
        normal,
        penetration
      };
    }

    return null;
  }

  /**
   * Resolves a collision between two objects
   * @param collision The collision result
   * @param damping The collision damping factor
   */
  private resolveCollision(collision: CollisionResult, damping: number): void {
    const { objectA, objectB, normal, penetration } = collision;

    // Find the objects in the state
    const indexA = this.state.objects.findIndex(obj => obj.id === objectA.id);
    const indexB = this.state.objects.findIndex(obj => obj.id === objectB.id);

    if (indexA === -1 || indexB === -1) return;

    const objA = this.state.objects[indexA];
    const objB = this.state.objects[indexB];

    // Calculate relative velocity
    const relativeVelocity = {
      x: objB.velocity.x - objA.velocity.x,
      y: objB.velocity.y - objA.velocity.y
    };

    // Calculate relative velocity along the normal
    const velocityAlongNormal =
      relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;

    // Don't resolve if objects are moving away from each other
    if (velocityAlongNormal > 0) return;

    // Calculate restitution (bounciness)
    const restitution = 0.3; // Moderate bounce

    // Calculate impulse scalar using masses
    // Formula: j = -(1 + e) * (vr · n) / (1/mA + 1/mB)
    const inverseMassSum = (1 / objA.mass) + (1 / objB.mass);
    const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / inverseMassSum;

    // Apply impulse
    const impulseX = impulseMagnitude * normal.x;
    const impulseY = impulseMagnitude * normal.y;

    // Apply impulse based on mass
    this.state.objects[indexA] = {
      ...objA,
      velocity: {
        x: objA.velocity.x - (impulseX / objA.mass),
        y: objA.velocity.y - (impulseY / objA.mass)
      }
    };

    this.state.objects[indexB] = {
      ...objB,
      velocity: {
        x: objB.velocity.x + (impulseX / objB.mass),
        y: objB.velocity.y + (impulseY / objB.mass)
      }
    };

    // Resolve penetration - prevent objects from sinking into each other
    // Use a correction factor based on the size difference between objects
    // Larger size difference = larger correction to prevent small balls from sinking into big ones
    const sizeDifference = Math.abs(objA.radius - objB.radius) / Math.max(objA.radius, objB.radius);
    const baseCorrectionFactor = 0.2; // Base correction factor
    const correctionFactor = baseCorrectionFactor * (1 + sizeDifference); // Adjust based on size difference
    
    // Calculate position corrections inversely proportional to mass
    const totalMass = objA.mass + objB.mass;
    const ratioA = objB.mass / totalMass; // Heavier objects move less
    const ratioB = objA.mass / totalMass;
    
    const correctionX = (penetration * normal.x) * correctionFactor;
    const correctionY = (penetration * normal.y) * correctionFactor;

    this.state.objects[indexA] = {
      ...this.state.objects[indexA],
      position: {
        x: objA.position.x - correctionX * ratioA,
        y: objA.position.y - correctionY * ratioA
      }
    };

    this.state.objects[indexB] = {
      ...this.state.objects[indexB],
      position: {
        x: objB.position.x + correctionX * ratioB,
        y: objB.position.y + correctionY * ratioB
      }
    };
  }

  /**
   * Gets the current physics state
   * @returns The current physics state
   */
  getState(): PhysicsState {
    return { ...this.state };
  }
}
