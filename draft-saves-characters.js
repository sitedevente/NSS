
let hitsCount = 0;

function getCharacterData(character) {
    return {
        classId : entity_getClassId(character),
        stats : character.stats,
        energy : character.getEnergy()
    };
}

function updateCurrentCharacter() {
    let entity = PLAYER;
    let characterData = getCurrentCharacterData();
    
    characterData.classId;
    characterData.stats = entity.stats;
    characterData.energy = entity.getEnergy();
}

function getCurrentCharacter() {
    let characterData = getInventoryFromPath(getCurrentSave().playerIdPath).characterData;
    
    return EC[characterData.classId].fromData(characterData);
}

function getCurrentCharacterData() {
    return getInventoryFromPath(getCurrentSave().playerIdPath).characterData;
}
