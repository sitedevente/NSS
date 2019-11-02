
class GameLoop {
    constructor() {
        this.drawables = new SetArray();
        this.camera = null;
        
        this.counter = 0; -1;
        this.counterLimit = Infinity;
        this.controllers = new SetArray();
        this.controllers.add(function() {
            ++this.counter;
            if(this.counter > this.counterLimit) {this.counter = this.counterLimit;}
        });
    }
    
    update() {
        for(let i = 0; i < this.controllers.length; ++i) {
            this.controllers[i].bind(this)();
        }
        
        return this;
    }
    
    setCamera(camera) {this.camera = camera; return this;}
    getCamera() {return this.camera;}
}

const GAMELOOP = new GameLoop();
const WORLDLOOP = new GameLoop();
WORLDLOOP.setCamera = function setCamera(camera) {CAMERA = camera; this.camera = camera; return this;}
const BATTLELOOP = new GameLoop();
const ESCAPELOOP = new GameLoop();

const NOENTITY = new SetArray();
const ENTITIES = new SetArray();
const COLLIDABLES = new SetArray();
const DRAWABLES = new SetArray();
const PLAYABLES = new SetArray();
var CAMERA = null;
var PLAYER = null;

const INTERACTORS = [];
const INTERRECIPIENTS = [];

let ALLIES_ = new SetArray();
let OPPONENTS_ = new SetArray();
let OBSTACLES = new SetArray();
let NONOBSTACLES = new SetArray();

function addEntity(entity) {
    entity.onadd();
    
    ENTITIES.add(entity);
    
    if(entity.isCollidable()) {
        COLLIDABLES.add(entity);
    }
}

function addEntities(entities) {
    for(var i = 0; i < entities.length; ++i) {
        addEntity(entities[i]);
    }
}

function removeEntity(entity) {
    if(entity instanceof Entity) {
        entity.onremove();
    }
    
    ENTITIES.remove(entity);
    COLLIDABLES.remove(entity);
    // DRAWABLES.remove(entity);
    
    if(entity == PLAYER) {
        PLAYER = null;
    }
}

function clearMap() {
    ENTITIES.clear();
    COLLIDABLES.clear();
    DRAWABLES.clear();
    
    ALLIES_.clear();
    OPPONENTS_.clear();
}

function addDrawable(drawable) {
    if(drawable != null) {
        drawable.setCamera(CAMERA);
        DRAWABLES.add(drawable);
    }
}

function removeDrawable(drawable) {
    DRAWABLES.remove(drawable);
    BATTLEDRAWABLES.remove(drawable);
    GLOBALDRAWABLES.remove(drawable);
    
    if(drawable == COVERDRAWABLE) {
        COVERDRAWABLE = null;
    }
}

function addInteractor(interactor) {
    for(var i = 0; i < INTERACTORS.length; ++i) {
        if(INTERACTORS[i].id == interactor.getId()) {
            INTERACTORS[i].array.add(interactor);
            return;
        }
    }
    
    INTERACTORS.push({"id" : interactor.getId(), "array" : new SetArray(interactor)});
    /**
    if(INTERACTORS.hasOwnProperty(interactor.getId())) {
        INTERACTORS[interactor.getId()].add(interactor);
    } else {
        INTERACTORS[interactor.getId()] = new SetArray(interactor);
    }
    /**/
}

function addInterrecipient(interrecipient) {
    for(var i = 0; i < INTERRECIPIENTS.length; ++i) {
        if(INTERRECIPIENTS[i].id == interrecipient.getId()) {
            INTERRECIPIENTS[i].array.add(interrecipient);
            return;
        }
    }
    
    INTERRECIPIENTS.push({"id" : interrecipient.getId(), "array" : new SetArray(interrecipient)});
    /**
    if(INTERRECIPIENTS.hasOwnProperty(interrecipient.getId())) {
        INTERRECIPIENTS[interrecipient.getId()].add(interrecipient);
    } else {
        INTERRECIPIENTS[interrecipient.getId()] = new SetArray(interrecipient);
    }
    /**/
}

