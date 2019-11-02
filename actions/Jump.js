
var jumps = [];

const AS_JUMP = set_gather(ACT_JUMP, "autoJump", "wallJump", "midairJump");

class Jump extends Action {
    constructor() {
        super();
        this.id = ACT_JUMP;
        
        this.direction = new Vector(0, 0);
        this.initialForce = 3.75;
        this.initialForce = 1.75 + 0.125;
        this.reduct = 1.375;// 1.4375;
    }
    
    use() {
        /**/
        if(this.phase == 0) {
            let averagesize = rectangle_averageSize(this.user);
            let positionM = this.user.getPositionM();
            
            /**
            if(this.grounded) {
                for(let i = -0.5; i < 1; i += 0.25) {
                    let left = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getY2()]);
                    left.setSpeed((new Vector(-1, 0)).normalized(Math.random()).rotated(i));
                    addEntity(left);
                    let right = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getY2()]);
                    right.setSpeed((new Vector(+1, 0)).normalized(Math.random()).rotated(-i));
                    addEntity(right);
                }
            } else {
                for(let i = -0.5; i < 1; i += 0.25) {
                    let left = SmokeParticle.fromMiddle([this.user.getXM() - this.wallSide * this.user.getWidth()/2, this.user.getYM()]);
                    left.setSpeed((new Vector(0, -1)).normalized(Math.random()).rotated(this.wallSide*i));
                    addEntity(left);
                    let right = SmokeParticle.fromMiddle([this.user.getXM() - this.wallSide * this.user.getWidth()/2, this.user.getYM()]);
                    right.setSpeed((new Vector(0, +1)).normalized(Math.random()).rotated(-this.wallSide*i));
                    addEntity(right);
                }
            }
            
            /**/
            
            let count = irandom(2, 3);
            
            for(let i = 0; i < count; ++i) {
                let angle = (i - 1) * Math.PI / 8;
                
                let direction = this.direction.rotated(Math.PI + angle);
                
                let particle = SmokeParticle.fromMiddle(Vector.addition(positionM, this.direction.normalized(-averagesize/2)));
                particle.setSpeed(direction.normalized(Math.random()+0.5));
                // particle.removeInterrecipientWithId("replace");
                
                // addEntity(particle);
            }
            
            for(let i = 0; i < count; ++i) {
                let angle = (i - 1) * Math.PI / 8;
                
                let direction = this.direction.rotated(-Math.PI/2 + angle);
                
                let particle = SmokeParticle.fromMiddle(Vector.addition(positionM, this.direction.normalized(-averagesize/2)));
                particle.setSpeed(direction.normalized(Math.random()+0.5));
                // particle.removeInterrecipientWithId("replace");
                
                addEntity(particle);
            }
            
            for(let i = 0; i < count; ++i) {
                let angle = (i - 1) * Math.PI / 8;
                
                let direction = this.direction.rotated(+Math.PI/2 + angle);
                
                let particle = SmokeParticle.fromMiddle(Vector.addition(positionM, this.direction.normalized(-averagesize/2)));
                particle.setSpeed(direction.normalized(Math.random()+0.5));
                // particle.removeInterrecipientWithId("replace");
                
                addEntity(particle);
            }
            
            /**/
            
            let feetPositionM = Vector.addition(this.user.getPositionM(), this.direction.normalized(-averagesize/2));
            
            let direction1 = this.direction.rotated(-Math.PI/2).normalize();
            
            let particle1 = SpikeSmokeParticle.fromMiddle(Vector.addition(feetPositionM, direction1.normalized(0)), [averagesize, averagesize]);
            
            particle1.setSpeed(direction1.normalized(2));
            // particle1.resetSpikeDrawable(irandom(3, 5), new ColorTransition([-Math.PI/5], [+Math.PI/5]), 8, 16, 6);
            particle1.resetSpikeDrawable(irandom(4, 6), new ColorTransition([-Math.PI/5], [+Math.PI/5]), function() {return irandom(8, 10);}, function() {return irandom(12, 18);}, 6);
            
            addEntity(particle1);
            
            let direction2 = this.direction.rotated(+Math.PI/2).normalize();
            
            let particle2 = SpikeSmokeParticle.fromMiddle(Vector.addition(feetPositionM, direction2.normalized(0)), [averagesize, averagesize]);
            
            particle2.setSpeed(direction2.normalized(2));
            // particle2.resetSpikeDrawable(irandom(3, 5), new ColorTransition([-Math.PI/5], [+Math.PI/5]), 8, 16, 6);
            particle2.resetSpikeDrawable(irandom(4, 6), new ColorTransition([-Math.PI/5], [+Math.PI/5]), function() {return irandom(8, 10);}, function() {return irandom(12, 18);}, 6);
            
            addEntity(particle2);
            
            /**/
        }
        /**/
        
        this.user.addState("jumping");
        
        for(var i = 0; i < this.user.getDimension(); ++i) {
            this.user.drag(i, this.direction[i]);
            this.direction[i] /= (this.reduct);
            
            if(isAlmostZero(this.direction[i])) {
                this.direction[i] = 0;
            }
        }
        
        if(this.phase > 0 && this.user.hasState("grounded")) {
            return this.end("grounded");
        }
        
        if(this.direction.isZero()) {
            return this.end("direction zero");
        }
        
        for(var dim = 0; dim < this.direction.length; ++dim) {
            if(this.direction[dim] != 0) {
                
                return this;
            }
        }
        
        return this;
    }
    
