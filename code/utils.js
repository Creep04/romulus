/**
 * Common utilities for all roles.
 */

function bodyFor(role, energyCap) {
    if (role === 'senator' || role === 'upgrader') {
        if (energyCap >= 1300) return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // 10W, 2C, 4M = 1300
        if (energyCap >= 800) return [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]; // 6W, 2C, 2M = 800
        if (energyCap >= 550) return [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]; // 4W, 1C, 2M = 550
        return [WORK, CARRY, MOVE];
    }

    // Legionnaire (Harvester/Transporter)
    if (role === 'legionnaire' || role === 'harvester') {
        if (energyCap >= 1300) return [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; // 3W, 8C, 11M = 1250 (1:1 full)
        if (energyCap >= 800) return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; // 2W, 5C, 7M = 800 (1:1 full)
        if (energyCap >= 550) return [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // 2W, 3C, 4M = 550 (1:1 full)
        if (energyCap >= 350) return [WORK, WORK, CARRY, MOVE, MOVE]; // 2W, 1C, 2M = 350
        return [WORK, CARRY, MOVE];
    }

    // Architect (Builder/Maintainer)
    if (role === 'architect' || role === 'builder') {
        if (energyCap >= 1300) return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; // 4W, 6C, 10M = 1200 (1:1 full)
        if (energyCap >= 800) return [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]; // 3W, 4C, 6M = 750
        if (energyCap >= 550) return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // 2W, 2C, 4M = 500
        return [WORK, CARRY, MOVE];
    }

    return [WORK, CARRY, MOVE];
}

function nearestEnergy(creep) {
    const role = creep.memory.role;

    // 1. Containers/Storage with energy
    const structures = creep.room.find(FIND_STRUCTURES, {
        filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) &&
                     s.store[RESOURCE_ENERGY] > 10
    });

    if (structures.length) {
        // Senators prefer containers near controller
        if ((role === 'senator' || role === 'upgrader') && creep.room.controller) {
            const nearCtrl = creep.room.controller.pos.findInRange(structures, 4);
            if (nearCtrl.length) {
                const t = creep.pos.findClosestByPath(nearCtrl);
                if (t) return { t, act: 'withdraw' };
            }
        }
        const t = creep.pos.findClosestByPath(structures);
        if (t) return { t, act: 'withdraw' };
    }

    // 2. Dropped energy
    const dropped = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: r => r.resourceType === RESOURCE_ENERGY && r.amount > 10
    });
    if (dropped.length) {
        const t = creep.pos.findClosestByPath(dropped);
        if (t) return { t, act: 'pickup' };
    }

    // 3. Tombstones
    const stones = creep.room.find(FIND_TOMBSTONES, {
        filter: s => s.store[RESOURCE_ENERGY] > 10
    });
    if (stones.length) {
        const t = creep.pos.findClosestByPath(stones);
        if (t) return { t, act: 'withdraw' };
    }

    // 4. Active source
    const sources = creep.room.find(FIND_SOURCES_ACTIVE);
    if (sources.length) {
        // Stable distribution using name hash
        const hash = creep.name.length + creep.name.charCodeAt(creep.name.length - 1);
        const t = sources[hash % sources.length];
        return { t, act: 'harvest' };
    }
    return null;
}

function doCollect(creep) {
    const e = nearestEnergy(creep);
    if (!e) return;
    let r;
    if (e.act === 'harvest')       r = creep.harvest(e.t);
    else if (e.act === 'withdraw') r = creep.withdraw(e.t, RESOURCE_ENERGY);
    else                           r = creep.pickup(e.t);
    if (r === ERR_NOT_IN_RANGE)    creep.moveTo(e.t, { visualizePathStyle: { stroke: '#ffaa00' } });
}

function toggleWork(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) creep.memory.working = false;
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) creep.memory.working = true;
}

function findPrioritySite(creep, types) {
    const sites = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: s => types.includes(s.structureType)
    });
    if (sites.length) {
        sites.sort((a, b) => {
            const indexA = types.indexOf(a.structureType);
            const indexB = types.indexOf(b.structureType);
            if (indexA !== indexB) return indexA - indexB;
            return b.progress - a.progress;
        });
        return sites[0];
    }
    return null;
}

module.exports = { bodyFor, nearestEnergy, doCollect, toggleWork, findPrioritySite };
