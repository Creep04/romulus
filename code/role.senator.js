/**
 * Senator (Upgrader)
 * Primary role: focus on upgrading the controller.
 */
const { doCollect, toggleWork } = require('utils');

function run(creep) {
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
