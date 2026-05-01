// Game state

// ===== SOUND EFFECTS (Web Audio API — no files needed) =====
const soundFX = {
    _ctx: null,

    // Lazily create AudioContext on first use (browsers require user gesture first)
    ctx: function() {
        if (!this._ctx) {
            try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch(e) { return null; }
        }
        // Resume if suspended (Chrome autoplay policy)
        if (this._ctx.state === 'suspended') this._ctx.resume();
        return this._ctx;
    },

    // Core helper: play a single tone
    _tone: function(freq, type, startTime, duration, gainStart, gainEnd, ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(gainStart, startTime);
        gain.gain.linearRampToValueAtTime(gainEnd, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
    },

    // 🎉 Catch success — ascending jingle (classic "gotcha!" feel)
    playCatchSuccess: function() {
        const ctx = this.ctx();
        if (!ctx) return;
        const t = ctx.currentTime;
        const notes = [
            { freq: 392, dur: 0.08 },  // G4
            { freq: 523, dur: 0.08 },  // C5
            { freq: 659, dur: 0.08 },  // E5
            { freq: 784, dur: 0.12 },  // G5
            { freq: 1047, dur: 0.20 }, // C6 — held
        ];
        let offset = 0;
        notes.forEach(n => {
            this._tone(n.freq, 'square', t + offset, n.dur, 0.18, 0.0, ctx);
            offset += n.dur + 0.02;
        });
        // Sparkle shimmer after
        setTimeout(() => {
            const ctx2 = this.ctx();
            if (!ctx2) return;
            const t2 = ctx2.currentTime;
            [1200, 1600, 2000].forEach((f, i) => {
                this._tone(f, 'sine', t2 + i * 0.06, 0.12, 0.08, 0.0, ctx2);
            });
        }, 600);
    },

    // 💥 Break free — descending thud
    playBreakFree: function() {
        const ctx = this.ctx();
        if (!ctx) return;
        const t = ctx.currentTime;
        // Descending notes
        this._tone(300, 'sawtooth', t,        0.08, 0.15, 0.0, ctx);
        this._tone(220, 'sawtooth', t + 0.10, 0.08, 0.12, 0.0, ctx);
        this._tone(150, 'sawtooth', t + 0.20, 0.12, 0.10, 0.0, ctx);
        // Low thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, t + 0.22);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.45);
        gain.gain.setValueAtTime(0.25, t + 0.22);
        gain.gain.linearRampToValueAtTime(0.0, t + 0.45);
        osc.start(t + 0.22);
        osc.stop(t + 0.45);
    },

    // ⚔️ Attack hit — short punch
    playHit: function() {
        const ctx = this.ctx();
        if (!ctx) return;
        const t = ctx.currentTime;
        this._tone(180, 'sawtooth', t,       0.04, 0.2, 0.0, ctx);
        this._tone(120, 'square',   t + 0.04, 0.06, 0.15, 0.0, ctx);
    },

    // 🏆 Gym win — triumphant fanfare
    playGymWin: function() {
        const ctx = this.ctx();
        if (!ctx) return;
        const t = ctx.currentTime;
        const fanfare = [
            { freq: 523, dur: 0.1 },
            { freq: 659, dur: 0.1 },
            { freq: 784, dur: 0.1 },
            { freq: 1047, dur: 0.1 },
            { freq: 784, dur: 0.08 },
            { freq: 1047, dur: 0.3 },
        ];
        let off = 0;
        fanfare.forEach(n => {
            this._tone(n.freq, 'square', t + off, n.dur, 0.2, 0.0, ctx);
            off += n.dur + 0.03;
        });
    },

    // ✨ Level up — ascending arpeggio
    playLevelUp: function() {
        const ctx = this.ctx();
        if (!ctx) return;
        const t = ctx.currentTime;
        [262, 330, 392, 523].forEach((f, i) => {
            this._tone(f, 'sine', t + i * 0.09, 0.12, 0.15, 0.0, ctx);
        });
    },

    // ✨ Evolution — sweeping shimmer
    playEvolution: function() {
        const ctx = this.ctx();
        if (!ctx) return;
        const t = ctx.currentTime;
        for (let i = 0; i < 8; i++) {
            const freq = 400 + i * 120;
            this._tone(freq, 'sine', t + i * 0.07, 0.15, 0.12, 0.0, ctx);
        }
    }
};

let player = {
    level: 1,
    xp: 0,
    pokemon: [],
    inventory: {
        pokeball: 10,
        greatball: 10,
        ultraball: 10,
        masterball: 5,
        potion: 5,
        superpotion: 0,
        hyperpotion: 0,
        rarecandy: 0
    },
    credits: 10000,
    pokedex: {},
    hasStarter: false,
    unlockedRegions: ['kanto_forest'],
    badges: [],
    tms: [],
    pc: [],
    _wins: 0,
    _evolutions: 0
};

let currentBattle = null;
let currentRegion = 'kanto_forest';
let gymChallenge = null;
let pendingMoveLearn = null;

const game = {
    getMovesForPokemon: function(pokemon) {
        const type = pokemon.types[0];
        const level = pokemon.level || 5;
        const moves = [];

        const baseMoves = {
            fire: ['ember', 'flamethrower', 'fireBlast'],
            water: ['waterGun', 'surf', 'hydroPump'],
            grass: ['vineWhip', 'razorLeaf', 'solarBeam'],
            electric: ['thunderShock', 'thunderbolt', 'thunder'],
            psychic: ['confusion', 'psychic'],
            ice: ['iceBeam', 'blizzard'],
            dragon: ['dragonRage', 'dragonClaw'],
            dark: ['bite', 'crunch'],
            fighting: ['karateChop', 'brickBreak'],
            ground: ['dig', 'earthquake'],
            rock: ['rockThrow', 'rockSlide'],
            bug: ['furyCutter', 'xScissor'],
            ghost: ['lick', 'shadowBall'],
            steel: ['metalClaw', 'ironTail'],
            fairy: ['fairyWind', 'moonblast'],
            poison: ['poisonSting', 'sludgeBomb'],
            flying: ['gust', 'wingAttack'],
            normal: ['tackle', 'scratch', 'quickAttack', 'slam']
        };

        // Add type moves based on level thresholds
        const typeMoveList = baseMoves[type] || ['tackle'];
        if (level >= 1  && typeMoveList[0] && moveDatabase[typeMoveList[0]]) moves.push(moveDatabase[typeMoveList[0]]);
        if (level >= 20 && typeMoveList[1] && moveDatabase[typeMoveList[1]]) moves.push(moveDatabase[typeMoveList[1]]);
        if (level >= 40 && typeMoveList[2] && moveDatabase[typeMoveList[2]]) moves.push(moveDatabase[typeMoveList[2]]);

        // Add a normal filler move at low levels for variety, and hyper beam late
        if (level >= 5  && type !== 'normal' && moveDatabase.quickAttack && !moves.find(m => m.name === 'Quick Attack')) moves.push(moveDatabase.quickAttack);
        if (level >= 50 && moveDatabase.hyperBeam && !moves.find(m => m.name === 'Hyper Beam')) moves.push(moveDatabase.hyperBeam);

        // Deduplicate and enforce hard cap of 4
        const seen = new Set();
        return moves.filter(m => {
            if (!m || seen.has(m.name)) return false;
            seen.add(m.name);
            return true;
        }).slice(0, 4);
    },

    checkRegionUnlocks: function() {
        if (player.pokemon.length === 0) return;
        
        const maxPokemonLevel = player.pokemon.reduce((max, p) => Math.max(max, p.level), 1);
        let unlocked = false;
        
        regions.forEach(region => {
            if (region.id === 'kanto_forest') return; // Skip first region
            if (!player.unlockedRegions.includes(region.id) && maxPokemonLevel >= region.requiredLevel) {
                player.unlockedRegions.push(region.id);
                ui.showNotification(`🔓 ${region.name} unlocked!`, true);
                unlocked = true;
            }
        });
        
        if (unlocked) {
            ui.updateRegionButtons();
        }
    },

    selectRegion: function(regionId) {
        if (!player.unlockedRegions.includes(regionId)) {
            const region = regionsMap[regionId];
            if (region) {
                ui.showNotification(`🔒 ${region.name} is locked!`, false);
            }
            return;
        }
        ui.selectRegion(regionId);
    },

    calculateCatchRate: function(baseCatchRate, currentHP, maxHP, pokemonRarity) {
        const hpRatio = currentHP / maxHP;
        
        if (hpRatio <= 0.1) return 1.0;
        
        let hpBonus = 0.45;
        if (hpRatio <= 0.2) hpBonus = 0.85;
        else if (hpRatio <= 0.3) hpBonus = 0.7;
        else if (hpRatio <= 0.4) hpBonus = 0.6;
        
        const rarityMod = { common: 1.2, uncommon: 1.0, rare: 0.8, epic: 0.6, legendary: 0.4, mythical: 0.2 };
        
        let catchRate = baseCatchRate * hpBonus * (rarityMod[pokemonRarity] || 1.0);
        
        if (pokemonRarity === 'common' && catchRate < 0.3) catchRate = 0.3;
        
        return Math.min(catchRate, 1.0);
    },

    buddy: {
        currentBuddy: null,
        happiness: 0,
        steps: 0,
        
        setBuddy: function(pokemonIndex) {
            if (pokemonIndex === null) {
                this.currentBuddy = null;
                this.happiness = 0;
                this.steps = 0;
                ui.updateBuddyDisplay();
                ui.showNotification("Buddy removed.", true);
                return;
            }
            
            const pokemon = player.pokemon[pokemonIndex];
            if (!pokemon) return;
            
            this.currentBuddy = { ...pokemon, happiness: this.happiness || 0 };
            ui.updateBuddyDisplay();
            ui.showNotification(`✨ ${pokemon.name} is now your buddy!`, true);
        },
        
        getHappinessLevel: function() {
            if (!this.currentBuddy) return happinessLevels[0];
            for (let i = happinessLevels.length - 1; i >= 0; i--) {
                if (this.currentBuddy.happiness >= happinessLevels[i].threshold) {
                    return happinessLevels[i];
                }
            }
            return happinessLevels[0];
        },
        
        increaseHappiness: function(amount) {
            if (!this.currentBuddy) return;
            this.currentBuddy.happiness = Math.min(500, (this.currentBuddy.happiness || 0) + amount);
            ui.updateBuddyDisplay();
        },
        
        walkWithBuddy: function() {
            if (!this.currentBuddy) return;
            this.steps++;
            if (this.steps >= 10) {
                this.increaseHappiness(1);
                this.steps = 0;
            }
        }
    },

    explore: function() {
        if (!player.hasStarter) { ui.showStarters(); return; }

        // Safety: clear any stale battle/gym state that shouldn't be active
        if (currentBattle && currentBattle._stale) currentBattle = null;

        if (currentBattle) { ui.showBattle(); return; }
        if (gymChallenge) { ui.startGymBattle(); return; }
        
        if (this.buddy.currentBuddy) this.buddy.walkWithBuddy();
        
        const region = regionsMap[currentRegion];
        if (!region) { currentRegion = 'kanto_forest'; return; }
        
        this.checkRegionUnlocks();
        
        if (Math.random() < 0.7) {
            const wildData = this.getRandomPokemonFromRegion();
            if (wildData) ui.showPokemonSelectionForBattle(wildData);
        } else {
            const rand = Math.random();
            if (rand < 0.4) {
                player.inventory.pokeball += 2;
                ui.showMessage(`Found 2 Pokéballs!`);
            } else if (rand < 0.7) {
                player.inventory.potion += 1;
                ui.showMessage(`Found a Potion!`);
            } else {
                player.credits += Math.floor(Math.random() * 100) + 50;
                ui.showMessage(`Found credits!`);
            }
        }
        ui.updateStats();
    },

    startBattleWithPokemon: function(wild, pokemonIndex) {
        const playerPoke = player.pokemon[pokemonIndex];
        
        currentBattle = { 
            wild: wild, 
            player: playerPoke, 
            playerPokemon: player.pokemon,
            currentPokemonIndex: pokemonIndex,
            log: [`Wild ${wild.name} appeared!`] 
        };
        ui.showBattle();
    },

    switchPokemon: function(newIndex) {
        if (!currentBattle) return;
        
        const newPokemon = player.pokemon[newIndex];
        if (newPokemon.currentHP <= 0) {
            ui.showNotification(`${newPokemon.name} has no HP!`, false);
            return;
        }
        
        if (newIndex === currentBattle.currentPokemonIndex) {
            ui.showNotification(`${newPokemon.name} is already battling!`, false);
            return;
        }
        
        currentBattle.currentPokemonIndex = newIndex;
        currentBattle.player = newPokemon;
        currentBattle.log.push(`Switched to ${newPokemon.name}!`);
        ui.showBattle();
    },

    battleAttack: function(moveIndex) {
        const playerPoke = currentBattle.player;
        const wild = currentBattle.wild;
        const move = playerPoke.moves[moveIndex];
        
        if (!move) return;
        
        if (Math.random() * 100 > move.accuracy) {
            currentBattle.log.push(`${playerPoke.name}'s attack missed!`);
            ui.showBattle();
            return;
        }
        
        let damage = Math.floor((playerPoke.attack * move.power) / 50 * (0.8 + Math.random() * 0.4));
        
        let effectiveness = 1.0;
        wild.types.forEach(defenderType => {
            if (typeEffectiveness[move.type] && typeEffectiveness[move.type][defenderType]) {
                effectiveness *= typeEffectiveness[move.type][defenderType];
            }
        });
        
        damage = Math.floor(damage * effectiveness);
        
        const isCritical = Math.random() < 0.0625;
        if (isCritical) damage = Math.floor(damage * 1.5);
        
        wild.currentHP -= damage;
        soundFX.playHit();
        
        let message = `${playerPoke.name} used ${move.name}!`;
        if (effectiveness > 1) message += " Super effective!";
        else if (effectiveness < 1 && effectiveness > 0) message += " Not very effective...";
        
        currentBattle.log.push(message);
        if (isCritical) currentBattle.log.push(`Critical hit!`);
        
        if (wild.currentHP <= 0) { 
            this.endBattle('win'); 
            return; 
        }
        
        const wildMove = wild.moves[Math.floor(Math.random() * wild.moves.length)];
        if (wildMove) {
            let wildDamage = Math.floor((wild.attack * wildMove.power) / 50 * (0.5 + Math.random() * 0.5));
            
            let wildEffectiveness = 1.0;
            playerPoke.types.forEach(defenderType => {
                if (typeEffectiveness[wildMove.type] && typeEffectiveness[wildMove.type][defenderType]) {
                    wildEffectiveness *= typeEffectiveness[wildMove.type][defenderType];
                }
            });
            
            wildDamage = Math.floor(wildDamage * wildEffectiveness);
            playerPoke.currentHP -= wildDamage;
            currentBattle.log.push(`${wild.name} used ${wildMove.name}!`);
        }
        
        if (playerPoke.currentHP <= 0) {
            const alivePokemon = player.pokemon.filter(p => p.currentHP > 0);
            if (alivePokemon.length > 0) {
                currentBattle.log.push(`${playerPoke.name} fainted!`);
                ui.showPokemonSelectionForSwitch();
                return;
            } else {
                this.endBattle('lose');
                return;
            }
        }
        
        ui.showBattle();
    },

    battleUseBall: function(ballType) {
        if (player.inventory[ballType] <= 0) return;
        player.inventory[ballType]--;
        
        const baseCatchRates = { pokeball: 0.3, greatball: 0.5, ultraball: 0.7, masterball: 1.0 };
        const wild = currentBattle.wild;
        
        const catchRate = this.calculateCatchRate(baseCatchRates[ballType], wild.currentHP, wild.maxHP, wild.rarity);
        
        if (Math.random() < catchRate || ballType === 'masterball') {
            const caught = { ...wild, dexId: wild.id, id: Date.now(), currentHP: wild.maxHP, moves: wild.moves };

            if (!player.pc) player.pc = [];

            if (player.pokemon.length >= 6) {
                // Party full — send to PC automatically
                player.pc.push(caught);
                player.pokedex[wild.id] = true;
                const xpGain = Math.floor(wild.level * 30);
                player.xp += xpGain;
                currentBattle = null;
                soundFX.playCatchSuccess();
                ui.showMessage(`✨ Caught ${caught.name}! Party full — sent to PC.`);
            } else {
                player.pokemon.push(caught);
                player.pokedex[wild.id] = true;
                const xpGain = Math.floor(wild.level * 30);
                player.xp += xpGain;
                currentBattle = null;
                soundFX.playCatchSuccess();
                ui.showMessage(`✨ Caught ${caught.name}!`);
            }

            player.credits += Math.floor(wild.level * 20);
            this.checkLevelUp();
            this.checkRegionUnlocks();
        } else {
            soundFX.playBreakFree();
            currentBattle.log.push(`${wild.name} broke free!`);
            ui.showBattle();
        }
        ui.updateStats();
    },

    battleUsePotion: function(potionType) {
        if (player.inventory[potionType] <= 0) return;
        player.inventory[potionType]--;
        
        currentBattle.player.currentHP = Math.min(currentBattle.player.maxHP, currentBattle.player.currentHP + 20);
        currentBattle.log.push(`Used Potion!`);
        
        ui.showBattle();
        ui.updateStats();
    },

    battleRun: function() {
        if (Math.random() < 0.5) {
            currentBattle = null;
            ui.showMessage("Got away safely!");
        } else {
            currentBattle.log.push("Couldn't escape!");
            ui.showBattle();
        }
        ui.updateStats();
    },

    endBattle: function(result) {
        if (!currentBattle) return;
        
        if (result === 'win') {
            const xpGain = Math.floor(currentBattle.wild.level * 40);
            const creditGain = Math.floor(currentBattle.wild.level * 30);
            
            if (currentBattle.player) {
                currentBattle.player.xp = (currentBattle.player.xp || 0) + xpGain;
                this.checkPokemonLevelUp(currentBattle.player);
            }
            
            player.xp += xpGain;
            player.credits += creditGain;
            
            this.checkLevelUp();
            
            currentBattle = null;
            ui.showMessage(`🏆 Won! Gained ${xpGain} XP!`);
        } else {
            player.credits = Math.max(0, player.credits - 50);
            player.pokemon.forEach(p => p.currentHP = Math.max(1, Math.floor(p.maxHP * 0.3)));
            
            currentBattle = null;
            ui.showMessage("😵 You blacked out...");
        }
        
        ui.updateStats();
        this.checkRegionUnlocks();
    },

    checkLevelUp: function() {
        const xpNeeded = player.level * 200;
        while (player.xp >= xpNeeded && player.level < MAX_LEVEL) {
            player.level++;
            player.xp -= xpNeeded;
            ui.showNotification(`🎉 Level ${player.level}!`, true);
        }
    },

    checkPokemonLevelUp: function(pokemon) {
        if (!pokemon) return;
        
        const xpNeeded = pokemon.level * 50;
        let leveledUp = false;
        
        while (pokemon.xp >= xpNeeded && pokemon.level < MAX_LEVEL) {
            pokemon.level++;
            pokemon.xp -= xpNeeded;
            leveledUp = true;
            
            const oldMaxHP = pokemon.maxHP;
            const oldAttack = pokemon.attack;
            
            pokemon.maxHP = Math.floor(pokemon.baseHP * (1 + pokemon.level * 0.1));
            pokemon.attack = Math.floor(pokemon.baseAttack * (1 + pokemon.level * 0.1));
            pokemon.currentHP = pokemon.maxHP;
            
            ui.showNotification(`✨ ${pokemon.name} reached level ${pokemon.level}!`, true);
            soundFX.playLevelUp();
            
            if (oldMaxHP && oldAttack) {
                ui.showNotification(`HP: ${oldMaxHP} → ${pokemon.maxHP} | ATK: ${oldAttack} → ${pokemon.attack}`, true);
            }
            
            this.checkForNewMoves(pokemon);
            this.checkEvolution(pokemon);
        }
        
        if (leveledUp) {
            this.checkRegionUnlocks();
        }
    },

    checkForNewMoves: function(pokemon) {
        const possibleMoves = this.getMovesForPokemon(pokemon);
        const unknownMoves = possibleMoves.filter(move => 
            move && !pokemon.moves.some(oldMove => oldMove && oldMove.name === move.name)
        );
        
        if (unknownMoves.length > 0) {
            const newMove = unknownMoves[0];
            if (pokemon.moves.length < 4) {
                pokemon.moves.push(newMove);
                ui.showNotification(`🎓 ${pokemon.name} learned ${newMove.name}!`, true);
            } else {
                pendingMoveLearn = { pokemon: pokemon, newMove: newMove };
                ui.showMoveLearnChoice(pokemon, newMove);
            }
        }
    },

    checkEvolution: function(pokemon) {
        const evolution = evolutionMap[pokemon.name];
        if (evolution && pokemon.level >= evolution.level) {
            const evolvedForm = pokemonDatabase.find(p => p.name === evolution.evolvesTo);
            if (evolvedForm) {
                pokemon.name = evolvedForm.name;
                pokemon.types = evolvedForm.types;
                pokemon.rarity = evolvedForm.rarity;
                pokemon.dexId = evolvedForm.id;  // update sprite ID to evolved form
                pokemon.maxHP = Math.floor(pokemon.maxHP * 1.2);
                pokemon.attack = Math.floor(pokemon.attack * 1.2);
                pokemon.moves = this.getMovesForPokemon(pokemon);
                ui.showNotification(`✨ Evolved into ${pokemon.name}!`, true);
                soundFX.playEvolution();
            }
        }
    },

    healAllPokemon: function() {
        if (player.pokemon.length === 0) return;
        player.pokemon.forEach(p => p.currentHP = p.maxHP);
        ui.showNotification(`✨ Healed all Pokémon!`, true);
    },

    getRandomPokemonFromRegion: function() {
        const region = regionsMap[currentRegion];
        if (!region) return pokemonDatabase[0];
        
        const rand = Math.random();
        let selectedRarity = 'common';
        let cumulativeChance = 0;
        
        for (const [rarity, def] of Object.entries(rarityDefinitions)) {
            cumulativeChance += def.chance;
            if (rand < cumulativeChance) {
                selectedRarity = rarity;
                break;
            }
        }
        
        const availablePokemon = pokemonDatabase.filter(p => region.pokemon.includes(p.id));
        if (availablePokemon.length === 0) return pokemonDatabase[0];
        
        const basePokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
        const rarityDef = rarityDefinitions[selectedRarity];
        
        let levelMin = Math.max(region.levelMin, rarityDef.levelMin);
        let levelMax = Math.min(region.levelMax, rarityDef.levelMax);
        let level = Math.floor(Math.random() * (levelMax - levelMin + 1)) + levelMin;
        
        return {
            ...basePokemon,
            rarity: selectedRarity,
            level: level,
            currentHP: basePokemon.hp + (level * 5),
            maxHP: basePokemon.hp + (level * 5),
            attack: basePokemon.attack + (level * 2),
            moves: this.getMovesForPokemon({...basePokemon, level: level}),
            isShiny: Math.random() < 0.01
        };
    },

    challengeGym: function() {
        if (!player.hasStarter) { ui.showMessage("Need a Pokémon first!"); return; }
        
        const region = regionsMap[currentRegion];
        if (!region || !region.hasGym) { ui.showMessage("No gym here!"); return; }
        
        const gym = gymLeaders[currentRegion];
        if (!gym) { ui.showMessage("Gym not found!"); return; }
        
        if (player.badges.includes(currentRegion)) { ui.showMessage("Already defeated!"); return; }
        
        ui.showPokemonSelectionForGym(gym);
    },

    startGymBattleWithPokemon: function(gym, pokemonIndex) {
        const playerPoke = player.pokemon[pokemonIndex];
        const gymType = gym.type || 'normal';

        // Type map for gym pokemon sprites/display
        const typeMap = {
            rock: ['rock','ground'], water: ['water'], electric: ['electric'],
            fire: ['fire'], psychic: ['psychic'], dragon: ['dragon','flying'], normal: ['normal']
        };

        gymChallenge = {
            leader: gym.name,
            badge: gym.badge,
            reward: gym.reward,
            gymType: gymType,
            pokemon: gym.pokemon.map(p => {
                const pTypes = typeMap[gymType] || ['normal'];
                const dbPokemon = pokemonDatabase ? pokemonDatabase.find(db => db.name === p.name) : null;
                const moves = dbPokemon
                    ? this.getMovesForPokemon({...dbPokemon, level: p.level})
                    : [moveDatabase.tackle, moveDatabase.quickAttack].filter(Boolean);
                return {
                    ...p,
                    dexId: dbPokemon ? dbPokemon.id : null,
                    types: dbPokemon ? dbPokemon.types : pTypes,
                    currentHP: p.hp,
                    maxHP: p.hp,
                    moves: moves.length > 0 ? moves : [moveDatabase.tackle].filter(Boolean)
                };
            }),
            currentPokemon: 0,
            player: playerPoke,
            log: [`You challenge Gym Leader ${gym.name}!`]
        };
        ui.startGymBattle();
    },

    gymAttackWithMove: function(moveIndex) {
        if (!gymChallenge) return;

        const playerPoke = gymChallenge.player;
        const gymPokemon = gymChallenge.pokemon[gymChallenge.currentPokemon];
        const move = playerPoke.moves[moveIndex];

        if (!move) { this.gymAttack(); return; }

        // Player attacks with move + type effectiveness
        let damage = Math.floor((playerPoke.attack * move.power) / 50 * (0.8 + Math.random() * 0.4));
        let effectiveness = 1.0;
        if (gymPokemon.types) {
            gymPokemon.types.forEach(defType => {
                if (typeEffectiveness[move.type] && typeEffectiveness[move.type][defType]) {
                    effectiveness *= typeEffectiveness[move.type][defType];
                }
            });
        }
        damage = Math.floor(damage * effectiveness);
        const isCrit = Math.random() < 0.0625;
        if (isCrit) damage = Math.floor(damage * 1.5);

        gymPokemon.currentHP -= damage;
        let msg = `${playerPoke.name} used ${move.name}!`;
        if (effectiveness > 1) msg += ' Super effective!';
        else if (effectiveness < 1 && effectiveness > 0) msg += ' Not very effective...';
        if (isCrit) msg += ' Critical hit!';
        gymChallenge.log.push(msg);

        if (gymPokemon.currentHP <= 0) {
            gymChallenge && gymChallenge.log.push(`${gymPokemon.name} fainted!`);
            gymChallenge.currentPokemon++;
            if (gymChallenge.currentPokemon >= gymChallenge.pokemon.length) {
                this.winGymBattle();
                return;
            }
        }

        // Gym pokemon counter-attacks
        const gymMove = gymPokemon.moves[Math.floor(Math.random() * gymPokemon.moves.length)];
        if (gymMove && gymPokemon.currentHP > 0) {
            let gymDmg = Math.floor((gymPokemon.attack * gymMove.power) / 50 * (0.5 + Math.random() * 0.5));
            let gymEff = 1.0;
            playerPoke.types.forEach(defType => {
                if (typeEffectiveness[gymMove.type] && typeEffectiveness[gymMove.type][defType]) {
                    gymEff *= typeEffectiveness[gymMove.type][defType];
                }
            });
            gymDmg = Math.floor(gymDmg * gymEff);
            playerPoke.currentHP -= gymDmg;
            gymChallenge && gymChallenge.log.push(`${gymPokemon.name} used ${gymMove.name}! (-${gymDmg} HP)`);
        } else if (gymPokemon.currentHP > 0) {
            let gymDmg = Math.floor(gymPokemon.attack * (0.5 + Math.random() * 0.5));
            playerPoke.currentHP -= gymDmg;
            gymChallenge && gymChallenge.log.push(`${gymPokemon.name} attacked! (-${gymDmg} HP)`);
        }

        if (playerPoke.currentHP <= 0) {
            this.loseGymBattle();
            return;
        }

        if (gymChallenge) ui.startGymBattle();
    },

    gymAttack: function() {
        if (!gymChallenge) return;
        
        const playerPoke = gymChallenge.player;
        const gymPokemon = gymChallenge.pokemon[gymChallenge.currentPokemon];
        
        let damage = Math.floor(playerPoke.attack * (0.8 + Math.random() * 0.4));
        gymPokemon.currentHP -= damage;
        gymChallenge.log.push(`Dealt ${damage} damage!`);
        
        if (gymPokemon.currentHP <= 0) {
            gymChallenge && gymChallenge.log.push(`${gymPokemon.name} fainted!`);
            gymChallenge.currentPokemon++;
            
            if (gymChallenge.currentPokemon >= gymChallenge.pokemon.length) {
                this.winGymBattle();
                return;
            }
        }
        
        let gymDamage = Math.floor(gymPokemon.attack * (0.5 + Math.random() * 0.5));
        playerPoke.currentHP -= gymDamage;
        gymChallenge && gymChallenge.log.push(`${gymPokemon.name} dealt ${gymDamage} damage!`);
        
        if (playerPoke.currentHP <= 0) {
            this.loseGymBattle();
            return;
        }
        
        if (gymChallenge) ui.startGymBattle();
    },

    winGymBattle: function() {
        // Clear gymChallenge FIRST — before anything that could throw
        const savedChallenge = gymChallenge;
        gymChallenge = null;
        currentBattle = null;

        try {
            const gym = gymLeaders[currentRegion];
            if (!gym) throw new Error('Gym not found');

            if (!player.badges.includes(currentRegion)) {
                player.badges.push(currentRegion);
            }
            player.credits += gym.reward || 0;
            ui.updateBadges();
            ui.updateStats();

            const typeColors = {
                fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
                psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
                rock:'#B8A038',normal:'#A8A878'
            };
            const tc = typeColors[gym.type] || '#ffd700';

            document.getElementById('gameScreen').innerHTML = `
                <div style="text-align:center;padding:30px;">
                    <div style="font-size:3em;margin-bottom:10px;">🏆</div>
                    <h2 style="color:#ffd700;margin-bottom:8px;">Victory!</h2>
                    <p style="color:#ddd;margin-bottom:16px;">You defeated <strong style="color:${tc};">${gym.name}</strong>!</p>
                    <div style="background:rgba(255,215,0,0.1);border:2px solid #ffd700;border-radius:14px;padding:16px;margin:0 auto 20px;max-width:260px;">
                        <div style="font-size:2em;margin-bottom:6px;">🏅</div>
                        <div style="color:#ffd700;font-weight:bold;font-size:1.1em;">${gym.badge}</div>
                        <div style="color:#aaa;font-size:0.85em;margin-top:4px;">+💰${gym.reward} credits earned</div>
                    </div>
                    <button onclick="game.explore()" style="padding:14px 36px;font-size:1.1em;background:linear-gradient(135deg,#4caf50,#388e3c);border-radius:14px;border:2px solid #ffd700;">
                        Continue Exploring →
                    </button>
                </div>`;

            try { soundFX.playGymWin(); } catch(e) {}
            this.checkRegionUnlocks();

        } catch(err) {
            console.error('winGymBattle error:', err);
            // Even if something broke, still show a working screen
            document.getElementById('gameScreen').innerHTML = `
                <div style="text-align:center;padding:30px;">
                    <div style="font-size:3em;">🏆</div>
                    <h2 style="color:#ffd700;margin:10px 0;">Gym Cleared!</h2>
                    <button onclick="game.explore()" style="padding:14px 36px;font-size:1.1em;background:linear-gradient(135deg,#4caf50,#388e3c);border-radius:14px;border:2px solid #ffd700;margin-top:10px;">
                        Continue Exploring →
                    </button>
                </div>`;
        }
    },

    loseGymBattle: function() {
        // Clear state first
        gymChallenge = null;
        currentBattle = null;
        player.credits = Math.max(0, player.credits - 200);
        document.getElementById('gameScreen').innerHTML = `
            <div style="text-align:center;padding:30px;">
                <div style="font-size:3em;margin-bottom:10px;">😵</div>
                <h2 style="color:#ff4444;margin-bottom:8px;">Defeated!</h2>
                <p style="color:#aaa;margin-bottom:20px;">You lost 200 credits. Train harder and try again!</p>
                <button onclick="game.explore()" style="padding:14px 36px;font-size:1.1em;background:linear-gradient(135deg,#f44336,#b71c1c);border-radius:14px;">
                    Back to Exploring
                </button>
            </div>`;
        ui.updateStats();
    },

    gymFlee: function() {
        // Always succeeds fleeing a gym — clears gymChallenge so explore works again
        gymChallenge = null;
        document.getElementById('gameScreen').innerHTML = `
            <div style="text-align:center;padding:30px;">
                <div style="font-size:3em;margin-bottom:10px;">🏃</div>
                <h2 style="color:#aaa;margin-bottom:8px;">You fled!</h2>
                <p style="color:#aaa;margin-bottom:20px;">You retreated from the gym. Come back when you're ready!</p>
                <button onclick="game.explore()" style="padding:14px 36px;font-size:1.1em;background:linear-gradient(135deg,#555,#333);border-radius:14px;border:1px solid #888;">
                    Back to Exploring
                </button>
            </div>`;
        ui.updateStats();
    },

    removePokemon: function(index) {
        if (player.pokemon.length <= 1) {
            ui.showNotification("Can't release last Pokémon!", false);
            return;
        }
        if (confirm(`Release ${player.pokemon[index].name}?`)) {
            player.pokemon.splice(index, 1);
            ui.showPokemon();
        }
    }
};

// ===== ACHIEVEMENTS SYSTEM =====
const achievements = {
    list: [
        { id: 'first_catch',   icon: '🎣', name: 'First Catch!',       desc: 'Catch your first Pokémon',          check: () => Object.keys(player.pokedex).length >= 1 },
        { id: 'catch_10',      icon: '🏅', name: 'Collector',          desc: 'Catch 10 different Pokémon',        check: () => Object.keys(player.pokedex).length >= 10 },
        { id: 'catch_50',      icon: '🥇', name: 'Master Collector',   desc: 'Catch 50 different Pokémon',        check: () => Object.keys(player.pokedex).length >= 50 },
        { id: 'first_battle',  icon: '⚔️',  name: 'First Victory',     desc: 'Win your first battle',             check: () => (player._wins || 0) >= 1 },
        { id: 'win_10',        icon: '🥊', name: 'Battle Veteran',     desc: 'Win 10 battles',                    check: () => (player._wins || 0) >= 10 },
        { id: 'win_50',        icon: '🏟️', name: 'Battle Master',      desc: 'Win 50 battles',                   check: () => (player._wins || 0) >= 50 },
        { id: 'first_badge',   icon: '🏆', name: 'Badge Earner',       desc: 'Earn your first gym badge',         check: () => player.badges.length >= 1 },
        { id: 'all_badges',    icon: '🌟', name: 'Gym Champion',       desc: 'Collect all 8 badges',              check: () => player.badges.length >= 8 },
        { id: 'first_evolve',  icon: '✨', name: 'Evolution!',         desc: 'Evolve a Pokémon',                  check: () => (player._evolutions || 0) >= 1 },
        { id: 'level_10',      icon: '📈', name: 'Rising Trainer',     desc: 'Reach trainer level 10',            check: () => player.level >= 10 },
        { id: 'level_50',      icon: '🚀', name: 'Elite Trainer',      desc: 'Reach trainer level 50',            check: () => player.level >= 50 },
        { id: 'rich',          icon: '💰', name: 'Rich Trainer',       desc: 'Accumulate 50,000 credits',         check: () => player.credits >= 50000 },
        { id: 'shiny_catch',   icon: '💎', name: 'Shiny Hunter',       desc: 'Catch a shiny Pokémon',             check: () => player.pokemon.some(p => p.isShiny) },
        { id: 'full_team',     icon: '👥', name: 'Full Team',          desc: 'Have 6 Pokémon in your party',      check: () => player.pokemon.length >= 6 },
        { id: 'buddy',         icon: '🤝', name: 'Best Friends',       desc: 'Set a buddy Pokémon',               check: () => !!game.buddy.currentBuddy },
        { id: 'unlock_region', icon: '🗺️', name: 'Explorer',           desc: 'Unlock a new region',               check: () => player.unlockedRegions.length >= 2 },
        { id: 'all_regions',   icon: '🌏', name: 'World Traveller',    desc: 'Unlock all 8 regions',              check: () => player.unlockedRegions.length >= 8 },
        { id: 'buy_tm',        icon: '📀', name: 'TM Collector',       desc: 'Buy your first TM',                 check: () => (player.tms || []).length >= 1 },
    ],

    // Read from localStorage
    getUnlocked: function() {
        try { return JSON.parse(localStorage.getItem('pokequest_achievements') || '[]'); }
        catch(e) { return []; }
    },

    // Save to localStorage
    _save: function(unlocked) {
        try { localStorage.setItem('pokequest_achievements', JSON.stringify(unlocked)); }
        catch(e) {}
    },

    // Run all checks — call this after any game event
    check: function() {
        const unlocked = this.getUnlocked();
        let changed = false;
        this.list.forEach(ach => {
            if (!unlocked.includes(ach.id)) {
                try {
                    if (ach.check()) {
                        unlocked.push(ach.id);
                        changed = true;
                        this.showToast(ach);
                    }
                } catch(e) {}
            }
        });
        if (changed) this._save(unlocked);
    },

    // Reset all achievements (used on game reset)
    reset: function() {
        try { localStorage.removeItem('pokequest_achievements'); }
        catch(e) {}
    },

    showToast: function(ach) {
        // Stack toasts if multiple fire at once
        const existing = document.querySelectorAll('.achievement-toast');
        const offset = existing.length * 80;

        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.style.top = (80 + offset) + 'px';
        toast.innerHTML = `
            <div class="ach-icon">${ach.icon}</div>
            <div class="ach-text">
                <div class="ach-title">🏆 Achievement Unlocked!</div>
                <div class="ach-name">${ach.name}</div>
                <div style="color:#aaa;font-size:0.78em;">${ach.desc}</div>
            </div>`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; }, 4000);
        setTimeout(() => toast.remove(), 4500);
    }
};