    onend() {
        // console.log(this.endid);
        
        this.user.removeState("jumping");
        
        return this;
    }
    
    allowsReplacement(action) {
        return action instanceof MidairJump;
    }
}

class MidairJump extends Jump {
    constructor() {
        super();
        this.setId("midairJump");
    }
    
    use() {
        if(this.phase == 0) {
            this.user.setSpeed(1, -4);
            
            let avgsz = rectangle_averageSize(this.user);
            
            let waveAvgsz = avgsz/12;
            
            let ovalWave = OvalWaveParticle.fromMiddle(Vector.addition(this.user.getPositionM(), [0, avgsz/2]), [waveAvgsz, waveAvgsz]);
            
            ovalWave.setDrawable((new PolygonDrawable(makePathPolygon(makeOvalPath(16, 16, 16)))).rotate(Math.PI).multiplySize(waveAvgsz/16));
            
            ovalWave.drawable.setStyle(new ColorTransition([255, 255, 255, 1], [255, 255, 255, 0.5], 24, powt(4)));
            ovalWave.setSpeed(this.user.speed.times(-0.0625));
            
            ovalWave.direction = [0, 12];
            ovalWave.controllers.add(function() {this.direction[1] /= 2;});
            
            addEntity(ovalWave);
        }
        
        if(this.phase > 30) {
            this.end();
        }
        
        return this;
    }
}

class EnergyJump extends Jump {
    use() {
        if(this.phase == 0) {
            let state = this.user.findState("energyJump-stale");
            let stale = 0;
            
            if(typeof state != "undefined") {
                stale = state.countdown;
            }
            
            this.initialForce /= stale + 1;
            this.direction = Vector.from(this.user.gravityDirection).normalize(-this.initialForce);
        }
        
        if(this.phase < 2) {
            return this;
        }
        
        // this.user.addAction(this.backSmoke);
        
        for(var i = 0; i < this.user.getDimension(); ++i) {
            this.user.drag(i, this.direction[i]);
            this.direction[i] /= (this.reduct);
            
            if(isAlmostZero(this.direction[i])) {
                this.direction[i] = 0;
            }
        }
        
        for(var dim = 0; dim < this.direction.length; ++dim) {
            if(this.direction[dim] != 0) {
                this.user.addAction(this.backSmoke);
                
                return this;
            }
        }
        
        
        this.end();
        
        return this;
    }
    
    onend() {
        let state = this.user.findState("energyJump-stale");
        let stale = 0;
        
        if(typeof state != "undefined") {
            stale = state.countdown;
        }
        
        this.user.addStateObject("energyJump-stale", stale + 16);
        
        return super.onend();
    }
}

class AutoJump extends Action {
    constructor() {
        super();
        this.setId("autoJump");
        
        this.jumpAction = null;
    }
    
