const utils = require('utils');
const roleLegionnaire = require('role.legionnaire');
const roleSenator = require('role.senator');
const roleArchitect = require('role.architect');

/* ─── Tower ────────────────────────────────────────────────────────────────── */

function runTower(tower) {
    const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) { tower.attack(hostile); return; }

    const wounded = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: c => c.hits < c.hitsMax
    });
    if (wounded) { tower.heal(wounded); return; }

    if (tower.store[RESOURCE_ENERGY] > 500) {
        const critical = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: s => (s.structureType === STRUCTURE_SPAWN ||
                          s.structureType === STRUCTURE_EXTENSION ||
                          s.structureType === STRUCTURE_TOWER) &&
                          s.hits < s.hitsMax
        });
        if (critical) { tower.repair(critical); return; }

        const container = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_CONTAINER && s.hits < s.hitsMax * 0.8
        });
        if (container) { tower.repair(container); return; }
    }

    if (tower.store[RESOURCE_ENERGY] > 700) {
        const damaged = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.hits < s.hitsMax * 0.8 &&
                         s.structureType !== STRUCTURE_WALL &&
                         s.structureType !== STRUCTURE_RAMPART
        });
        if (damaged) tower.repair(damaged);
    }
}

/* ─── Main loop ────────────────────────────────────────────────────────────── */

module.exports.loop = function () {

    // ── 1. Prune dead-creep memory ──────────────────────────────────────────
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) delete Memory.creeps[name];
    }

    // ── 2. Run towers ───────────────────────────────────────────────────────
    for (const roomName in Game.rooms) {
        Game.rooms[roomName]
            .find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER })
            .forEach(runTower);
    }

    // ── 3. Spawning ─────────────────────────────────────────────────────────
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        if (spawn.spawning) continue;

        const room   = spawn.room;
        const rcl    = room.controller ? room.controller.level : 0;
        const cap    = room.energyCapacityAvailable;
        const avail  = room.energyAvailable;

        const counts = { legionnaire: 0, senator: 0, architect: 0 };
        for (const name in Game.creeps) {
            const c = Game.creeps[name];
            let r = c.memory.role;
            if (r === 'harvester' || (!r && name.startsWith('Legio'))) r = 'legionnaire';
            if (r === 'upgrader'  || (!r && name.startsWith('Senator')) || (!r && name.startsWith('upgrader'))) r = 'senator';
            if (r === 'builder'   || (!r && name.startsWith('Archi'))) r = 'architect';

            if (counts[r] !== undefined) counts[r]++;
        }

        // ── Target population by RCL ─────────────────────────────────────
        const siteCount = room.find(FIND_CONSTRUCTION_SITES).length;
        const storageEnergy = room.storage ? room.storage.store[RESOURCE_ENERGY] : 0;
        const economyRecovering = storageEnergy < 10000;

        let targets = { legionnaire: 3, senator: 1, architect: 0 };
        if (rcl === 2) targets = { legionnaire: 4, senator: 2, architect: 2 };
        if (rcl === 3) targets = { legionnaire: 6, senator: 3, architect: 3 };
        if (rcl >= 4) {
            // When economy is recovering, prioritize harvesters over upgraders
            targets.legionnaire = economyRecovering ? 8 : 6;
            targets.architect = siteCount > 0 ? (siteCount > 10 ? 4 : 2) : 1;
            targets.senator = storageEnergy > 100000 ? 6 : (storageEnergy > 20000 ? 4 : (economyRecovering ? 2 : 3));
        }

        if (Game.time % 10 === 0) {
            console.log(`[${room.name}] RCL:${rcl} Legio:${counts.legionnaire}/${targets.legionnaire} ` +
                        `Senator:${counts.senator}/${targets.senator} Archi:${counts.architect}/${targets.architect} ` +
                        `Sites:${siteCount} Storage:${storageEnergy} Cap:${cap} Avail:${avail}`);
        }

        // ── Emergency bootstrap: few legionnaires → spawn smallest viable ──
        if (counts['legionnaire'] < 3) {
            const emergencyBody = (avail >= 500) ? [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE] :
                                 (avail >= 350) ? [WORK, WORK, CARRY, MOVE, MOVE] :
                                 (avail >= 250) ? [WORK, CARRY, MOVE, MOVE] :
                                 (avail >= 200) ? [WORK, CARRY, MOVE] : null;

            if (emergencyBody) {
                const result = spawn.spawnCreep(emergencyBody, 'Legio_' + Game.time, {
                    memory: { role: 'legionnaire', working: false }
                });
                if (result === OK) break;
            }
            if (counts['legionnaire'] === 0) continue;
        }

        // ── Normal spawn: fill deficit by priority ────────────────────────
        const roles = ['legionnaire', 'senator', 'architect'];
        const roleNames = { legionnaire: 'Legio', senator: 'Senator', architect: 'Archi' };

        for (const role of roles) {
            if (counts[role] < targets[role]) {
                let spawnBody;
                // Allow partial spawning with lower threshold to break death spirals.
                // Senators are capped when economy is recovering to avoid wasting energy.
                const canSpawnPartial = (role === 'legionnaire' || role === 'architect' || (role === 'senator' && counts[role] < 2));

                if (canSpawnPartial && avail < cap && avail >= 550) {
                    // For senators during recovery, cap body to avoid spawning 10-WORK giants
                    const effectiveCap = (role === 'senator' && economyRecovering) ? Math.min(avail, 550) : avail;
                    spawnBody = utils.bodyFor(role, effectiveCap);
                } else {
                    // For senators during recovery, cap body even at full capacity
                    const effectiveCap = (role === 'senator' && economyRecovering) ? Math.min(cap, 550) : cap;
                    spawnBody = utils.bodyFor(role, effectiveCap);
                }

                const result = spawn.spawnCreep(spawnBody, roleNames[role] + '_' + Game.time, {
                    memory: { role, working: false }
                });
                if (result === OK) {
                    console.log('[' + room.name + '] Spawning ' + role +
                                ' body=[' + spawnBody + '] cost=' + avail +
                                (economyRecovering ? ' [RECOVERY]' : ''));
                    break;
                }
            }
        }
    }

    // ── 4. Run creeps ───────────────────────────────────────────────────────
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.spawning) continue;

        let role = creep.memory.role;
        // Legacy mapping for execution
        if (role === 'harvester') role = 'legionnaire';
        if (role === 'upgrader') role = 'senator';
        if (role === 'builder') role = 'architect';

        // Senator only harvests if legionnaire count is healthy
        if (role === 'senator' && !creep.memory.working) {
            const legioCount = _.filter(Game.creeps, c => {
                const r = c.memory.role;
                return r === 'legionnaire' || r === 'harvester';
            }).length;

            if (legioCount < 3 && creep.room.energyAvailable < 200) {
                if (creep.pos.getRangeTo(creep.room.controller) > 3) {
                    creep.moveTo(creep.room.controller);
                }
                continue;
            }
        }

        switch (role) {
            case 'legionnaire': roleLegionnaire.run(creep); break;
            case 'senator':      roleSenator.run(creep);      break;
            case 'architect':    roleArchitect.run(creep);    break;
            default:
                console.log('Unknown role: ' + creep.memory.role);
                roleLegionnaire.run(creep);
        }
    }
};
