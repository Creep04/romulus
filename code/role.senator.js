/**
 * Senator (Upgrader)
 * Primary role: focus on upgrading the controller.
 */
const { doCollect, toggleWork } = require('utils');

function run(creep) {
    // During severe shortage, don't compete with legionnaires for source energy.
    // Park near controller and wait for economy to recover.
    const storageEnergy = creep.room.storage ? creep.room.storage.store[RESOURCE_ENERGY] : 0;
    if (storageEnergy < 2000 && creep.room.energyAvailable < 400) {
        if (creep.pos.getRangeTo(creep.room.controller) > 3)
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#4ec04e' } });
        return;
    }

    toggleWork(creep);
    if (!creep.memory.working) {
        const storage = creep.room.storage;
        if (storage && storage.store[RESOURCE_ENERGY] > 5000) {
            if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
                creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else {
            doCollect(creep);
        }
        return;
    }
    const ctrl = creep.room.controller;
    if (!ctrl) return;
    if (creep.upgradeController(ctrl) === ERR_NOT_IN_RANGE)
        creep.moveTo(ctrl, { visualizePathStyle: { stroke: '#4ec04e' } });
}

module.exports = { run };
