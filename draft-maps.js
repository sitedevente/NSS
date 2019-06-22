
// 

function buildFromData(data) {
    clearEntities();
    
    for(var i = 0; i < data.length; ++i) {
        addEntity(Entity.fromData(data[i]));
    }
}

// 

function mapTest() {
    clearEntities();
    
    // 
    
    addEntity(CAMERA);
    addEntity(new CameraBoundary([-Infinity, -BASEHEIGHT], [Infinity, BASEHEIGHT]));
    addEntity(new CameraBoundary([-Infinity, BASEHEIGHT], [Infinity, BASEHEIGHT]));
    addEntity(new CameraBoundary([-640, -Infinity], [320, Infinity]));
    addEntity(new CameraBoundary([960, -Infinity], [320, Infinity]));
    
    // 
    
    addEntity((new Haple([80, 80], [16, 16])));
    addEntity((new Enemy([320, 128], [16, 16])));
    addEntity((new Enemy([384, 144], [16, 16])));
    
    addEntity((new Target([320 - 64, 120], [16, 16])));
    addEntity((new Target([0, 120], [16, 16])));
    addEntity((new Target([32, 120], [16, 16])));
    addEntity((new Target([64, 120], [16, 16])));
    addEntity((new Target([96, 120], [16, 16])));
    
    // 
    
    addEntity((new GroundArea([0, 0], [320, 360])).setZIndex(1).setStyle(makeCTile("#00BF00", "#007F00")));
    addEntity((new Area([320, 0], [320, 360])).setStyle("#00000000").setOtherThrust(0.125));
    
    // 
    
    addEntity((new Ground([-640, 328], [1920, 32])).setStyle(makeCTile("#EFDF00", "#9F8F00")));
    
    addEntity((new Ground([360, 320], [64, 8])).setStyle("#0000FF").setSpeed([1, 0]).setReplaceable(true));
    addEntity((new Bouncer([576, 320], [64, 16])).setStyle("#00FFBF"));
    addEntity((new Bouncer([0, 320], [64, 16])).setStyle("#00FFBF"));
    
    <!-- addEntity((new Hazard([320, 160], [32, 16])).setStyle("#7F007F")); -->
    
    addEntity((new Ground([360, 288], [64, 2])).setReplaceId(4));
    addEntity((new Ground([424, 288], [64, 16])).setStyle("#7F7F00"));
    addEntity((new Ground([488, 288], [64, 16])).setStyle("#007F7F"));
    
    <!-- addEntity((new Obstacle([600, 0], [16, Infinity]))); -->
    
    
    <!-- addEntity((new Obstacle([240, 0], [16, 160]))); -->
    <!-- addEntity((new Obstacle([240, 176], [16, 160]))); -->
    
    /**
    
    addEntity((new Obstacle([0, 64], BASEWIDTH, -Infinity)));
    addEntity((new Obstacle(0, BASEHEIGHT - 64, BASEWIDTH, Infinity)));
    addEntity((new Obstacle([64, 0], -Infinity, BASEHEIGHT)));
    addEntity((new Obstacle(BASEWIDTH - 64, 0, Infinity, BASEHEIGHT)));
    
    /**/
    
    
    
    // 
    
    addEntity((new AirArea([-Infinity, -Infinity], [Infinity, Infinity])));
    addEntity((new GravityField([320, 0], [512, 320], [+0, +0.25])));
    
    // 
    
    addEntity((new Decoration([16, 304], [16, 80])).setZIndex(-2).setStyle("#9F3F00"));
    addEntity((new Decoration([-640, 0], [640 * 3, 360])).setZIndex(1000).setStyle(makeCTile("#00CFFF", "#00BFEF")));
    
    addEntity((new Decoration([0, 0], [64, 64])).setZIndex(1).setStyle(PTRN_GRASS1));
}