function removeInteractor(interactor) {
    for(var i = INTERACTORS.length - 1; i >= 0; --i) {
        if(INTERACTORS[i].id == interactor.getId()) {
            var array = INTERACTORS[i].array;
            
            for(var j = array.length - 1; j >= 0; --j) {
                if(array[j] == interactor) {
                    array.splice(j, 1);
                }
            }
            
            if(array.length == 0) {
                INTERACTORS.splice(i, 1);
            }
        }
    }
    
    /**
    if(INTERACTORS.hasOwnProperty(interactor.getId())) {
        INTERACTORS[interactor.getId()].remove(interactor);
    }
    /**/
}

function removeInterrecipient(interrecipient) {
    for(var i = INTERRECIPIENTS.length - 1; i >= 0; --i) {
        if(INTERRECIPIENTS[i].id == interrecipient.getId()) {
            var array = INTERRECIPIENTS[i].array;
            
            for(var j = array.length - 1; j >= 0; --j) {
                if(array[j] == interrecipient) {
                    array.splice(j, 1);
                }
            }
            
            if(array.length == 0) {
                INTERRECIPIENTS.splice(i, 1);
            }
        }
    }
    
    /**
    if(INTERRECIPIENTS.hasOwnProperty(interrecipient.getId())) {
        INTERRECIPIENTS[interrecipient.getId()].remove(interrecipient);
    }
    /**/
}

function mainPlayerController() {
    if(PLAYER != null) {
        playerController.bind(PLAYER)();
    }
}

function setPlayer(entity) {
    if(PLAYER instanceof Entity) {
        // PLAYER.controller = noController;
        <!-- PLAYER.controllers.remove(playerController); -->
        gameControllers.remove(mainPlayerController);
    }
    
    PLAYER = entity;
    // entity.controller = playerController;
    <!-- entity.controllers.add(playerController); -->
    gameControllers.add(mainPlayerController);
    entity.addInteraction(new MapWarpable);
    entity.battler.setPlayable(true);
    CAMERA.target = entity;
    
    entity.events["defeat"].push(function() {
        setGameTimeout(function() {
            transitionIn();
        }, 48);
        setGameTimeout(function() {
            loadMap(getCurrentSave().lastMap);
            transitionOut();
        }, 64);
    });
    
    entity.addInteraction(new ItemPicker());
    
    entity.events["hurt"].push(function() {
        ++hitsCount;
    });
    
    addEntity(entity);
}

function setCamera(camera) {
    WORLDLOOP.setCamera(camera);
    addEntity(camera);
}

/*  *
window.addEventListener("keydown", function(event) {
    if(PLAYER != null) {
        for(var i = 0; i < actionevents.length; ++i) {
            if(actionevents[i].keys.includes(event.keyCode)) {
                actionevents[i].oneventdown(PLAYER);
            }
        }
    }
});

/**

window.addEventListener("keyup", function(event) {
    if(PLAYER != null) {
        for(var i = 0; i < actionevents.length; ++i) {
            if(actionevents[i].keys.includes(event.keyCode)) {
                actionevents[i].oneventup(PLAYER);
            }
        }
    }
});

/**

window.addEventListener("mousemove", function(event) {
    if(PLAYER != null) {
        PLAYER.addAction(new MouseFocus());
    }
});

/**

window.addEventListener("mousedown", function(event) {
    if(PLAYER != null) {
        PLAYER.addAction(new MouseFocus());
        for(var i = 0; i < actionevents.length; ++i) {
            if(actionevents[i].mouse.includes(event.which)) {
                actionevents[i].oneventdown(PLAYER);
            }
        }
    }
});

/**

window.addEventListener("mouseup", function(event) {
    if(PLAYER != null) {
        PLAYER.removeActionsWithConstructor(MouseFocus);
        
        for(var i = 0; i < actionevents.length; ++i) {
            if(actionevents[i].mouse.includes(event.which)) {
                actionevents[i].oneventup(PLAYER);
            }
        }
    }
});

/**

window.addEventListener("blur", function(event) {
    if(PLAYER != null) {
        for(let i = 0; i < actionevents.length; ++i) {
            actionevents[i].oneventup(PLAYER);
        }
    }
});

/**/