    use() {
        if(this.jumpAction === null) {
            let grounded = this.user.hasState("actuallyGrounded");
            let wallState = this.user.findState("wall");
            let ladder = this.user.hasState("ladder");
            
            let midairJump = this.user.findState("midairJump");
            
            if(!grounded && typeof wallState == "undefined" && !ladder && !midairJump) {
                return this;
            }
            
            this.user.removeState("ladder").removeState("ladder-maintain");
            
            let gravityDirection = this.user.findState("gravity");
            
            if(typeof gravityDirection == "undefined") {gravityDirection = [0, 0]}
            else {gravityDirection = gravityDirection.direction}
            
            let jumpForce = this.user.stats["jump-force"];
            
            this.direction = Vector.from(gravityDirection).normalize(-jumpForce);
            
            if(grounded) {
                this.jumpAction = new Jump();
                this.jumpAction.direction = this.direction;
                
                this.user.addAction(this.jumpAction);
            } else if(typeof wallState != "undefined") {
                this.wallSide = wallState.side;
                
                this.direction.rotate(this.wallSide * this.user.stats["walljump-angle"]).normalize(this.user.stats["walljump-force"]);
                
                this.jumpAction = new WallJump();
                
                this.jumpAction.direction = this.direction;
                this.user.addAction(this.jumpAction);
            } else if(ladder) {
                this.jumpAction = new Jump();
                this.jumpAction.direction = this.direction;
                
                this.user.addAction(this.jumpAction);
            } else if(midairJump.count > 0) {
                --midairJump.count;
                this.jumpAction = new MidairJump();
                
                this.user.addAction(this.jumpAction);
            }
        }
        
        if(this.jumpAction && this.jumpAction.endid != -1) {
            this.jumpAction = null;
        }
        
        return this;
    }
    
    onend() {
        this.user.removeAction(this.jumpAction);
        
        return super.onend();
    }
}

AC["autoJump"] = AutoJump;

class WallJump extends Action {
    constructor() {
        super();
        this.setId("wallJump");
        
        this.direction = new Vector(0, 0);
        this.reduct = 1.375;
    }
    
    use() {
        if(this.phase === 0) {
            this.user.removeState("wall");
            
            let avgsz = rectangle_averageSize(this.user);
            let positionM = Vector.addition(this.user.getPositionM(), this.direction.normalized(-avgsz/2));
            
            let direction1 = this.direction.rotated(-3*Math.PI/4).normalize();
            
            let particle1 = SpikeSmokeParticle.fromMiddle(Vector.addition(positionM, direction1.normalized(0)), [avgsz, avgsz]);
            
            particle1.setSpeed(direction1.normalized(2));
            // particle1.resetSpikeDrawable(irandom(3, 5), new ColorTransition([-Math.PI/5], [+Math.PI/5]), 8, 16, 6);
            particle1.resetSpikeDrawable(irandom(3, 5), new ColorTransition([-Math.PI/5], [+Math.PI/5]), function() {return irandom(8, 10);}, function() {return irandom(12, 18);}, 6);
            
            addEntity(particle1);
            
            let direction2 = this.direction.rotated(+3*Math.PI/4).normalize();
            
            let particle2 = SpikeSmokeParticle.fromMiddle(Vector.addition(positionM, direction2.normalized(0)), [avgsz, avgsz]);
            
            particle2.setSpeed(direction2.normalized(2));
            // particle2.resetSpikeDrawable(irandom(3, 5), new ColorTransition([-Math.PI/5], [+Math.PI/5]), 8, 16, 6);
            particle2.resetSpikeDrawable(irandom(3, 5), new ColorTransition([-Math.PI/5], [+Math.PI/5]), function() {return irandom(8, 10);}, function() {return irandom(12, 18);}, 6);
            
            addEntity(particle2);
            
            let smokeCount = irandom(2, 3);
            
            for(let i = 0; i < smokeCount; ++i) {
                let d = direction1.rotated(random(-0.5, +0.5));
                
                let smokeParticle = SmokeParticle.fromMiddle(Vector.addition(positionM, d.normalize(avgsz/2)));
                
                smokeParticle.setSpeed(d.normalize(random(0.75, 1.75)));
                
                addEntity(smokeParticle);
            }
            
            for(let i = 0; i < smokeCount; ++i) {
                let d = direction2.rotated(random(-0.5, +0.5));
                
                let smokeParticle = SmokeParticle.fromMiddle(Vector.addition(positionM, d.normalize(avgsz/2)));
                
                smokeParticle.setSpeed(d.normalize(random(0.75, 1.75)));
                
                addEntity(smokeParticle);
            }
        }
        
        this.user.addState("jumping");
        
        for(var i = 0; i < this.user.getDimension(); ++i) {
            this.user.drag(i, this.direction[i]);
            this.direction[i] /= (this.reduct);
            
            if(isAlmostZero(this.direction[i])) {
                this.direction[i] = 0;
            }
        }
        
        if(this.direction.isZero()) {
            return this.end("direction zero");
        }
        
        return this;
    }
}
