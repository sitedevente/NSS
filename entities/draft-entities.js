
const BRK_OBST = 1.25;
const BRK_AIR = 1.03125;
const BRK_WATER = 1.25;
var THRUST_OBSTACLE = 1.125;
var THRUST_OBSTACLE = 0.5;
var THRUST_AIR = 0.125;
var THRUST_WATER = 1.0;

class ActorCollidable extends Entity {
    constructor(position, size) {
        super(position, size);
        this.collidable = true;
        this.setEffectFactor("default", 0);
    }
}

class Decoration extends Entity {
    constructor(position, size) {
        super(position, size);
        this.collidable = false;
        this.setEffectFactor("default", 0);
    }
}

class Area extends ActorCollidable {
    constructor(position, size) {
        super(position, size);
    }
}

class Obstacle extends ActorCollidable {
    constructor(position, size) {
        super(position, size);
        this.replaceId = -1;
        this.otherBrake = BRK_OBST;
        this.otherThrust = THRUST_OBSTACLE;
        
        this.addInteraction(new ReplaceActor(-1));
        this.addInteraction(new BrakeActor(BRK_OBST));
        this.addInteraction(new ThrustActor(THRUST_OBSTACLE));
    }
}

class Braker extends ActorCollidable {
    constructor(position, size, otherBrake = 1) {
        super(position, size);
        this.setReplaceId(0);
        this.otherBrake = otherBrake;
        this.setStyle(INVISIBLE);
        
        this.addInteraction(new BrakeActor(otherBrake));
    }
}

class ForceField extends ActorCollidable {
    constructor(position, size, force = [0, 0]) {
        super(position, size);
        this.setStyle(INVISIBLE);
        this.setReplaceId(0);
        this.setOtherBrake(1);
        this.setForce(force);
        
        this.addInteraction(new DragActor(force));
    }
}

class GravityField extends ForceField {
    constructor(position, size, force = [0, +0.25]) {
        super(position, size, force);
    }
}

class Ground extends Obstacle {
    constructor(position, size) {
        super(position, size);
        this.ground = true;
        
        this.addInteraction(new GroundActor());
    }
}

class MovingObstacle extends Ground {
    constructor(position, size) {
        super(position, size);
        this.speed.set(0, 0.1);
    }
}

class Bouncer extends Ground {
    constructor(position, size) {
        super(position, size);
        this.bounce = 1;
        
        this.addInteraction(new ReplaceActor(-1, 1));
    }
}

class Hazard extends Ground {
    constructor(position, size) {
        super(position, size);
        this.setOffense("default", 1);
    }
}

class GroundArea extends Area {
    constructor(position, size) {
        super(position, size);
        this.setReplaceId(0);
        this.otherThrust = THRUST_OBSTACLE;
        this.setOtherBrake(BRK_OBST);
        this.ground = true;
        
        this.addInteraction(new ThrustActor(THRUST_OBSTACLE));
        this.addInteraction(new BrakeActor(BRK_OBST));
        this.addInteraction(new GroundActor());
    }
}

class AirArea extends Area {
    constructor(position, size) {
        super(position, size);
        this.setOtherThrust(THRUST_AIR);
        this.setOtherBrake(BRK_AIR);
        this.setStyle(INVISIBLE);
        this.collide_priority = +1;
        
        this.addInteraction(new BrakeActor(BRK_AIR));
    }
}

class WaterArea extends Area {
    constructor(position, size) {
        super(position, size);
        this.setOtherBrake(BRK_WATER);
        this.otherThrust = THRUST_WATER;
        this.setStyle("#007FFF3F");
        
        this.addInteraction(new BrakeActor(BRK_WATER));
        this.addInteraction(new ThrustActor(THRUST_OBSTACLE));
    }
}

class Target extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setEffectFactor("default", 1);
    }
}

class Router extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setStyle("FF7FFF3F");
        
        this.table = [];
    }
    
    oncollision(other) {
        
        
        return this;
    }
}

const INVISIBLE_VECTOR = new Vector(0, 0, 0, 0);
const WHITE_VECTOR = new Vector(255, 255, 255, 255);

class Particle extends Decoration {
    constructor(position, size) {
        super(position, size);
        this.setZIndex(-1);
        this.setLifespan(1);
        
        this.initialSize = 0, this.endSize = 1;
        this.sizeDuration = 1, this.sizeStep = 0;
        this.sizeTiming = bezierLinear;
    }
    
    getSizeAt(t) {
        var size = new Vector();
        
        for(var dim = 0; dim < this.initialSize.length; ++dim) {
            size[dim] = this.initialSize[dim] + this.sizeTiming(t) * (this.endSize[dim] - this.initialSize[dim]);
        }
        
        return size;
    }
    
    setSizeTransition(initialSize, endSize, sizeDuration = this.sizeDuration) {
        this.initialSize = initialSize;
        this.endSize = endSize;
        
        this.sizeDuration = sizeDuration;
        this.sizeStep = 0;
        
        return this;
    }
    
    update() {
        super.update();
        
        // 
        
        var positionM = this.getPositionM();
        
        this.setSize(Vector.from(this.endSize).subtract(this.initialSize).divide(this.sizeDuration).add(this.getSize()));
        
        this.setPositionM(positionM);
        
        return this;
    }
}

class TpParticle extends Particle {
    constructor(position, size) {
        super(position, size);
    }
}

class CSmokeParticle extends Particle {
    constructor(position, size) {
        super(position, size);
        
        this.setSelfBrake(1.0625);
        this.setLifespan(60);
        // this.setColorTransition([0, 255, 255, 127], [0, 255, 255, 0], 60);
        this.setStyle(new TransitionColor([0, 255, 255, 127], [0, 255, 255, 0], 60));
    }
}

class SmokeParticle extends Particle {
    constructor(position, size) {
        super(position, size);
        
        this.setSelfBrake(1.0625);
        this.setLifespan(60);
        // this.setColorTransition([255, 255, 255, 191], [223, 223, 223, 31], 60);
        this.setStyle(new TransitionColor([255, 255, 255, 191 / 255], [223, 223, 223, 31 / 255], 60));
        this.setStyle(AnimatedImages.from(PTRNS_SMOKE));
    }
}

class FireSmokeParticle extends Particle {
    constructor(position, size) {
        super(position, size);
        
        this.setSelfBrake(1.0625);
        this.setLifespan(60);
        // this.setColorTransition([255, 0, 0, 127], [0, 0, 0, 127], 60);
        this.setStyle(new TransitionColor([255, 0, 0, 127], [0, 0, 0, 127], 60));
    }
}

class Projectile extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setStyle("#FF0000");
        // this.setBlockable(true);
        // this.setBrakeExponent(0);
        // this.setForceFactor(0);
        this.setRegeneration(-1);
        this.setOffense(FX_PIERCING, 1);
    }
    
    oncollision(other) {
        super.oncollision(other);
        
        if(other.getReplaceId() != 0) {
            var particle = TpParticle.fromMiddle(this.getPositionM(), [32, 32]);
            particle.setStyle(new TransitionColor([255, 0, 0, 255], [255, 0, 0, 0], 10));
            particle.setLifespan(10);
            
            addEntity(particle);
            this.setEnergy(0);
        }
        
        return this;
    }
}

class Door extends Entity {
    constructor(position, size) {
        super(position, size);
        
        this.nextMap = "";
    }
}

class Collectible extends Entity {
    constructor(position, size) {
        super(position, size);
        
        this.item = null;
    }
}