addEventListener("blur", gamePause);
addEventListener("focus", gameResume);

/**/

let worldCounter = 0;

let loadZone = new Entity([NaN, NaN, NaN], [896, 504, 896]);

function worldUpdate() {
    loadZone.setPositionM(CAMERA.getPositionM());
    loadZone.updateReset();
    
    let entities = ENTITIES.filter(function(entity) {
        return loadZone.collides(entity);
    });
    
    COLLIDABLES.sort(function(a, b) {
        if(a.collide_priority < b.collide_priority) {return -1;}
        if(a.collide_priority > b.collide_priority) {return +1;}
        return 0;
    });
    
    /**/
    
    let collidables = COLLIDABLES.filter(function(collidable) {
        return loadZone.collides(collidable);
    });
    
    /*/
    
    let collidables = entities.filter(function(entity) {
        return entity.isCollidable();
    });
    
    /**/
    
    DRAWABLES.sort(function(a, b) {
        /*  *
        
        let distA = Vector.subtraction(a.getPositionM(), CAMERA.position).getNorm();
        let distB = Vector.subtraction(b.getPositionM(), CAMERA.position).getNorm();
        
        if(distA < distB) {
            return -1;
        } if(distA > distB) {
            return +1;
        }
        
        /*/
        
        if(a.getZIndex() > b.getZIndex()) {
            return -1;
        } if(a.getZIndex() < b.getZIndex()) {
            return +1;
        }
        
        /*  */
        
        return 0;
    });
    
    let drawables = DRAWABLES.filter(function(drawable) {
        if(drawable.cameraMode === "none" || drawable.cameraMode === "reproportion") {return true;}
        
        if(typeof drawable.getPositionM == "undefined") {return true;}
        
        if(drawable instanceof Rectangle) {
            for(let dim = 0; dim < 2; ++dim) {
                if(loadZone.getPosition1(dim) >= drawable.getPosition2(dim) || loadZone.getPosition2(dim) <= drawable.getPosition1(dim)) {
                    return false;
                }
            }
            
            return true;
        }
        
        let drawablePositionM = drawable.getPositionM();
        
        for(let dim = 0; dim < 2; ++dim) {
            if(loadZone.getPosition1() >= drawablePositionM[dim] || loadZone.getPosition2(dim) <= drawablePositionM[dim]) {
                return false;
            }
        }
        
        return true;
    });
    
    for(var i = 0; i < entities.length; ++i) {
        var entity = entities[i];
        
        // entity.controller(entity);
        entity.update();
    }
    
    for(var i = 0; i < ENTITIES.length; ++i) {
        var entity = ENTITIES[i];
        entity.updateReset();
    }
    
    /**/
    
    for(var i = 0; i < collidables.length; ++i) {
        let collidable1 = collidables[i];
        
        /**/
        
        for(var j = i + 1; j < collidables.length; ++j) {
            if(collidables[i].collides(collidables[j])) {
                collidables[i].oncollision(collidables[j]);
                collidables[j].oncollision(collidables[i]);
            }
            
        /*/
        
        for(var j = 0; j < collidable1.whitelist.length; ++j) {
            if(collidable1.collides(collidable1.whitelist[j])) {
                collidable1.oncollision(collidable1.whitelist[j])
            }
            
            /**/
        }
    }
    
    /**
    
    for(var id in INTERACTORS) {
        for(var i = 0; i < INTERACTORS[id].length; ++i) {
            if(INTERRECIPIENTS.hasOwnProperty(id)) {
                for(var j = 0; j < INTERRECIPIENTS[id].length; ++j) {
                    if(INTERACTORS[id][i].collides(INTERRECIPIENTS[id][j])) {
                        INTERACTORS[id][i].interact(INTERRECIPIENTS[id][j]);
                        INTERRECIPIENTS[id][j].oninteraction(INTERACTORS[id][i]);
                    }
                }
            }
        }
    }
    
    /**
    
    INTERACTORS.sort(function(a, b) {
        let a_priority = interactionPriorities.hasOwnProperty(a.id) ? interactionPriorities[a.id] : 0;
        let b_priority = interactionPriorities.hasOwnProperty(b.id) ? interactionPriorities[b.id] : 0;
        
        if(a_priority < b_priority) return -1;
        if(a_priority > b_priority) return +1;
        return 0;
    });
    
    for(let i = 0; i < INTERRECIPIENTS.length; ++i) {
        for(let ii = 0; ii < INTERRECIPIENTS[i].array.length; ++ii) {
            INTERRECIPIENTS[i].array[ii].recipient.collidedWith.clear();
        }
    }
    
    for(let i = 0; i < INTERACTORS.length; ++i) {
        for(let ii = 0; ii < INTERACTORS[i].array.length; ++ii) {
            INTERACTORS[i].array[ii].actor.collidedWith.clear();
            
            for(let j = 0; j < INTERRECIPIENTS.length; ++j) {
                if(INTERRECIPIENTS[j].id == INTERACTORS[i].id) {
                    for(var jj = 0; jj < INTERRECIPIENTS[j].array.length; ++jj) {
                        if(INTERACTORS[i].array[ii].collides(INTERRECIPIENTS[j].array[jj])) {
                            INTERACTORS[i].array[ii].interact(INTERRECIPIENTS[j].array[jj]);
                            INTERRECIPIENTS[j].array[jj].oninteraction(INTERACTORS[i].array[ii]);
                        }
                    }
                }
            }
        }
    }
    
    /**/
    
    
    
    /**/
    
    var context = CANVAS.getContext("2d");
    
    /** DRAWING UPDATE **/
    
    context.fillStyle = "#FFFFFF3F";
    context.fillRect(0, 0, CANVAS.width, CANVAS.height);
    context.clearRect(0, 0, CANVAS.width, CANVAS.height);
    
    /**/
    
    for(var i = 0; i < drawables.length; ++i) {
        let drawable = drawables[i];
        
        /**
        if(i < drawables.length - 1 && drawables[i].getZIndex() < drawables[i + 1].getZIndex()) {
            var drawable = drawables[i + 1];
            drawables[i + 1] = drawables[i];
            drawables[i] = drawable;
        }
        /**/
        
        drawable.update();
        drawable.draw(context);
    }
    
    /**/
}

