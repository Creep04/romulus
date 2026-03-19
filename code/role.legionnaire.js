/**
 * Legionnaire (Harvester/Transporter)
 * Primary role: collect energy and deliver to structures.
 */
const { doCollect, toggleWork, findPrioritySite } = require('utils');

function run(creep) {
    toggleWork(creep);
    if (!creep.memory.working) { doCollect(creep); return; }

    // 0. Emergency tower fill — below 300 = defenseless
    const towerEmergency = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER &&
                     s.store[RESOURCE_ENERGY] < 300
    });
    if (towerEmergency) {
        if (creep.transfer(towerEmergency, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            creep.moveTo(towerEmergency, { visualizePathStyle: { stroke: '#ff0000' } });
        return;
    }


    // 1. Fill spawn / extensions (Critical for spawning)
    let fill = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => (s.structureType === STRUCTURE_SPAWN ||
                      s.structureType === STRUCTURE_EXTENSION) &&
                      s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });

    // 2. Fill towers (Critical for defense/maintenance)
    if (!fill) {
        fill = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER &&
                         s.store.getFreeCapacity(RESOURCE_ENERGY) > 200
        });
    }

    // 3. Fill controller container (Critical for Senators)
    const ctrl = creep.room.controller;
    if (!fill && ctrl) {
        const ctrlCont = ctrl.pos.findInRange(FIND_STRUCTURES, 4, {
            filter: s => s.structureType === STRUCTURE_CONTAINER &&
                         s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })[0];
        if (ctrlCont) fill = ctrlCont;
    }

    // 4. Fill storage (Once built, this is the main buffer)
    if (!fill) {
        const storage = creep.room.storage;
        if (storage && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            fill = storage;
        }
    }

    if (fill) {
        if (creep.transfer(fill, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            creep.moveTo(fill, { visualizePathStyle: { stroke: '#ffffff' } });
        return;
    }

    // 5. Build critical infrastructure (Only if economy is fed)
    const archiCount = _.filter(Game.creeps, c => c.memory.role === 'architect' || c.memory.role === 'builder').length;
    // Legionnaires only build if few architects exist or if they have nothing else to do
    if (archiCount < 2) {
        const criticalSite = findPrioritySite(creep, [STRUCTURE_STORAGE, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_RAMPART]);
        if (criticalSite) {
            if (creep.build(criticalSite) === ERR_NOT_IN_RANGE)
                creep.moveTo(criticalSite, { visualizePathStyle: { stroke: '#0099ff' } });
            return;
        }
    }

    // 6. Fallback: upgrade controller
    if (ctrl) {
        if (creep.upgradeController(ctrl) === ERR_NOT_IN_RANGE)
            creep.moveTo(ctrl, { visualizePathStyle: { stroke: '#ffffff' } });
    }
}

module.exports = { run };
