/**
 * Architect (Builder)
 * Primary role: maintenance and construction.
 */
const { doCollect, toggleWork, findPrioritySite } = require('utils');

function run(creep) {
    toggleWork(creep);
    if (!creep.memory.working) { doCollect(creep); return; }

    // 1. Urgent repairs
    const urgent = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => (s.hits < s.hitsMax * 0.5 &&
                     s.structureType !== STRUCTURE_WALL &&
                     s.structureType !== STRUCTURE_RAMPART) ||
                     ((s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) &&
                      s.hits < 10000)
    });
    if (urgent) {
        if (creep.repair(urgent) === ERR_NOT_IN_RANGE)
            creep.moveTo(urgent, { visualizePathStyle: { stroke: '#ff9900' } });
        return;
    }

    // 2. Build critical infrastructure
    let site = findPrioritySite(creep, [STRUCTURE_STORAGE, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_RAMPART]);

    // 3. Normal repairs
    if (!site) {
        const damaged = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (s.hits < s.hitsMax * 0.75 &&
                         s.structureType !== STRUCTURE_WALL &&
                         s.structureType !== STRUCTURE_RAMPART) ||
                         ((s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) &&
                          s.hits < 50000)
        });
        if (damaged) {
            if (creep.repair(damaged) === ERR_NOT_IN_RANGE)
                creep.moveTo(damaged, { visualizePathStyle: { stroke: '#ff9900' } });
            return;
        }
    }

    // 4. Build other sites
    if (!site) site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    if (site) {
        if (creep.build(site) === ERR_NOT_IN_RANGE)
            creep.moveTo(site, { visualizePathStyle: { stroke: '#0099ff' } });
        return;
    }

    // 5. Fallback: upgrade controller
    const ctrl = creep.room.controller;
    if (ctrl) {
        if (creep.upgradeController(ctrl) === ERR_NOT_IN_RANGE)
            creep.moveTo(ctrl, { visualizePathStyle: { stroke: '#4ec04e' } });
    }
}

module.exports = { run };