WORLDLOOP.controllers.add(worldUpdate);

const BATTLERS = new SetArray();
const SKILLS_QUEUE = new SetArray();

var battleturn = 0;
var actorIndex = 0;

function addBattler(entity) {
    if(entity instanceof Entity && entity.isBattler()) {
        var battler = entity.getBattler();// Battler.fromEntity(entity);
        
        battler.onadd();
        
        BATTLERS.add(battler);
    }
}

function addBattlers(battlers) {
    for(var i = 0; i < battlers.length; ++i) {
        addBattler(battlers[i]);
    }
}

function removeBattler(battler) {
    if(battler == MAINBATTLER) {
        battler.oncenterout();
        MAINBATTLER = null;
    }
    
    battler.onremove();
    BATTLERS.remove(battler);
}

function addSkill(skill) {
    SKILLS_QUEUE.add(skill);
}

function removeSkill(skill) {
    SKILLS_QUEUE.remove(skill);
}

/**

BATTLERS.sort(function(a, b) {
    if(a.getPriority() > b.getPriority) return -1;
    if(a.getPriority() < b.getPriority) return +1;
    return 0;
});

/**/

var battleMode = "everyone";
/*
class CommandsPage extends Array {
    constructor() {
        super(...arguments);
        
        this.commandIndex = 0;
        this.drawables = [];
    }
    
    getIndex() {return this.commandIndex;}
    
    decIndex() {
        --this.commandIndex;
        
        if(this.commandIndex < 0) {
            this.commandIndex = 0;
        }
        
        return this;
    }
    
    incIndex() {
        ++this.commandIndex;
        
        if(this.commandIndex >= this.length) {
            this.commandIndex = this.length - 1;
        }
        
        return this;
    }
    
    confirm() {
        this[this.getIndex()].onselect();
        
        return this;
    }
    
    draw(context) {
        let blockWidth = CANVAS.width / 2;
        let blockHeight = CANVAS.height / 9;
        let x = CANVAS.width / 2;
        
        context.fillStyle = "#EFEFEF";
        context.fillRect(x, 6 * CANVAS.height / 9, blockWidth, CANVAS.height / 2);
        
        for(let i = 0; i < this.length; ++i) {
            let y = (6 + i) * CANVAS.height / 9;
            
            context.translate(x, y);
            
            if(i == this.getIndex()) {
                this[i].label.drawSelect(context);
            } else {
                this[i].label.draw(context);
            }
            
            context.translate(-x, -y);
        }
        
        return this;
    }
    
    update() {
        if(keyList.value(K_UP) == 1) {this.decIndex();}
        if(keyList.value(K_DOWN) == 1) {this.incIndex();}
        if(keyList.value(K_RIGHT) == 1 || keyList.value(13) == 1) {this.confirm();}
        if(keyList.value(K_LEFT) == 1) {commands.pop();}
        
        return this;
    }
}

let commands = [];
*/
let MAINBATTLER = null;