// ===== BATTLE ANIMATIONS =====
const battleFX = {
    showDamageNumber: function(damage, x, y, color) {
        const el = document.createElement('div');
        el.className = 'damage-float';
        el.style.left = (x || window.innerWidth/2) + 'px';
        el.style.top = (y || window.innerHeight/2) + 'px';
        el.style.color = color || '#ff4444';
        el.textContent = '-' + damage;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 900);
    },

    shakeElement: function(el) {
        if (!el) return;
        el.classList.remove('hit-shake', 'hit-flash');
        void el.offsetWidth; // reflow
        el.classList.add('hit-shake', 'hit-flash');
        setTimeout(() => { el.classList.remove('hit-shake', 'hit-flash'); }, 450);
    },

    superEffectiveFlash: function(el) {
        if (!el) return;
        el.classList.remove('super-flash');
        void el.offsetWidth;
        el.classList.add('super-flash');
        setTimeout(() => el.classList.remove('super-flash'), 450);
    }
};

// Hook achievements into game events — patch key functions after they're defined

const _origEndBattle = game.endBattle.bind(game);
game.endBattle = function(result) {
    if (result === 'win') {
        player._wins = (player._wins || 0) + 1;
    }
    _origEndBattle(result);
    achievements.check();
};

const _origCheckEvolution = game.checkEvolution.bind(game);
game.checkEvolution = function(pokemon) {
    const nameBefore = pokemon.name;
    _origCheckEvolution(pokemon);
    if (pokemon.name !== nameBefore) {
        player._evolutions = (player._evolutions || 0) + 1;
        achievements.check();
    }
};