function mapTest2() {
    clearEntities();
    
    addEntity(CAMERA);
    
    addEntity((new Adnyropast([320, 180], [16, 16])));
    
    addEntity((new GroundArea([0, 0], [640, 360])).setZIndex(+1).setStyle(IMG_MAP_DRAFT));
    
    addEntity((new Obstacle([0, 0], [16, 16])).setStyle("#7F7F00"));
    addEntity((new Obstacle([624, 0], [16, 16])).setStyle("#7F7F00"));
    addEntity((new Obstacle([0, 344], [16, 16])).setStyle("#7F7F00"));
    addEntity((new Obstacle([624, 344], [16, 16])).setStyle("#7F7F00"));
    
    addEntity((new Obstacle([0, 16], [16, 328])));
    addEntity((new Obstacle([16, 0], [608, 16])));
    addEntity((new Obstacle([16, 344], [608, 16])));
    addEntity((new Obstacle([624, 16], [16, 328])));
    
    // addEntity((new Obstacle([32, 32], [16, 16])));
    
    /*/ 
    
    addEntity((new Obstacle([224, 80], [8, 8])));
    addEntity((new Obstacle([232, 80], [8, 8])));
    addEntity((new Obstacle([240, 80], [8, 8])));
    addEntity((new Obstacle([248, 80], [8, 8])));
    addEntity((new Obstacle([256, 80], [8, 8])));
    addEntity((new Obstacle([264, 80], [8, 8])));
    addEntity((new Obstacle([272, 80], [8, 8])));
    addEntity((new Obstacle([280, 80], [8, 8])));
    addEntity((new Obstacle([288, 80], [8, 8])));
    addEntity((new Obstacle([296, 80], [8, 8])));
    addEntity((new Obstacle([304, 80], [8, 8])));
    addEntity((new Obstacle([312, 80], [8, 8])));
    addEntity((new Obstacle([320, 80], [8, 8])));
    addEntity((new Obstacle([224, 88], [104, 8])));
    addEntity((new Obstacle([224, 96], [104, 16])));
    addEntity((new Obstacle([224, 112], [104, 24])));
    addEntity((new Obstacle([224, 136], [104, 32])));
    
    /**/ 
    
    addEntity((new Braker([0, 0], [640, 360], 1.25)));
}

function mapTest3() {
    clearEntities();
    
    addEntity((new Haple([312, 32], [16, 16])));
    
    addEntity((new GroundArea([0, 0], [640, 360])).setZIndex(+1).setStyle(IMG_MAP_GRASS));
    
    addEntity((new Obstacle([0, 0], [16, 16])).setStyle(INVISIBLE));
    addEntity((new Obstacle([624, 0], [16, 16])).setStyle(INVISIBLE));
    addEntity((new Obstacle([0, 344], [16, 16])).setStyle(INVISIBLE));
    addEntity((new Obstacle([624, 344], [16, 16])).setStyle(INVISIBLE));
    
    addEntity((new Obstacle([0, 16], [16, 328])).setStyle(INVISIBLE));
    addEntity((new Obstacle([16, 0], [608, 16])).setStyle(INVISIBLE));
    addEntity((new Obstacle([16, 344], [608, 16])).setStyle(INVISIBLE));
    addEntity((new Obstacle([624, 16], [16, 328])).setStyle(INVISIBLE));
    
    addEntity((new Obstacle([64, 64], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([64, 64], [64, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([176, 16], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([120, 64], [8, 232])).setStyle(INVISIBLE));
    addEntity((new Obstacle([64, 288], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([176, 288], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([16, 232], [56, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([64, 184], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([120, 120], [232, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([232, 64], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([120, 232], [120, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([232, 232], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([232, 288], [64, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([288, 288], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([176, 176], [120, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([288, 176], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([288, 16], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([288, 64], [288, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([344, 176], [64, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([400, 120], [8, 120])).setStyle(INVISIBLE));
    addEntity((new Obstacle([288, 232], [232, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([344, 232], [8, 112])).setStyle(INVISIBLE));
    addEntity((new Obstacle([400, 288], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([456, 232], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([456, 288], [120, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([568, 232], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([456, 176], [168, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([456, 64], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([512, 120], [112, 8])).setStyle(INVISIBLE));
    
    addEntity((new Decoration([0, 0], [640, 360])).setStyle(IMG_DCRT_L3));
    
    addEntity((new Braker([0, 0], [640, 360], 1.0009765625)));
}

var maps = {};

maps["test"] = [
    {"position" : [0, 0], "size" : [16, 16], "style" : "#FF0000"},
    {"position" : [32, 0], "size" : [16, 16], "style" : "#00FF00"},
    {"position" : [0, 32], "size" : [16, 16], "style" : "#0000FF"},
    {"position" : [32, 32], "size" : [16, 16], "style" : "#FFFF00"},
    {}
];