const BATTLEDRAWABLES = new SetArray();

const BATTLECAMERA = Camera.fromMiddle([0, 0, 0], [256, 144, 0]);

function setBattleViewPoint(mainBattler) {
    if(MAINBATTLER != null) {
        MAINBATTLER.oncenterout();
    }
    
    MAINBATTLER = mainBattler;
    
    if(MAINBATTLER != null) {
        MAINBATTLER.oncenterin();
    }
}

let battlePhase = "act";

let actIC = 0;

function battleUpdate() {
    if(battlePhase === "strategy") {
        var battlers;
        
        if(battleMode === "everyone") {
            battlers = BATTLERS;
        } else if(battleMode === "single") {
            battlers = new SetArray(BATTLERS[actorIndex]);
        }
        
        /**
        
        if(commands.length < 1 && MAINBATTLER != null) {
            commands.push(MAINBATTLER.getCommandsPage());
        }
        
        // /**
        
        let lastPage = commands[commands.length - 1];
        
        if(commands.length > 0) {
            lastPage.update();
        }
        
        /**/
        
        for(var i = 0; i < battlers.length; ++i) {
            if(!battlers[i].isPlayable()) {
                battlers[i].setReady(true);
            }
        }
        
        // 
        
        if(BATTLERS.length == 0) {
            transitionIn();
            switchPhase("world");
            battlePhase = "act";
            transitionOut();
        } else {
            let allReady = true;
            
            for(var i = 0; i < battlers.length; ++i) {
                var battler = battlers[i];
                
                if(!battler.isReady()) {
                    allReady = false;
                }
            }
            
            if(allReady) {
                for(let i = 0; i < battlers.length; ++i) {
                    battlers[i].setReady(false);
                }
                
                battlePhase = "act"
            }
        }
    }
    
    else if(battlePhase === "act") {
        if(SKILLS_QUEUE.length > 0) {
            SKILLS_QUEUE.sort(function() {
                return 0;
            });
            
            let skill = SKILLS_QUEUE[0];
            
            skill.use(actIC);
            
            ++actIC;
            
            if(!SKILLS_QUEUE.includes(skill)) {
                actIC = 0;
            }
        } else {
            ++actorIndex;
            actorIndex %= BATTLERS.length;
            battlePhase = "strategy";
            
            if(MAINBATTLER == null) {
                let battlers;
                
                if(battleMode === "everyone") {
                    battlers = BATTLERS;
                } else if(battleMode === "single") {
                    battlers = new SetArray(BATTLERS[actorIndex]);
                }
                
                for(let i = battlers.length - 1; i >= 0; --i) {
                    if(battlers[i].isPlayable()) {
                        setBattleViewPoint(battlers[i]);
                    }
                }
            }
            
            if(MAINBATTLER != null) {
                MAINBATTLER.onturnstart();
            }
        }
        
        for(let i = BATTLERS.length - 1; i >= 0; --i) {
            if(BATTLERS[i].getEnergy() <= 0) {
                removeBattler(BATTLERS[i]);
            }
        }
    }
    
    // 
    
    for(let i = BATTLERS.length - 1; i >= 0; --i) {
        let opponents = BATTLERS[i].getOpponents();
        
        if(opponents.length == 0) {
            removeBattler(BATTLERS[i]);
        }
    }
    
    // 
    
    for(let i = 0; i < BATTLERS.length; ++i) {
        BATTLERS[i].update();
    }
    
    // 
    
    var context = CANVAS.getContext("2d");
    context.clearRect(0, 0, CANVAS.width, CANVAS.height);
    
    // 
    
    for(let i = 0; i < BATTLEDRAWABLES.length; ++i) {
        BATTLEDRAWABLES[i].update();
        BATTLEDRAWABLES[i].draw(context);
    }
    /*
    for(let i = 0; i < commands.length; ++i) {
        commands[i].draw(context);
    }*/
}