const _origWinGym = game.winGymBattle.bind(game);
game.winGymBattle = function() {
    _origWinGym();
    achievements.check();
};

const _origBattleUseBall = game.battleUseBall.bind(game);
game.battleUseBall = function(ballType) {
    _origBattleUseBall(ballType);
    achievements.check();
};

const _origCheckRegionUnlocks = game.checkRegionUnlocks.bind(game);
game.checkRegionUnlocks = function() {
    _origCheckRegionUnlocks();
    achievements.check();
};

const _origSetBuddy = game.buddy.setBuddy.bind(game.buddy);
game.buddy.setBuddy = function(index) {
    _origSetBuddy(index);
    achievements.check();
};

const _origResetGame = saveSystem.resetGame ? saveSystem.resetGame.bind(saveSystem) : null;
if (_origResetGame) {
    saveSystem.resetGame = function() {
        achievements.reset();
        _origResetGame();
    };
}

// Auto-save to localStorage every 60s
setInterval(() => {
    if (player.hasStarter) {
        try {
            localStorage.setItem('pokequest_autosave', JSON.stringify({
                version: '1.0',
                timestamp: new Date().toISOString(),
                player: player,
                buddy: { currentBuddy: game.buddy.currentBuddy, happiness: game.buddy.currentBuddy ? game.buddy.currentBuddy.happiness : 0 }
            }));
        } catch(e) {}
    }
}, 60000);