let escapeCounter = 0;

let itemIndex = 0;
let itemY = 0;
let displayHeight = 9;

function escapeMenu() {
    let inventory = save_getCurrentInventory();
    
    if(keyList.value(K_LEFT) === 1) {
        if(itemIndex > 0) {--itemIndex;}
    } if(keyList.value(K_RIGHT) === 1) {
        if(itemIndex < inventory.items.length - 1) {++itemIndex;}
    } if(keyList.value(K_CONFIRM) === 1) {
        inventory.items[itemIndex].commands[0]();
    } if(keyList.value(222) === 1) {
        save_cdParentInventory();
    } if(keyList.value(K_UP) === 1) {
        if(itemIndex >= inventory.displayWidth) {itemIndex -= inventory.displayWidth;}
    } if(keyList.value(K_DOWN) === 1) {
        if(itemIndex < inventory.items.length - inventory.displayWidth) {itemIndex += inventory.displayWidth;}
    }
    
    if(itemIndex < 0) {itemIndex = 0;}
    
    if(itemIndex >= inventory.items.length) {itemIndex = inventory.items.length - 1;}
    
    if(itemIndex / inventory.displayWidth < itemY) {
        itemY = Math.floor(itemIndex / inventory.displayWidth);
    } else if(itemIndex / inventory.displayWidth >= itemY + displayHeight) {
        itemY = Math.floor(itemIndex / inventory.displayWidth) - displayHeight + 1;
    }
    
    if(keyList.value(97) === 1) {
        let b64 = window.btoa(unescape(encodeURIComponent(JSON.stringify(INVENTORY.getData()))));
        
        let a = document.createElement("a");
        a.href = "data:text/json;base64," + b64;
        a.download = "inventory.json";
        
        a.click();
    } if(keyList.value(98) === 1) {
        let input = document.createElement("input");
        input.type = "file";
        
        input.onchange = function onchange() {
            if(this.files.length > 0) {
                let reader = new FileReader();
                
                reader.onload = function onload() {
                    let b64 = this.result.match(/base64,([\d\D]*)/)[1];
                    
                    try {
                        let data = JSON.parse(decodeURIComponent(escape(atob(b64))));
                        
                        INVENTORY = IC["inventory"].fromData(data);
                    } catch(error) {
                        
                    }
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        };
        
        input.click();
    }
    
    if(keyList.value(K_ESC) == 1) {
        switchPhase(backupPhase);
    }
    
    let context = CANVAS.getContext("2d");
    
    context.fillStyle = "#00003F";
    context.fillRect(0, 0, CANVAS.width, CANVAS.height);
    
    /**/
    
    const marginLR = 8, marginTB = 5;
    const spaceBetween = 4;
    const gridWidth = (640 - 2*marginLR);
    const gridHeight = (120 - 2*marginTB);
    
    for(let i = 0; i < inventory.items.length; ++i) {
        let width = (gridWidth - spaceBetween * (inventory.displayWidth-1)) / inventory.displayWidth, height = width;
        let x = i % inventory.displayWidth;
        x *= width + spaceBetween;
        x += marginLR;
        let y = Math.floor(i / inventory.displayWidth) - itemY;
        y *= height + spaceBetween;
        y += 0 + marginTB;
        
        let hProp = CANVAS.width / 640;
        let vProp = CANVAS.height / 360;
        
        x *= hProp;
        y *= vProp;
        width *= hProp;
        height *= vProp;
        
        if(i === itemIndex) {context.fillStyle = "yellow";}
        else {context.fillStyle = "cyan";}
        context.fillRect(x, y, width, height);
        
        let img = inventory.items[i].getImage();
        
        if(typeof img != "undefined") {
            context.drawImage(img, x, y, width, height);
        }
    }
}

const GLOBALDRAWABLES = new SetArray();
let COVERDRAWABLE = null;

function transitionIn(duration = 16) {
    COVERDRAWABLE = new RectangleDrawable([0, 0], [CANVAS.width, CANVAS.height]);
    COVERDRAWABLE.setCameraMode("none");
    COVERDRAWABLE.setStyle(new ColorTransition(CV_INVISIBLE, CV_BLACK, duration));
}

function transitionOut(duration = 16) {
    if(COVERDRAWABLE != null) {
        COVERDRAWABLE.setStyle(new ColorTransition(CV_BLACK, CV_INVISIBLE, duration));
        COVERDRAWABLE.lifespan = duration + 1;
    }
}

function transitionInOut(durationIn = 16, durationOut = 16) {
    transitionIn(durationIn);
    setGameTimeout(transitionOut.bind(transitionOut, durationOut), durationIn);
}

let gameTimeouts = [];

function setGameTimeout(f, timeout) {
    gameTimeouts.push({"function" : f, "timeout" : timeout});
}

let gameControllers = new SetArray();

function gameUpdate() {
    if(gamePhase == "world") {
        WORLDLOOP.update();
        // worldUpdate();
        
        if(keyList.value(K_ESC) == 1) {
            backupPhase = gamePhase;
            switchPhase("escapeMenu");
        }
    } else if(gamePhase == "battle") {
        battleUpdate();
    } else if(gamePhase == "escapeMenu") {
        escapeMenu();
        ++escapeCounter;
    }
    
    if(gamePhase !== "escapeMenu") {
        escapeCounter = 0;
    }
    
    // 
    
    ++worldCounter;
    
    // 
    
    for(let i = gameTimeouts.length - 1; i >= 0; --i) {
        let gameTimeout = gameTimeouts[i];
        
        if(gameTimeouts[i].timeout > 0) {
            --gameTimeouts[i].timeout;
        } else {
            gameTimeouts[i].function();
            gameTimeouts.splice(i, 1);
        }
    }
    
    for(let i = 0; i < gameControllers.length; ++i) {
        gameControllers[i]();
    }
    
    // 
    
    eventsRecordersUpdate();
    
    for(let i = 0; i < GLOBALDRAWABLES.length; ++i) {
        let drawable = GLOBALDRAWABLES[i];
        
        drawable.update();
        drawable.draw(CANVAS.getContext("2d"));
    }
    
    if(COVERDRAWABLE != null) {
        COVERDRAWABLE.update().draw(CANVAS.getContext("2d"));
    }
}

var gameInterval;
var gamePhase = "world";
var gamePace = WORLD_PACE;

function switchPhase(phase) {
    gamePhase = phase;
}

function switchLoop(loopF, pace = gamePace) {
    gameLoop = loopF;
    gamePace = pace;
    clearInterval(gameInterval);
    gameInterval = setInterval(loopF, pace);
}

function repaceLoop(pace) {
    switchLoop(gameLoop, pace);
}

function loadCheck() {
    if(loadCounter == 0) {
        for(var i = 0; i < IMGS.length; ++i) {
            if(!IMGS[i].complete || IMGS[i].naturalWidth === 0) {
                return;
            }
        }
        
        loadMap(getCurrentSave().lastMap);
        transitionIn(), transitionOut();
        
        switchLoop(gameUpdate, WORLD_PACE);
    }
}

function engageBattle(battlers = NOENTITY) {
    transitionIn();
    addBattlers(battlers);
    switchPhase("battle");
    transitionOut();
}

switchLoop(loadCheck, WORLD_PACE);

function gamePause() {
    clearInterval(gameInterval);
} function gameResume() {
    switchLoop(gameLoop, gamePace);
}

function gameResumeFor(duration = 1) {
    gameResume();
    setGameTimeout(gamePause, duration);
}
