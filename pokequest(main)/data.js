// Type effectiveness chart
const typeEffectiveness = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, dark: 0.5, ghost: 2 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// Move database
const moveDatabase = {
    ember: { name: "Ember", type: "fire", power: 40, accuracy: 100, pp: 25, tm: false },
    flamethrower: { name: "Flamethrower", type: "fire", power: 90, accuracy: 100, pp: 15, tm: true, tmPrice: 1500 },
    fireBlast: { name: "Fire Blast", type: "fire", power: 110, accuracy: 85, pp: 5, tm: true, tmPrice: 2000 },
    waterGun: { name: "Water Gun", type: "water", power: 40, accuracy: 100, pp: 25, tm: false },
    surf: { name: "Surf", type: "water", power: 90, accuracy: 100, pp: 15, tm: true, tmPrice: 1500 },
    hydroPump: { name: "Hydro Pump", type: "water", power: 110, accuracy: 80, pp: 5, tm: true, tmPrice: 2000 },
    vineWhip: { name: "Vine Whip", type: "grass", power: 45, accuracy: 100, pp: 25, tm: false },
    razorLeaf: { name: "Razor Leaf", type: "grass", power: 55, accuracy: 95, pp: 25, tm: false },
    solarBeam: { name: "Solar Beam", type: "grass", power: 120, accuracy: 100, pp: 10, tm: true, tmPrice: 2000 },
    thunderShock: { name: "Thunder Shock", type: "electric", power: 40, accuracy: 100, pp: 30, tm: false },
    thunderbolt: { name: "Thunderbolt", type: "electric", power: 90, accuracy: 100, pp: 15, tm: true, tmPrice: 1500 },
    thunder: { name: "Thunder", type: "electric", power: 110, accuracy: 70, pp: 10, tm: true, tmPrice: 2000 },
    confusion: { name: "Confusion", type: "psychic", power: 50, accuracy: 100, pp: 25, tm: false },
    psychic: { name: "Psychic", type: "psychic", power: 90, accuracy: 100, pp: 10, tm: true, tmPrice: 2000 },
    iceBeam: { name: "Ice Beam", type: "ice", power: 90, accuracy: 100, pp: 10, tm: true, tmPrice: 2000 },
    blizzard: { name: "Blizzard", type: "ice", power: 110, accuracy: 70, pp: 5, tm: true, tmPrice: 2500 },
    dragonRage: { name: "Dragon Rage", type: "dragon", power: 40, accuracy: 100, pp: 10, tm: false },
    dragonClaw: { name: "Dragon Claw", type: "dragon", power: 80, accuracy: 100, pp: 15, tm: true, tmPrice: 2000 },
    bite: { name: "Bite", type: "dark", power: 60, accuracy: 100, pp: 25, tm: false },
    crunch: { name: "Crunch", type: "dark", power: 80, accuracy: 100, pp: 15, tm: true, tmPrice: 1500 },
    karateChop: { name: "Karate Chop", type: "fighting", power: 50, accuracy: 100, pp: 25, tm: false },
    brickBreak: { name: "Brick Break", type: "fighting", power: 75, accuracy: 100, pp: 15, tm: true, tmPrice: 1500 },
    tackle: { name: "Tackle", type: "normal", power: 40, accuracy: 100, pp: 35, tm: false },
    scratch: { name: "Scratch", type: "normal", power: 40, accuracy: 100, pp: 35, tm: false },
    quickAttack: { name: "Quick Attack", type: "normal", power: 40, accuracy: 100, pp: 30, tm: false },
    slam: { name: "Slam", type: "normal", power: 80, accuracy: 75, pp: 20, tm: false },
    dig: { name: "Dig", type: "ground", power: 80, accuracy: 100, pp: 10, tm: true, tmPrice: 1000 },
    earthquake: { name: "Earthquake", type: "ground", power: 100, accuracy: 100, pp: 10, tm: true, tmPrice: 2500 },
    rockThrow: { name: "Rock Throw", type: "rock", power: 50, accuracy: 90, pp: 15, tm: false },
    rockSlide: { name: "Rock Slide", type: "rock", power: 75, accuracy: 90, pp: 10, tm: true, tmPrice: 1500 },
    furyCutter: { name: "Fury Cutter", type: "bug", power: 40, accuracy: 95, pp: 20, tm: false },
    xScissor: { name: "X-Scissor", type: "bug", power: 80, accuracy: 100, pp: 15, tm: true, tmPrice: 1500 },
    lick: { name: "Lick", type: "ghost", power: 30, accuracy: 100, pp: 30, tm: false },
    shadowBall: { name: "Shadow Ball", type: "ghost", power: 80, accuracy: 100, pp: 15, tm: true, tmPrice: 2000 },
    metalClaw: { name: "Metal Claw", type: "steel", power: 50, accuracy: 95, pp: 35, tm: false },
    ironTail: { name: "Iron Tail", type: "steel", power: 100, accuracy: 75, pp: 15, tm: true, tmPrice: 2000 },
    fairyWind: { name: "Fairy Wind", type: "fairy", power: 40, accuracy: 100, pp: 30, tm: false },
    moonblast: { name: "Moonblast", type: "fairy", power: 95, accuracy: 100, pp: 15, tm: true, tmPrice: 2000 },
    poisonSting: { name: "Poison Sting", type: "poison", power: 15, accuracy: 100, pp: 35, tm: false },
    sludgeBomb: { name: "Sludge Bomb", type: "poison", power: 90, accuracy: 100, pp: 10, tm: true, tmPrice: 2000 },
    gust: { name: "Gust", type: "flying", power: 40, accuracy: 100, pp: 35, tm: false },
    wingAttack: { name: "Wing Attack", type: "flying", power: 60, accuracy: 100, pp: 35, tm: false },
    hyperBeam: { name: "Hyper Beam", type: "normal", power: 150, accuracy: 90, pp: 5, tm: true, tmPrice: 3000 },
    gigaDrain: { name: "Giga Drain", type: "grass", power: 75, accuracy: 100, pp: 10, tm: true, tmPrice: 2000 },
    firePunch: { name: "Fire Punch", type: "fire", power: 75, accuracy: 100, pp: 15, tm: true, tmPrice: 1500 },
    icePunch: { name: "Ice Punch", type: "ice", power: 75, accuracy: 100, pp: 15, tm: true, tmPrice: 1500 },
    thunderPunch: { name: "Thunder Punch", type: "electric", power: 75, accuracy: 100, pp: 15, tm: true, tmPrice: 1500 }
};

// Complete Kanto Pokémon Database (1-151)
const pokemonDatabase = [
    // Bulbasaur line
    { id: 1, name: "Bulbasaur", types: ["grass", "poison"], hp: 45, attack: 49, defense: 49, spAttack: 65, spDefense: 65, speed: 45, baseHP: 45, baseAttack: 49, baseDefense: 49, baseSpAttack: 65, baseSpDefense: 65, baseSpeed: 45, rarity: "rare", catchRate: 45, evolution: { level: 16, evolvesTo: "Ivysaur" }, region: "kanto" },
    { id: 2, name: "Ivysaur", types: ["grass", "poison"], hp: 60, attack: 62, defense: 63, spAttack: 80, spDefense: 80, speed: 60, baseHP: 60, baseAttack: 62, baseDefense: 63, baseSpAttack: 80, baseSpDefense: 80, baseSpeed: 60, rarity: "rare", catchRate: 35, evolution: { level: 36, evolvesTo: "Venusaur" }, region: "kanto" },
    { id: 3, name: "Venusaur", types: ["grass", "poison"], hp: 80, attack: 82, defense: 83, spAttack: 100, spDefense: 100, speed: 80, baseHP: 80, baseAttack: 82, baseDefense: 83, baseSpAttack: 100, baseSpDefense: 100, baseSpeed: 80, rarity: "rare", catchRate: 25, evolution: null, region: "kanto" },
    
    // Charmander line
    { id: 4, name: "Charmander", types: ["fire"], hp: 39, attack: 52, defense: 43, spAttack: 60, spDefense: 50, speed: 65, baseHP: 39, baseAttack: 52, baseDefense: 43, baseSpAttack: 60, baseSpDefense: 50, baseSpeed: 65, rarity: "rare", catchRate: 45, evolution: { level: 16, evolvesTo: "Charmeleon" }, region: "kanto" },
    { id: 5, name: "Charmeleon", types: ["fire"], hp: 58, attack: 64, defense: 58, spAttack: 80, spDefense: 65, speed: 80, baseHP: 58, baseAttack: 64, baseDefense: 58, baseSpAttack: 80, baseSpDefense: 65, baseSpeed: 80, rarity: "rare", catchRate: 35, evolution: { level: 36, evolvesTo: "Charizard" }, region: "kanto" },
    { id: 6, name: "Charizard", types: ["fire", "flying"], hp: 78, attack: 84, defense: 78, spAttack: 109, spDefense: 85, speed: 100, baseHP: 78, baseAttack: 84, baseDefense: 78, baseSpAttack: 109, baseSpDefense: 85, baseSpeed: 100, rarity: "rare", catchRate: 25, evolution: null, region: "kanto" },
    
    // Squirtle line
    { id: 7, name: "Squirtle", types: ["water"], hp: 44, attack: 48, defense: 65, spAttack: 50, spDefense: 64, speed: 43, baseHP: 44, baseAttack: 48, baseDefense: 65, baseSpAttack: 50, baseSpDefense: 64, baseSpeed: 43, rarity: "rare", catchRate: 45, evolution: { level: 16, evolvesTo: "Wartortle" }, region: "kanto" },
    { id: 8, name: "Wartortle", types: ["water"], hp: 59, attack: 63, defense: 80, spAttack: 65, spDefense: 80, speed: 58, baseHP: 59, baseAttack: 63, baseDefense: 80, baseSpAttack: 65, baseSpDefense: 80, baseSpeed: 58, rarity: "rare", catchRate: 35, evolution: { level: 36, evolvesTo: "Blastoise" }, region: "kanto" },
    { id: 9, name: "Blastoise", types: ["water"], hp: 79, attack: 83, defense: 100, spAttack: 85, spDefense: 105, speed: 78, baseHP: 79, baseAttack: 83, baseDefense: 100, baseSpAttack: 85, baseSpDefense: 105, baseSpeed: 78, rarity: "rare", catchRate: 25, evolution: null, region: "kanto" },

    // Caterpie line
    { id: 10, name: "Caterpie", types: ["bug"], hp: 45, attack: 30, defense: 35, spAttack: 20, spDefense: 20, speed: 45, baseHP: 45, baseAttack: 30, baseDefense: 35, baseSpAttack: 20, baseSpDefense: 20, baseSpeed: 45, rarity: "common", catchRate: 75, evolution: { level: 7, evolvesTo: "Metapod" }, region: "kanto" },
    { id: 11, name: "Metapod", types: ["bug"], hp: 50, attack: 20, defense: 55, spAttack: 25, spDefense: 25, speed: 30, baseHP: 50, baseAttack: 20, baseDefense: 55, baseSpAttack: 25, baseSpDefense: 25, baseSpeed: 30, rarity: "common", catchRate: 65, evolution: { level: 10, evolvesTo: "Butterfree" }, region: "kanto" },
    { id: 12, name: "Butterfree", types: ["bug", "flying"], hp: 60, attack: 45, defense: 50, spAttack: 90, spDefense: 80, speed: 70, baseHP: 60, baseAttack: 45, baseDefense: 50, baseSpAttack: 90, baseSpDefense: 80, baseSpeed: 70, rarity: "common", catchRate: 55, evolution: null, region: "kanto" },
    
    // Weedle line
    { id: 13, name: "Weedle", types: ["bug", "poison"], hp: 40, attack: 35, defense: 30, spAttack: 20, spDefense: 20, speed: 50, baseHP: 40, baseAttack: 35, baseDefense: 30, baseSpAttack: 20, baseSpDefense: 20, baseSpeed: 50, rarity: "common", catchRate: 75, evolution: { level: 7, evolvesTo: "Kakuna" }, region: "kanto" },
    { id: 14, name: "Kakuna", types: ["bug", "poison"], hp: 45, attack: 25, defense: 50, spAttack: 25, spDefense: 25, speed: 35, baseHP: 45, baseAttack: 25, baseDefense: 50, baseSpAttack: 25, baseSpDefense: 25, baseSpeed: 35, rarity: "common", catchRate: 65, evolution: { level: 10, evolvesTo: "Beedrill" }, region: "kanto" },
    { id: 15, name: "Beedrill", types: ["bug", "poison"], hp: 65, attack: 90, defense: 40, spAttack: 45, spDefense: 80, speed: 75, baseHP: 65, baseAttack: 90, baseDefense: 40, baseSpAttack: 45, baseSpDefense: 80, baseSpeed: 75, rarity: "common", catchRate: 55, evolution: null, region: "kanto" },

    // Pidgey line
    { id: 16, name: "Pidgey", types: ["normal", "flying"], hp: 40, attack: 45, defense: 40, spAttack: 35, spDefense: 35, speed: 56, baseHP: 40, baseAttack: 45, baseDefense: 40, baseSpAttack: 35, baseSpDefense: 35, baseSpeed: 56, rarity: "common", catchRate: 75, evolution: { level: 18, evolvesTo: "Pidgeotto" }, region: "kanto" },
    { id: 17, name: "Pidgeotto", types: ["normal", "flying"], hp: 63, attack: 60, defense: 55, spAttack: 50, spDefense: 50, speed: 71, baseHP: 63, baseAttack: 60, baseDefense: 55, baseSpAttack: 50, baseSpDefense: 50, baseSpeed: 71, rarity: "common", catchRate: 65, evolution: { level: 36, evolvesTo: "Pidgeot" }, region: "kanto" },
    { id: 18, name: "Pidgeot", types: ["normal", "flying"], hp: 83, attack: 80, defense: 75, spAttack: 70, spDefense: 70, speed: 101, baseHP: 83, baseAttack: 80, baseDefense: 75, baseSpAttack: 70, baseSpDefense: 70, baseSpeed: 101, rarity: "common", catchRate: 55, evolution: null, region: "kanto" },

    // Rattata line
    { id: 19, name: "Rattata", types: ["normal"], hp: 30, attack: 56, defense: 35, spAttack: 25, spDefense: 35, speed: 72, baseHP: 30, baseAttack: 56, baseDefense: 35, baseSpAttack: 25, baseSpDefense: 35, baseSpeed: 72, rarity: "common", catchRate: 75, evolution: { level: 20, evolvesTo: "Raticate" }, region: "kanto" },
    { id: 20, name: "Raticate", types: ["normal"], hp: 55, attack: 81, defense: 60, spAttack: 50, spDefense: 70, speed: 97, baseHP: 55, baseAttack: 81, baseDefense: 60, baseSpAttack: 50, baseSpDefense: 70, baseSpeed: 97, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Spearow line
    { id: 21, name: "Spearow", types: ["normal", "flying"], hp: 40, attack: 60, defense: 30, spAttack: 31, spDefense: 31, speed: 70, baseHP: 40, baseAttack: 60, baseDefense: 30, baseSpAttack: 31, baseSpDefense: 31, baseSpeed: 70, rarity: "common", catchRate: 75, evolution: { level: 20, evolvesTo: "Fearow" }, region: "kanto" },
    { id: 22, name: "Fearow", types: ["normal", "flying"], hp: 65, attack: 90, defense: 65, spAttack: 61, spDefense: 61, speed: 100, baseHP: 65, baseAttack: 90, baseDefense: 65, baseSpAttack: 61, baseSpDefense: 61, baseSpeed: 100, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Ekans line
    { id: 23, name: "Ekans", types: ["poison"], hp: 35, attack: 60, defense: 44, spAttack: 40, spDefense: 54, speed: 55, baseHP: 35, baseAttack: 60, baseDefense: 44, baseSpAttack: 40, baseSpDefense: 54, baseSpeed: 55, rarity: "common", catchRate: 75, evolution: { level: 22, evolvesTo: "Arbok" }, region: "kanto" },
    { id: 24, name: "Arbok", types: ["poison"], hp: 60, attack: 95, defense: 69, spAttack: 65, spDefense: 79, speed: 80, baseHP: 60, baseAttack: 95, baseDefense: 69, baseSpAttack: 65, baseSpDefense: 79, baseSpeed: 80, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Pikachu line
    { id: 25, name: "Pikachu", types: ["electric"], hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90, baseHP: 35, baseAttack: 55, baseDefense: 40, baseSpAttack: 50, baseSpDefense: 50, baseSpeed: 90, rarity: "uncommon", catchRate: 45, evolution: { level: 30, evolvesTo: "Raichu" }, region: "kanto" },
    { id: 26, name: "Raichu", types: ["electric"], hp: 60, attack: 90, defense: 55, spAttack: 90, spDefense: 80, speed: 110, baseHP: 60, baseAttack: 90, baseDefense: 55, baseSpAttack: 90, baseSpDefense: 80, baseSpeed: 110, rarity: "uncommon", catchRate: 35, evolution: null, region: "kanto" },

    // Sandshrew line
    { id: 27, name: "Sandshrew", types: ["ground"], hp: 50, attack: 75, defense: 85, spAttack: 20, spDefense: 30, speed: 40, baseHP: 50, baseAttack: 75, baseDefense: 85, baseSpAttack: 20, baseSpDefense: 30, baseSpeed: 40, rarity: "common", catchRate: 75, evolution: { level: 22, evolvesTo: "Sandslash" }, region: "kanto" },
    { id: 28, name: "Sandslash", types: ["ground"], hp: 75, attack: 100, defense: 110, spAttack: 45, spDefense: 55, speed: 65, baseHP: 75, baseAttack: 100, baseDefense: 110, baseSpAttack: 45, baseSpDefense: 55, baseSpeed: 65, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Nidoran♀ line
    { id: 29, name: "Nidoran♀", types: ["poison"], hp: 55, attack: 47, defense: 52, spAttack: 40, spDefense: 40, speed: 41, baseHP: 55, baseAttack: 47, baseDefense: 52, baseSpAttack: 40, baseSpDefense: 40, baseSpeed: 41, rarity: "common", catchRate: 75, evolution: { level: 16, evolvesTo: "Nidorina" }, region: "kanto" },
    { id: 30, name: "Nidorina", types: ["poison"], hp: 70, attack: 62, defense: 67, spAttack: 55, spDefense: 55, speed: 56, baseHP: 70, baseAttack: 62, baseDefense: 67, baseSpAttack: 55, baseSpDefense: 55, baseSpeed: 56, rarity: "common", catchRate: 65, evolution: { level: 36, evolvesTo: "Nidoqueen" }, region: "kanto" },
    { id: 31, name: "Nidoqueen", types: ["poison", "ground"], hp: 90, attack: 92, defense: 87, spAttack: 75, spDefense: 85, speed: 76, baseHP: 90, baseAttack: 92, baseDefense: 87, baseSpAttack: 75, baseSpDefense: 85, baseSpeed: 76, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Nidoran♂ line
    { id: 32, name: "Nidoran♂", types: ["poison"], hp: 46, attack: 57, defense: 40, spAttack: 40, spDefense: 40, speed: 50, baseHP: 46, baseAttack: 57, baseDefense: 40, baseSpAttack: 40, baseSpDefense: 40, baseSpeed: 50, rarity: "common", catchRate: 75, evolution: { level: 16, evolvesTo: "Nidorino" }, region: "kanto" },
    { id: 33, name: "Nidorino", types: ["poison"], hp: 61, attack: 72, defense: 57, spAttack: 55, spDefense: 55, speed: 65, baseHP: 61, baseAttack: 72, baseDefense: 57, baseSpAttack: 55, baseSpDefense: 55, baseSpeed: 65, rarity: "common", catchRate: 65, evolution: { level: 36, evolvesTo: "Nidoking" }, region: "kanto" },
    { id: 34, name: "Nidoking", types: ["poison", "ground"], hp: 81, attack: 102, defense: 77, spAttack: 85, spDefense: 75, speed: 85, baseHP: 81, baseAttack: 102, baseDefense: 77, baseSpAttack: 85, baseSpDefense: 75, baseSpeed: 85, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Clefairy line
    { id: 35, name: "Clefairy", types: ["fairy"], hp: 70, attack: 45, defense: 48, spAttack: 60, spDefense: 65, speed: 35, baseHP: 70, baseAttack: 45, baseDefense: 48, baseSpAttack: 60, baseSpDefense: 65, baseSpeed: 35, rarity: "uncommon", catchRate: 45, evolution: { level: 30, evolvesTo: "Clefable" }, region: "kanto" },
    { id: 36, name: "Clefable", types: ["fairy"], hp: 95, attack: 70, defense: 73, spAttack: 95, spDefense: 90, speed: 60, baseHP: 95, baseAttack: 70, baseDefense: 73, baseSpAttack: 95, baseSpDefense: 90, baseSpeed: 60, rarity: "uncommon", catchRate: 35, evolution: null, region: "kanto" },

    // Vulpix line
    { id: 37, name: "Vulpix", types: ["fire"], hp: 38, attack: 41, defense: 40, spAttack: 50, spDefense: 65, speed: 65, baseHP: 38, baseAttack: 41, baseDefense: 40, baseSpAttack: 50, baseSpDefense: 65, baseSpeed: 65, rarity: "uncommon", catchRate: 45, evolution: { level: 30, evolvesTo: "Ninetales" }, region: "kanto" },
    { id: 38, name: "Ninetales", types: ["fire"], hp: 73, attack: 76, defense: 75, spAttack: 81, spDefense: 100, speed: 100, baseHP: 73, baseAttack: 76, baseDefense: 75, baseSpAttack: 81, baseSpDefense: 100, baseSpeed: 100, rarity: "uncommon", catchRate: 35, evolution: null, region: "kanto" },

    // Jigglypuff line
    { id: 39, name: "Jigglypuff", types: ["normal", "fairy"], hp: 115, attack: 45, defense: 20, spAttack: 45, spDefense: 25, speed: 20, baseHP: 115, baseAttack: 45, baseDefense: 20, baseSpAttack: 45, baseSpDefense: 25, baseSpeed: 20, rarity: "uncommon", catchRate: 45, evolution: { level: 30, evolvesTo: "Wigglytuff" }, region: "kanto" },
    { id: 40, name: "Wigglytuff", types: ["normal", "fairy"], hp: 140, attack: 70, defense: 45, spAttack: 85, spDefense: 50, speed: 45, baseHP: 140, baseAttack: 70, baseDefense: 45, baseSpAttack: 85, baseSpDefense: 50, baseSpeed: 45, rarity: "uncommon", catchRate: 35, evolution: null, region: "kanto" },

    // Zubat line
    { id: 41, name: "Zubat", types: ["poison", "flying"], hp: 40, attack: 45, defense: 35, spAttack: 30, spDefense: 40, speed: 55, baseHP: 40, baseAttack: 45, baseDefense: 35, baseSpAttack: 30, baseSpDefense: 40, baseSpeed: 55, rarity: "common", catchRate: 75, evolution: { level: 22, evolvesTo: "Golbat" }, region: "kanto" },
    { id: 42, name: "Golbat", types: ["poison", "flying"], hp: 75, attack: 80, defense: 70, spAttack: 65, spDefense: 75, speed: 90, baseHP: 75, baseAttack: 80, baseDefense: 70, baseSpAttack: 65, baseSpDefense: 75, baseSpeed: 90, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Oddish line
    { id: 43, name: "Oddish", types: ["grass", "poison"], hp: 45, attack: 50, defense: 55, spAttack: 75, spDefense: 65, speed: 30, baseHP: 45, baseAttack: 50, baseDefense: 55, baseSpAttack: 75, baseSpDefense: 65, baseSpeed: 30, rarity: "common", catchRate: 75, evolution: { level: 21, evolvesTo: "Gloom" }, region: "kanto" },
    { id: 44, name: "Gloom", types: ["grass", "poison"], hp: 60, attack: 65, defense: 70, spAttack: 85, spDefense: 75, speed: 40, baseHP: 60, baseAttack: 65, baseDefense: 70, baseSpAttack: 85, baseSpDefense: 75, baseSpeed: 40, rarity: "common", catchRate: 65, evolution: { level: 36, evolvesTo: "Vileplume" }, region: "kanto" },
    { id: 45, name: "Vileplume", types: ["grass", "poison"], hp: 75, attack: 80, defense: 85, spAttack: 110, spDefense: 90, speed: 50, baseHP: 75, baseAttack: 80, baseDefense: 85, baseSpAttack: 110, baseSpDefense: 90, baseSpeed: 50, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Paras line
    { id: 46, name: "Paras", types: ["bug", "grass"], hp: 35, attack: 70, defense: 55, spAttack: 45, spDefense: 55, speed: 25, baseHP: 35, baseAttack: 70, baseDefense: 55, baseSpAttack: 45, baseSpDefense: 55, baseSpeed: 25, rarity: "common", catchRate: 75, evolution: { level: 24, evolvesTo: "Parasect" }, region: "kanto" },
    { id: 47, name: "Parasect", types: ["bug", "grass"], hp: 60, attack: 95, defense: 80, spAttack: 60, spDefense: 80, speed: 30, baseHP: 60, baseAttack: 95, baseDefense: 80, baseSpAttack: 60, baseSpDefense: 80, baseSpeed: 30, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Venonat line
    { id: 48, name: "Venonat", types: ["bug", "poison"], hp: 60, attack: 55, defense: 50, spAttack: 40, spDefense: 55, speed: 45, baseHP: 60, baseAttack: 55, baseDefense: 50, baseSpAttack: 40, baseSpDefense: 55, baseSpeed: 45, rarity: "common", catchRate: 75, evolution: { level: 31, evolvesTo: "Venomoth" }, region: "kanto" },
    { id: 49, name: "Venomoth", types: ["bug", "poison"], hp: 70, attack: 65, defense: 60, spAttack: 90, spDefense: 75, speed: 90, baseHP: 70, baseAttack: 65, baseDefense: 60, baseSpAttack: 90, baseSpDefense: 75, baseSpeed: 90, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Diglett line
    { id: 50, name: "Diglett", types: ["ground"], hp: 10, attack: 55, defense: 25, spAttack: 35, spDefense: 45, speed: 95, baseHP: 10, baseAttack: 55, baseDefense: 25, baseSpAttack: 35, baseSpDefense: 45, baseSpeed: 95, rarity: "common", catchRate: 75, evolution: { level: 26, evolvesTo: "Dugtrio" }, region: "kanto" },
    { id: 51, name: "Dugtrio", types: ["ground"], hp: 35, attack: 100, defense: 50, spAttack: 50, spDefense: 70, speed: 120, baseHP: 35, baseAttack: 100, baseDefense: 50, baseSpAttack: 50, baseSpDefense: 70, baseSpeed: 120, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Meowth line
    { id: 52, name: "Meowth", types: ["normal"], hp: 40, attack: 45, defense: 35, spAttack: 40, spDefense: 40, speed: 90, baseHP: 40, baseAttack: 45, baseDefense: 35, baseSpAttack: 40, baseSpDefense: 40, baseSpeed: 90, rarity: "common", catchRate: 75, evolution: { level: 28, evolvesTo: "Persian" }, region: "kanto" },
    { id: 53, name: "Persian", types: ["normal"], hp: 65, attack: 70, defense: 60, spAttack: 65, spDefense: 65, speed: 115, baseHP: 65, baseAttack: 70, baseDefense: 60, baseSpAttack: 65, baseSpDefense: 65, baseSpeed: 115, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Psyduck line
    { id: 54, name: "Psyduck", types: ["water"], hp: 50, attack: 52, defense: 48, spAttack: 65, spDefense: 50, speed: 55, baseHP: 50, baseAttack: 52, baseDefense: 48, baseSpAttack: 65, baseSpDefense: 50, baseSpeed: 55, rarity: "common", catchRate: 75, evolution: { level: 33, evolvesTo: "Golduck" }, region: "kanto" },
    { id: 55, name: "Golduck", types: ["water"], hp: 80, attack: 82, defense: 78, spAttack: 95, spDefense: 80, speed: 85, baseHP: 80, baseAttack: 82, baseDefense: 78, baseSpAttack: 95, baseSpDefense: 80, baseSpeed: 85, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Mankey line
    { id: 56, name: "Mankey", types: ["fighting"], hp: 40, attack: 80, defense: 35, spAttack: 35, spDefense: 45, speed: 70, baseHP: 40, baseAttack: 80, baseDefense: 35, baseSpAttack: 35, baseSpDefense: 45, baseSpeed: 70, rarity: "common", catchRate: 75, evolution: { level: 28, evolvesTo: "Primeape" }, region: "kanto" },
    { id: 57, name: "Primeape", types: ["fighting"], hp: 65, attack: 105, defense: 60, spAttack: 60, spDefense: 70, speed: 95, baseHP: 65, baseAttack: 105, baseDefense: 60, baseSpAttack: 60, baseSpDefense: 70, baseSpeed: 95, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Growlithe line
    { id: 58, name: "Growlithe", types: ["fire"], hp: 55, attack: 70, defense: 45, spAttack: 70, spDefense: 50, speed: 60, baseHP: 55, baseAttack: 70, baseDefense: 45, baseSpAttack: 70, baseSpDefense: 50, baseSpeed: 60, rarity: "uncommon", catchRate: 45, evolution: { level: 30, evolvesTo: "Arcanine" }, region: "kanto" },
    { id: 59, name: "Arcanine", types: ["fire"], hp: 90, attack: 110, defense: 80, spAttack: 100, spDefense: 80, speed: 95, baseHP: 90, baseAttack: 110, baseDefense: 80, baseSpAttack: 100, baseSpDefense: 80, baseSpeed: 95, rarity: "rare", catchRate: 25, evolution: null, region: "kanto" },

    // Poliwag line
    { id: 60, name: "Poliwag", types: ["water"], hp: 40, attack: 50, defense: 40, spAttack: 40, spDefense: 40, speed: 90, baseHP: 40, baseAttack: 50, baseDefense: 40, baseSpAttack: 40, baseSpDefense: 40, baseSpeed: 90, rarity: "common", catchRate: 75, evolution: { level: 25, evolvesTo: "Poliwhirl" }, region: "kanto" },
    { id: 61, name: "Poliwhirl", types: ["water"], hp: 65, attack: 65, defense: 65, spAttack: 50, spDefense: 50, speed: 90, baseHP: 65, baseAttack: 65, baseDefense: 65, baseSpAttack: 50, baseSpDefense: 50, baseSpeed: 90, rarity: "common", catchRate: 65, evolution: { level: 40, evolvesTo: "Poliwrath" }, region: "kanto" },
    { id: 62, name: "Poliwrath", types: ["water", "fighting"], hp: 90, attack: 95, defense: 95, spAttack: 70, spDefense: 90, speed: 70, baseHP: 90, baseAttack: 95, baseDefense: 95, baseSpAttack: 70, baseSpDefense: 90, baseSpeed: 70, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Abra line
    { id: 63, name: "Abra", types: ["psychic"], hp: 25, attack: 20, defense: 15, spAttack: 105, spDefense: 55, speed: 90, baseHP: 25, baseAttack: 20, baseDefense: 15, baseSpAttack: 105, baseSpDefense: 55, baseSpeed: 90, rarity: "uncommon", catchRate: 45, evolution: { level: 16, evolvesTo: "Kadabra" }, region: "kanto" },
    { id: 64, name: "Kadabra", types: ["psychic"], hp: 40, attack: 35, defense: 30, spAttack: 120, spDefense: 70, speed: 105, baseHP: 40, baseAttack: 35, baseDefense: 30, baseSpAttack: 120, baseSpDefense: 70, baseSpeed: 105, rarity: "uncommon", catchRate: 35, evolution: { level: 36, evolvesTo: "Alakazam" }, region: "kanto" },
    { id: 65, name: "Alakazam", types: ["psychic"], hp: 55, attack: 50, defense: 45, spAttack: 135, spDefense: 95, speed: 120, baseHP: 55, baseAttack: 50, baseDefense: 45, baseSpAttack: 135, baseSpDefense: 95, baseSpeed: 120, rarity: "rare", catchRate: 25, evolution: null, region: "kanto" },

    // Machop line
    { id: 66, name: "Machop", types: ["fighting"], hp: 70, attack: 80, defense: 50, spAttack: 35, spDefense: 35, speed: 35, baseHP: 70, baseAttack: 80, baseDefense: 50, baseSpAttack: 35, baseSpDefense: 35, baseSpeed: 35, rarity: "common", catchRate: 75, evolution: { level: 28, evolvesTo: "Machoke" }, region: "kanto" },
    { id: 67, name: "Machoke", types: ["fighting"], hp: 80, attack: 100, defense: 70, spAttack: 50, spDefense: 60, speed: 45, baseHP: 80, baseAttack: 100, baseDefense: 70, baseSpAttack: 50, baseSpDefense: 60, baseSpeed: 45, rarity: "common", catchRate: 65, evolution: { level: 40, evolvesTo: "Machamp" }, region: "kanto" },
    { id: 68, name: "Machamp", types: ["fighting"], hp: 90, attack: 130, defense: 80, spAttack: 65, spDefense: 85, speed: 55, baseHP: 90, baseAttack: 130, baseDefense: 80, baseSpAttack: 65, baseSpDefense: 85, baseSpeed: 55, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Bellsprout line
    { id: 69, name: "Bellsprout", types: ["grass", "poison"], hp: 50, attack: 75, defense: 35, spAttack: 70, spDefense: 30, speed: 40, baseHP: 50, baseAttack: 75, baseDefense: 35, baseSpAttack: 70, baseSpDefense: 30, baseSpeed: 40, rarity: "common", catchRate: 75, evolution: { level: 21, evolvesTo: "Weepinbell" }, region: "kanto" },
    { id: 70, name: "Weepinbell", types: ["grass", "poison"], hp: 65, attack: 90, defense: 50, spAttack: 85, spDefense: 45, speed: 55, baseHP: 65, baseAttack: 90, baseDefense: 50, baseSpAttack: 85, baseSpDefense: 45, baseSpeed: 55, rarity: "common", catchRate: 65, evolution: { level: 36, evolvesTo: "Victreebel" }, region: "kanto" },
    { id: 71, name: "Victreebel", types: ["grass", "poison"], hp: 80, attack: 105, defense: 65, spAttack: 100, spDefense: 70, speed: 70, baseHP: 80, baseAttack: 105, baseDefense: 65, baseSpAttack: 100, baseSpDefense: 70, baseSpeed: 70, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Tentacool line
    { id: 72, name: "Tentacool", types: ["water", "poison"], hp: 40, attack: 40, defense: 35, spAttack: 50, spDefense: 100, speed: 70, baseHP: 40, baseAttack: 40, baseDefense: 35, baseSpAttack: 50, baseSpDefense: 100, baseSpeed: 70, rarity: "common", catchRate: 75, evolution: { level: 30, evolvesTo: "Tentacruel" }, region: "kanto" },
    { id: 73, name: "Tentacruel", types: ["water", "poison"], hp: 80, attack: 70, defense: 65, spAttack: 80, spDefense: 120, speed: 100, baseHP: 80, baseAttack: 70, baseDefense: 65, baseSpAttack: 80, baseSpDefense: 120, baseSpeed: 100, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Geodude line
    { id: 74, name: "Geodude", types: ["rock", "ground"], hp: 40, attack: 80, defense: 100, spAttack: 30, spDefense: 30, speed: 20, baseHP: 40, baseAttack: 80, baseDefense: 100, baseSpAttack: 30, baseSpDefense: 30, baseSpeed: 20, rarity: "common", catchRate: 75, evolution: { level: 25, evolvesTo: "Graveler" }, region: "kanto" },
    { id: 75, name: "Graveler", types: ["rock", "ground"], hp: 55, attack: 95, defense: 115, spAttack: 45, spDefense: 45, speed: 35, baseHP: 55, baseAttack: 95, baseDefense: 115, baseSpAttack: 45, baseSpDefense: 45, baseSpeed: 35, rarity: "common", catchRate: 65, evolution: { level: 40, evolvesTo: "Golem" }, region: "kanto" },
    { id: 76, name: "Golem", types: ["rock", "ground"], hp: 80, attack: 120, defense: 130, spAttack: 55, spDefense: 65, speed: 45, baseHP: 80, baseAttack: 120, baseDefense: 130, baseSpAttack: 55, baseSpDefense: 65, baseSpeed: 45, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Ponyta line
    { id: 77, name: "Ponyta", types: ["fire"], hp: 50, attack: 85, defense: 55, spAttack: 65, spDefense: 65, speed: 90, baseHP: 50, baseAttack: 85, baseDefense: 55, baseSpAttack: 65, baseSpDefense: 65, baseSpeed: 90, rarity: "common", catchRate: 75, evolution: { level: 40, evolvesTo: "Rapidash" }, region: "kanto" },
    { id: 78, name: "Rapidash", types: ["fire"], hp: 65, attack: 100, defense: 70, spAttack: 80, spDefense: 80, speed: 105, baseHP: 65, baseAttack: 100, baseDefense: 70, baseSpAttack: 80, baseSpDefense: 80, baseSpeed: 105, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Slowpoke line
    { id: 79, name: "Slowpoke", types: ["water", "psychic"], hp: 90, attack: 65, defense: 65, spAttack: 40, spDefense: 40, speed: 15, baseHP: 90, baseAttack: 65, baseDefense: 65, baseSpAttack: 40, baseSpDefense: 40, baseSpeed: 15, rarity: "common", catchRate: 75, evolution: { level: 37, evolvesTo: "Slowbro" }, region: "kanto" },
    { id: 80, name: "Slowbro", types: ["water", "psychic"], hp: 95, attack: 75, defense: 110, spAttack: 100, spDefense: 80, speed: 30, baseHP: 95, baseAttack: 75, baseDefense: 110, baseSpAttack: 100, baseSpDefense: 80, baseSpeed: 30, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Magnemite line
    { id: 81, name: "Magnemite", types: ["electric", "steel"], hp: 25, attack: 35, defense: 70, spAttack: 95, spDefense: 55, speed: 45, baseHP: 25, baseAttack: 35, baseDefense: 70, baseSpAttack: 95, baseSpDefense: 55, baseSpeed: 45, rarity: "common", catchRate: 75, evolution: { level: 30, evolvesTo: "Magneton" }, region: "kanto" },
    { id: 82, name: "Magneton", types: ["electric", "steel"], hp: 50, attack: 60, defense: 95, spAttack: 120, spDefense: 70, speed: 70, baseHP: 50, baseAttack: 60, baseDefense: 95, baseSpAttack: 120, baseSpDefense: 70, baseSpeed: 70, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Farfetch'd
    { id: 83, name: "Farfetch'd", types: ["normal", "flying"], hp: 52, attack: 90, defense: 55, spAttack: 58, spDefense: 62, speed: 60, baseHP: 52, baseAttack: 90, baseDefense: 55, baseSpAttack: 58, baseSpDefense: 62, baseSpeed: 60, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Doduo line
    { id: 84, name: "Doduo", types: ["normal", "flying"], hp: 35, attack: 85, defense: 45, spAttack: 35, spDefense: 35, speed: 75, baseHP: 35, baseAttack: 85, baseDefense: 45, baseSpAttack: 35, baseSpDefense: 35, baseSpeed: 75, rarity: "common", catchRate: 75, evolution: { level: 31, evolvesTo: "Dodrio" }, region: "kanto" },
        // Dodrio (continued from id: 85)
    { id: 85, name: "Dodrio", types: ["normal", "flying"], hp: 60, attack: 110, defense: 70, spAttack: 60, spDefense: 60, speed: 110, baseHP: 60, baseAttack: 110, baseDefense: 70, baseSpAttack: 60, baseSpDefense: 60, baseSpeed: 110, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Seel line
    { id: 86, name: "Seel", types: ["water"], hp: 65, attack: 45, defense: 55, spAttack: 45, spDefense: 70, speed: 45, baseHP: 65, baseAttack: 45, baseDefense: 55, baseSpAttack: 45, baseSpDefense: 70, baseSpeed: 45, rarity: "common", catchRate: 75, evolution: { level: 34, evolvesTo: "Dewgong" }, region: "kanto" },
    { id: 87, name: "Dewgong", types: ["water", "ice"], hp: 90, attack: 70, defense: 80, spAttack: 70, spDefense: 95, speed: 70, baseHP: 90, baseAttack: 70, baseDefense: 80, baseSpAttack: 70, baseSpDefense: 95, baseSpeed: 70, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Grimer line
    { id: 88, name: "Grimer", types: ["poison"], hp: 80, attack: 80, defense: 50, spAttack: 40, spDefense: 50, speed: 25, baseHP: 80, baseAttack: 80, baseDefense: 50, baseSpAttack: 40, baseSpDefense: 50, baseSpeed: 25, rarity: "common", catchRate: 75, evolution: { level: 38, evolvesTo: "Muk" }, region: "kanto" },
    { id: 89, name: "Muk", types: ["poison"], hp: 105, attack: 105, defense: 75, spAttack: 65, spDefense: 100, speed: 50, baseHP: 105, baseAttack: 105, baseDefense: 75, baseSpAttack: 65, baseSpDefense: 100, baseSpeed: 50, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Shellder line
    { id: 90, name: "Shellder", types: ["water"], hp: 30, attack: 65, defense: 100, spAttack: 45, spDefense: 25, speed: 40, baseHP: 30, baseAttack: 65, baseDefense: 100, baseSpAttack: 45, baseSpDefense: 25, baseSpeed: 40, rarity: "common", catchRate: 75, evolution: { level: 30, evolvesTo: "Cloyster" }, region: "kanto" },
    { id: 91, name: "Cloyster", types: ["water", "ice"], hp: 50, attack: 95, defense: 180, spAttack: 85, spDefense: 45, speed: 70, baseHP: 50, baseAttack: 95, baseDefense: 180, baseSpAttack: 85, baseSpDefense: 45, baseSpeed: 70, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Gastly line
    { id: 92, name: "Gastly", types: ["ghost", "poison"], hp: 30, attack: 35, defense: 30, spAttack: 100, spDefense: 35, speed: 80, baseHP: 30, baseAttack: 35, baseDefense: 30, baseSpAttack: 100, baseSpDefense: 35, baseSpeed: 80, rarity: "uncommon", catchRate: 45, evolution: { level: 25, evolvesTo: "Haunter" }, region: "kanto" },
    { id: 93, name: "Haunter", types: ["ghost", "poison"], hp: 45, attack: 50, defense: 45, spAttack: 115, spDefense: 55, speed: 95, baseHP: 45, baseAttack: 50, baseDefense: 45, baseSpAttack: 115, baseSpDefense: 55, baseSpeed: 95, rarity: "uncommon", catchRate: 35, evolution: { level: 40, evolvesTo: "Gengar" }, region: "kanto" },
    { id: 94, name: "Gengar", types: ["ghost", "poison"], hp: 60, attack: 65, defense: 60, spAttack: 130, spDefense: 75, speed: 110, baseHP: 60, baseAttack: 65, baseDefense: 60, baseSpAttack: 130, baseSpDefense: 75, baseSpeed: 110, rarity: "epic", catchRate: 25, evolution: null, region: "kanto" },

    // Onix
    { id: 95, name: "Onix", types: ["rock", "ground"], hp: 35, attack: 45, defense: 160, spAttack: 30, spDefense: 45, speed: 70, baseHP: 35, baseAttack: 45, baseDefense: 160, baseSpAttack: 30, baseSpDefense: 45, baseSpeed: 70, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Drowzee line
    { id: 96, name: "Drowzee", types: ["psychic"], hp: 60, attack: 48, defense: 45, spAttack: 43, spDefense: 90, speed: 42, baseHP: 60, baseAttack: 48, baseDefense: 45, baseSpAttack: 43, baseSpDefense: 90, baseSpeed: 42, rarity: "common", catchRate: 75, evolution: { level: 26, evolvesTo: "Hypno" }, region: "kanto" },
    { id: 97, name: "Hypno", types: ["psychic"], hp: 85, attack: 73, defense: 70, spAttack: 73, spDefense: 115, speed: 67, baseHP: 85, baseAttack: 73, baseDefense: 70, baseSpAttack: 73, baseSpDefense: 115, baseSpeed: 67, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Krabby line
    { id: 98, name: "Krabby", types: ["water"], hp: 30, attack: 105, defense: 90, spAttack: 25, spDefense: 25, speed: 50, baseHP: 30, baseAttack: 105, baseDefense: 90, baseSpAttack: 25, baseSpDefense: 25, baseSpeed: 50, rarity: "common", catchRate: 75, evolution: { level: 28, evolvesTo: "Kingler" }, region: "kanto" },
    { id: 99, name: "Kingler", types: ["water"], hp: 55, attack: 130, defense: 115, spAttack: 50, spDefense: 50, speed: 75, baseHP: 55, baseAttack: 130, baseDefense: 115, baseSpAttack: 50, baseSpDefense: 50, baseSpeed: 75, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Voltorb line
    { id: 100, name: "Voltorb", types: ["electric"], hp: 40, attack: 30, defense: 50, spAttack: 55, spDefense: 55, speed: 100, baseHP: 40, baseAttack: 30, baseDefense: 50, baseSpAttack: 55, baseSpDefense: 55, baseSpeed: 100, rarity: "common", catchRate: 75, evolution: { level: 30, evolvesTo: "Electrode" }, region: "kanto" },
    { id: 101, name: "Electrode", types: ["electric"], hp: 60, attack: 50, defense: 70, spAttack: 80, spDefense: 80, speed: 150, baseHP: 60, baseAttack: 50, baseDefense: 70, baseSpAttack: 80, baseSpDefense: 80, baseSpeed: 150, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Exeggcute line
    { id: 102, name: "Exeggcute", types: ["grass", "psychic"], hp: 60, attack: 40, defense: 80, spAttack: 60, spDefense: 45, speed: 40, baseHP: 60, baseAttack: 40, baseDefense: 80, baseSpAttack: 60, baseSpDefense: 45, baseSpeed: 40, rarity: "uncommon", catchRate: 45, evolution: { level: 30, evolvesTo: "Exeggutor" }, region: "kanto" },
    { id: 103, name: "Exeggutor", types: ["grass", "psychic"], hp: 95, attack: 95, defense: 85, spAttack: 125, spDefense: 75, speed: 55, baseHP: 95, baseAttack: 95, baseDefense: 85, baseSpAttack: 125, baseSpDefense: 75, baseSpeed: 55, rarity: "uncommon", catchRate: 35, evolution: null, region: "kanto" },

    // Cubone line
    { id: 104, name: "Cubone", types: ["ground"], hp: 50, attack: 50, defense: 95, spAttack: 40, spDefense: 50, speed: 35, baseHP: 50, baseAttack: 50, baseDefense: 95, baseSpAttack: 40, baseSpDefense: 50, baseSpeed: 35, rarity: "common", catchRate: 75, evolution: { level: 28, evolvesTo: "Marowak" }, region: "kanto" },
    { id: 105, name: "Marowak", types: ["ground"], hp: 60, attack: 80, defense: 110, spAttack: 50, spDefense: 80, speed: 45, baseHP: 60, baseAttack: 80, baseDefense: 110, baseSpAttack: 50, baseSpDefense: 80, baseSpeed: 45, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Hitmonlee
    { id: 106, name: "Hitmonlee", types: ["fighting"], hp: 50, attack: 120, defense: 53, spAttack: 35, spDefense: 110, speed: 87, baseHP: 50, baseAttack: 120, baseDefense: 53, baseSpAttack: 35, baseSpDefense: 110, baseSpeed: 87, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Hitmonchan
    { id: 107, name: "Hitmonchan", types: ["fighting"], hp: 50, attack: 105, defense: 79, spAttack: 35, spDefense: 110, speed: 76, baseHP: 50, baseAttack: 105, baseDefense: 79, baseSpAttack: 35, baseSpDefense: 110, baseSpeed: 76, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Lickitung
    { id: 108, name: "Lickitung", types: ["normal"], hp: 90, attack: 55, defense: 75, spAttack: 60, spDefense: 75, speed: 30, baseHP: 90, baseAttack: 55, baseDefense: 75, baseSpAttack: 60, baseSpDefense: 75, baseSpeed: 30, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Koffing line
    { id: 109, name: "Koffing", types: ["poison"], hp: 40, attack: 65, defense: 95, spAttack: 60, spDefense: 45, speed: 35, baseHP: 40, baseAttack: 65, baseDefense: 95, baseSpAttack: 60, baseSpDefense: 45, baseSpeed: 35, rarity: "common", catchRate: 75, evolution: { level: 35, evolvesTo: "Weezing" }, region: "kanto" },
    { id: 110, name: "Weezing", types: ["poison"], hp: 65, attack: 90, defense: 120, spAttack: 85, spDefense: 70, speed: 60, baseHP: 65, baseAttack: 90, baseDefense: 120, baseSpAttack: 85, baseSpDefense: 70, baseSpeed: 60, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Rhyhorn line
    { id: 111, name: "Rhyhorn", types: ["ground", "rock"], hp: 80, attack: 85, defense: 95, spAttack: 30, spDefense: 30, speed: 25, baseHP: 80, baseAttack: 85, baseDefense: 95, baseSpAttack: 30, baseSpDefense: 30, baseSpeed: 25, rarity: "common", catchRate: 75, evolution: { level: 42, evolvesTo: "Rhydon" }, region: "kanto" },
    { id: 112, name: "Rhydon", types: ["ground", "rock"], hp: 105, attack: 130, defense: 120, spAttack: 45, spDefense: 45, speed: 40, baseHP: 105, baseAttack: 130, baseDefense: 120, baseSpAttack: 45, baseSpDefense: 45, baseSpeed: 40, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Chansey
    { id: 113, name: "Chansey", types: ["normal"], hp: 250, attack: 5, defense: 5, spAttack: 35, spDefense: 105, speed: 50, baseHP: 250, baseAttack: 5, baseDefense: 5, baseSpAttack: 35, baseSpDefense: 105, baseSpeed: 50, rarity: "rare", catchRate: 30, evolution: null, region: "kanto" },

    // Tangela
    { id: 114, name: "Tangela", types: ["grass"], hp: 65, attack: 55, defense: 115, spAttack: 100, spDefense: 40, speed: 60, baseHP: 65, baseAttack: 55, baseDefense: 115, baseSpAttack: 100, baseSpDefense: 40, baseSpeed: 60, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Kangaskhan
    { id: 115, name: "Kangaskhan", types: ["normal"], hp: 105, attack: 95, defense: 80, spAttack: 40, spDefense: 80, speed: 90, baseHP: 105, baseAttack: 95, baseDefense: 80, baseSpAttack: 40, baseSpDefense: 80, baseSpeed: 90, rarity: "rare", catchRate: 45, evolution: null, region: "kanto" },

    // Horsea line
    { id: 116, name: "Horsea", types: ["water"], hp: 30, attack: 40, defense: 70, spAttack: 70, spDefense: 25, speed: 60, baseHP: 30, baseAttack: 40, baseDefense: 70, baseSpAttack: 70, baseSpDefense: 25, baseSpeed: 60, rarity: "common", catchRate: 75, evolution: { level: 32, evolvesTo: "Seadra" }, region: "kanto" },
    { id: 117, name: "Seadra", types: ["water"], hp: 55, attack: 65, defense: 95, spAttack: 95, spDefense: 45, speed: 85, baseHP: 55, baseAttack: 65, baseDefense: 95, baseSpAttack: 95, baseSpDefense: 45, baseSpeed: 85, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Goldeen line
    { id: 118, name: "Goldeen", types: ["water"], hp: 45, attack: 67, defense: 60, spAttack: 35, spDefense: 50, speed: 63, baseHP: 45, baseAttack: 67, baseDefense: 60, baseSpAttack: 35, baseSpDefense: 50, baseSpeed: 63, rarity: "common", catchRate: 75, evolution: { level: 33, evolvesTo: "Seaking" }, region: "kanto" },
    { id: 119, name: "Seaking", types: ["water"], hp: 80, attack: 92, defense: 65, spAttack: 65, spDefense: 80, speed: 68, baseHP: 80, baseAttack: 92, baseDefense: 65, baseSpAttack: 65, baseSpDefense: 80, baseSpeed: 68, rarity: "common", catchRate: 65, evolution: null, region: "kanto" },

    // Staryu line
    { id: 120, name: "Staryu", types: ["water"], hp: 30, attack: 45, defense: 55, spAttack: 70, spDefense: 55, speed: 85, baseHP: 30, baseAttack: 45, baseDefense: 55, baseSpAttack: 70, baseSpDefense: 55, baseSpeed: 85, rarity: "common", catchRate: 75, evolution: { level: 30, evolvesTo: "Starmie" }, region: "kanto" },
    { id: 121, name: "Starmie", types: ["water", "psychic"], hp: 60, attack: 75, defense: 85, spAttack: 100, spDefense: 85, speed: 115, baseHP: 60, baseAttack: 75, baseDefense: 85, baseSpAttack: 100, baseSpDefense: 85, baseSpeed: 115, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Mr. Mime
    { id: 122, name: "Mr. Mime", types: ["psychic", "fairy"], hp: 40, attack: 45, defense: 65, spAttack: 100, spDefense: 120, speed: 90, baseHP: 40, baseAttack: 45, baseDefense: 65, baseSpAttack: 100, baseSpDefense: 120, baseSpeed: 90, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Scyther
    { id: 123, name: "Scyther", types: ["bug", "flying"], hp: 70, attack: 110, defense: 80, spAttack: 55, spDefense: 80, speed: 105, baseHP: 70, baseAttack: 110, baseDefense: 80, baseSpAttack: 55, baseSpDefense: 80, baseSpeed: 105, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Jynx
    { id: 124, name: "Jynx", types: ["ice", "psychic"], hp: 65, attack: 50, defense: 35, spAttack: 115, spDefense: 95, speed: 95, baseHP: 65, baseAttack: 50, baseDefense: 35, baseSpAttack: 115, baseSpDefense: 95, baseSpeed: 95, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Electabuzz
    { id: 125, name: "Electabuzz", types: ["electric"], hp: 65, attack: 83, defense: 57, spAttack: 95, spDefense: 85, speed: 105, baseHP: 65, baseAttack: 83, baseDefense: 57, baseSpAttack: 95, baseSpDefense: 85, baseSpeed: 105, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Magmar
    { id: 126, name: "Magmar", types: ["fire"], hp: 65, attack: 95, defense: 57, spAttack: 100, spDefense: 85, speed: 93, baseHP: 65, baseAttack: 95, baseDefense: 57, baseSpAttack: 100, baseSpDefense: 85, baseSpeed: 93, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Pinsir
    { id: 127, name: "Pinsir", types: ["bug"], hp: 65, attack: 125, defense: 100, spAttack: 55, spDefense: 70, speed: 85, baseHP: 65, baseAttack: 125, baseDefense: 100, baseSpAttack: 55, baseSpDefense: 70, baseSpeed: 85, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Tauros
    { id: 128, name: "Tauros", types: ["normal"], hp: 75, attack: 100, defense: 95, spAttack: 40, spDefense: 70, speed: 110, baseHP: 75, baseAttack: 100, baseDefense: 95, baseSpAttack: 40, baseSpDefense: 70, baseSpeed: 110, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Magikarp line
    { id: 129, name: "Magikarp", types: ["water"], hp: 20, attack: 10, defense: 55, spAttack: 15, spDefense: 20, speed: 80, baseHP: 20, baseAttack: 10, baseDefense: 55, baseSpAttack: 15, baseSpDefense: 20, baseSpeed: 80, rarity: "common", catchRate: 75, evolution: { level: 20, evolvesTo: "Gyarados" }, region: "kanto" },
    { id: 130, name: "Gyarados", types: ["water", "flying"], hp: 95, attack: 125, defense: 79, spAttack: 60, spDefense: 100, speed: 81, baseHP: 95, baseAttack: 125, baseDefense: 79, baseSpAttack: 60, baseSpDefense: 100, baseSpeed: 81, rarity: "rare", catchRate: 25, evolution: null, region: "kanto" },

    // Lapras
    { id: 131, name: "Lapras", types: ["water", "ice"], hp: 130, attack: 85, defense: 80, spAttack: 85, spDefense: 95, speed: 60, baseHP: 130, baseAttack: 85, baseDefense: 80, baseSpAttack: 85, baseSpDefense: 95, baseSpeed: 60, rarity: "rare", catchRate: 25, evolution: null, region: "kanto" },

    // Ditto
    { id: 132, name: "Ditto", types: ["normal"], hp: 48, attack: 48, defense: 48, spAttack: 48, spDefense: 48, speed: 48, baseHP: 48, baseAttack: 48, baseDefense: 48, baseSpAttack: 48, baseSpDefense: 48, baseSpeed: 48, rarity: "rare", catchRate: 35, evolution: null, region: "kanto" },

    // Eevee and evolutions
    { id: 133, name: "Eevee", types: ["normal"], hp: 55, attack: 55, defense: 50, spAttack: 45, spDefense: 65, speed: 55, baseHP: 55, baseAttack: 55, baseDefense: 50, baseSpAttack: 45, baseSpDefense: 65, baseSpeed: 55, rarity: "uncommon", catchRate: 45, evolution: { level: 25, evolvesTo: "Flareon" }, region: "kanto" },
    { id: 134, name: "Vaporeon", types: ["water"], hp: 130, attack: 65, defense: 60, spAttack: 110, spDefense: 95, speed: 65, baseHP: 130, baseAttack: 65, baseDefense: 60, baseSpAttack: 110, baseSpDefense: 95, baseSpeed: 65, rarity: "uncommon", catchRate: 35, evolution: null, region: "kanto" },
    { id: 135, name: "Jolteon", types: ["electric"], hp: 65, attack: 65, defense: 60, spAttack: 110, spDefense: 95, speed: 130, baseHP: 65, baseAttack: 65, baseDefense: 60, baseSpAttack: 110, baseSpDefense: 95, baseSpeed: 130, rarity: "uncommon", catchRate: 35, evolution: null, region: "kanto" },
    { id: 136, name: "Flareon", types: ["fire"], hp: 65, attack: 130, defense: 60, spAttack: 95, spDefense: 110, speed: 65, baseHP: 65, baseAttack: 130, baseDefense: 60, baseSpAttack: 95, baseSpDefense: 110, baseSpeed: 65, rarity: "uncommon", catchRate: 35, evolution: null, region: "kanto" },

    // Porygon
    { id: 137, name: "Porygon", types: ["normal"], hp: 65, attack: 60, defense: 70, spAttack: 85, spDefense: 75, speed: 40, baseHP: 65, baseAttack: 60, baseDefense: 70, baseSpAttack: 85, baseSpDefense: 75, baseSpeed: 40, rarity: "uncommon", catchRate: 45, evolution: null, region: "kanto" },

    // Omanyte line
    { id: 138, name: "Omanyte", types: ["rock", "water"], hp: 35, attack: 40, defense: 100, spAttack: 90, spDefense: 55, speed: 35, baseHP: 35, baseAttack: 40, baseDefense: 100, baseSpAttack: 90, baseSpDefense: 55, baseSpeed: 35, rarity: "rare", catchRate: 45, evolution: { level: 40, evolvesTo: "Omastar" }, region: "kanto" },
    { id: 139, name: "Omastar", types: ["rock", "water"], hp: 70, attack: 60, defense: 125, spAttack: 115, spDefense: 70, speed: 55, baseHP: 70, baseAttack: 60, baseDefense: 125, baseSpAttack: 115, baseSpDefense: 70, baseSpeed: 55, rarity: "rare", catchRate: 35, evolution: null, region: "kanto" },

    // Kabuto line
    { id: 140, name: "Kabuto", types: ["rock", "water"], hp: 30, attack: 80, defense: 90, spAttack: 55, spDefense: 45, speed: 55, baseHP: 30, baseAttack: 80, baseDefense: 90, baseSpAttack: 55, baseSpDefense: 45, baseSpeed: 55, rarity: "rare", catchRate: 45, evolution: { level: 40, evolvesTo: "Kabutops" }, region: "kanto" },
    { id: 141, name: "Kabutops", types: ["rock", "water"], hp: 60, attack: 115, defense: 105, spAttack: 65, spDefense: 70, speed: 80, baseHP: 60, baseAttack: 115, baseDefense: 105, baseSpAttack: 65, baseSpDefense: 70, baseSpeed: 80, rarity: "rare", catchRate: 35, evolution: null, region: "kanto" },

    // Aerodactyl
    { id: 142, name: "Aerodactyl", types: ["rock", "flying"], hp: 80, attack: 105, defense: 65, spAttack: 60, spDefense: 75, speed: 130, baseHP: 80, baseAttack: 105, baseDefense: 65, baseSpAttack: 60, baseSpDefense: 75, baseSpeed: 130, rarity: "rare", catchRate: 25, evolution: null, region: "kanto" },

    // Snorlax
    { id: 143, name: "Snorlax", types: ["normal"], hp: 160, attack: 110, defense: 65, spAttack: 65, spDefense: 110, speed: 30, baseHP: 160, baseAttack: 110, baseDefense: 65, baseSpAttack: 65, baseSpDefense: 110, baseSpeed: 30, rarity: "rare", catchRate: 25, evolution: null, region: "kanto" },

    // Legendary birds
    { id: 144, name: "Articuno", types: ["ice", "flying"], hp: 90, attack: 85, defense: 100, spAttack: 95, spDefense: 125, speed: 85, baseHP: 90, baseAttack: 85, baseDefense: 100, baseSpAttack: 95, baseSpDefense: 125, baseSpeed: 85, rarity: "legendary", catchRate: 5, evolution: null, region: "kanto", isLegendary: true },
    { id: 145, name: "Zapdos", types: ["electric", "flying"], hp: 90, attack: 90, defense: 85, spAttack: 125, spDefense: 90, speed: 100, baseHP: 90, baseAttack: 90, baseDefense: 85, baseSpAttack: 125, baseSpDefense: 90, baseSpeed: 100, rarity: "legendary", catchRate: 5, evolution: null, region: "kanto", isLegendary: true },
    { id: 146, name: "Moltres", types: ["fire", "flying"], hp: 90, attack: 100, defense: 90, spAttack: 125, spDefense: 85, speed: 90, baseHP: 90, baseAttack: 100, baseDefense: 90, baseSpAttack: 125, baseSpDefense: 85, baseSpeed: 90, rarity: "legendary", catchRate: 5, evolution: null, region: "kanto", isLegendary: true },

    // Dratini line
    { id: 147, name: "Dratini", types: ["dragon"], hp: 41, attack: 64, defense: 45, spAttack: 50, spDefense: 50, speed: 50, baseHP: 41, baseAttack: 64, baseDefense: 45, baseSpAttack: 50, baseSpDefense: 50, baseSpeed: 50, rarity: "epic", catchRate: 20, evolution: { level: 30, evolvesTo: "Dragonair" }, region: "kanto" },
    { id: 148, name: "Dragonair", types: ["dragon"], hp: 61, attack: 84, defense: 65, spAttack: 70, spDefense: 70, speed: 70, baseHP: 61, baseAttack: 84, baseDefense: 65, baseSpAttack: 70, baseSpDefense: 70, baseSpeed: 70, rarity: "epic", catchRate: 15, evolution: { level: 55, evolvesTo: "Dragonite" }, region: "kanto" },
    { id: 149, name: "Dragonite", types: ["dragon", "flying"], hp: 91, attack: 134, defense: 95, spAttack: 100, spDefense: 100, speed: 80, baseHP: 91, baseAttack: 134, baseDefense: 95, baseSpAttack: 100, baseSpDefense: 100, baseSpeed: 80, rarity: "epic", catchRate: 10, evolution: null, region: "kanto" },

    // Mewtwo
    { id: 150, name: "Mewtwo", types: ["psychic"], hp: 106, attack: 110, defense: 90, spAttack: 154, spDefense: 90, speed: 130, baseHP: 106, baseAttack: 110, baseDefense: 90, baseSpAttack: 154, baseSpDefense: 90, baseSpeed: 130, rarity: "legendary", catchRate: 3, evolution: null, region: "kanto", isLegendary: true },

    // Mew
    { id: 151, name: "Mew", types: ["psychic"], hp: 100, attack: 100, defense: 100, spAttack: 100, spDefense: 100, speed: 100, baseHP: 100, baseAttack: 100, baseDefense: 100, baseSpAttack: 100, baseSpDefense: 100, baseSpeed: 100, rarity: "mythical", catchRate: 2, evolution: null, region: "kanto", isMythical: true }
];


// Rarity definitions with spawn chances and level ranges
const rarityDefinitions = {
    common: { 
        chance: 0.50,      // 50% chance
        color: "#808080",
        levelMin: 1,
        levelMax: 100,
        spawnRate: 1.0,
        description: "Very common - appears everywhere"
    },
    uncommon: { 
        chance: 0.25,      // 25% chance
        color: "#4caf50",
        levelMin: 5,
        levelMax: 100,
        spawnRate: 0.8,
        description: "Common - appears in most areas"
    },
    rare: { 
        chance: 0.12,      // 12% chance
        color: "#2196f3",
        levelMin: 10,
        levelMax: 100,
        spawnRate: 0.6,
        description: "Uncommon - requires some searching"
    },
    superRare: { 
        chance: 0.07,      // 7% chance
        color: "#9c27b0",
        levelMin: 20,
        levelMax: 100,
        spawnRate: 0.4,
        description: "Rare - difficult to find"
    },
    ultraRare: { 
        chance: 0.04,      // 4% chance
        color: "#ff9800",
        levelMin: 30,
        levelMax: 100,
        spawnRate: 0.2,
        description: "Very rare - a special encounter"
    },
    mythical: { 
        chance: 0.02,      // 2% chance
        color: "#f44336",
        levelMin: 70,
        levelMax: 100,
        spawnRate: 0.1,
        description: "Legendary - once in a lifetime"
    }
};

// Region definitions with background images and level ranges
const regions = [
    {
        id: "kanto_forest",
        name: "Kanto Forest",
        background: "url('images/forest_bg.jpg')",
        levelMin: 1,
        levelMax: 20,
        description: "A peaceful forest with low-level Pokémon",
        requiredLevel: 1,
        hasGym: false,
        pokemon: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]
    },
    {
        id: "kanto_mountains",
        name: "Kanto Mountains",
        background: "url('images/mountain_bg.jpg')",
        levelMin: 21,
        levelMax: 35,
        description: "Rocky mountains with Rock and Ground types",
        requiredLevel: 21,
        hasGym: true,
        gymLeader: "Brock",
        gymType: "rock",
        pokemon: [51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100]
    },
    {
        id: "kanto_coast",
        name: "Kanto Coast",
        background: "url('images/coast_bg.jpg')",
        levelMin: 36,
        levelMax: 45,
        description: "Beautiful coastline with Water types",
        requiredLevel: 36,
        hasGym: true,
        gymLeader: "Misty",
        gymType: "water",
        pokemon: [101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151]
    },
    {
        id: "kanto_city",
        name: "Kanto City",
        background: "url('images/city_bg.jpg')",
        levelMin: 46,
        levelMax: 55,
        description: "Busy city with Electric and Normal types",
        requiredLevel: 46,
        hasGym: true,
        gymLeader: "Lt. Surge",
        gymType: "electric",
        pokemon: [1,4,7,10,13,16,19,21,23,25,27,29,32,35,37,39,41,43,46,48,50,52,54,56,58,60,63,66,69,72,74,77,79,81,83,84,86,88,90,92,95,96,98,100,102,104,106,107,108,109,111,113,114,115,116,118,120,122,123,124,125,126,127,128,129,131,132,133,137,138,140,142,143,147,150]
    },
    {
        id: "kanto_plains",
        name: "Kanto Plains",
        background: "url('images/plains_bg.jpg')",
        levelMin: 48,
        levelMax: 57,
        description: "Vast grassy plains with Grass and Poison types",
        requiredLevel: 48,
        hasGym: true,
        gymLeader: "Erika",
        gymType: "grass",
        pokemon: [1,2,3,43,44,45,69,70,71,102,103,114,182,191,315]
    },
    {
        id: "kanto_marsh",
        name: "Fuchsia City",
        background: "url('images/marsh_bg.jpg')",
        levelMin: 52,
        levelMax: 62,
        description: "Poison-filled marshlands with rare Pokémon",
        requiredLevel: 52,
        hasGym: true,
        gymLeader: "Koga",
        gymType: "poison",
        pokemon: [23,24,29,30,31,32,33,34,41,42,88,89,109,110,23,24,92,93,94]
    },
    {
        id: "kanto_volcano",
        name: "Kanto Volcano",
        background: "url('images/volcano_bg.jpg')",
        levelMin: 56,
        levelMax: 65,
        description: "Active volcano with Fire and Dragon types",
        requiredLevel: 56,
        hasGym: true,
        gymLeader: "Blaine",
        gymType: "fire",
        pokemon: [4,5,6,37,38,58,59,77,78,126,136,142,146,147,148,149]
    },
    {
        id: "kanto_haunted",
        name: "Lavender Tower",
        background: "url('images/haunted_bg.jpg')",
        levelMin: 66,
        levelMax: 75,
        description: "Mysterious tower with Ghost and Psychic types",
        requiredLevel: 66,
        hasGym: true,
        gymLeader: "Sabrina",
        gymType: "psychic",
        pokemon: [92,93,94,96,97,102,103,121,122,124,150,151]
    },
    {
        id: "kanto_safari",
        name: "Safari Zone",
        background: "url('images/safari_bg.jpg')",
        levelMin: 76,
        levelMax: 85,
        description: "Wild preserve with rare Pokémon",
        requiredLevel: 76,
        hasGym: false,
        pokemon: [1,2,3,4,5,6,7,8,9,25,26,37,38,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151]
    },
    {
        id: "kanto_elite",
        name: "Victory Road",
        background: "url('images/elite_bg.jpg')",
        levelMin: 86,
        levelMax: 100,
        description: "Ultimate challenge for the strongest trainers",
        requiredLevel: 86,
        hasGym: true,
        gymLeader: "Champion",
        gymType: "dragon",
        pokemon: [3,6,9,65,68,76,94,103,105,110,112,113,115,121,123,124,125,126,127,128,130,131,134,135,136,139,141,142,143,144,145,146,147,148,149,150,151]
    }
];

// Convert regions array to object for easier access
const regionsMap = {};
regions.forEach(region => {
    regionsMap[region.id] = region;
});

// Update gymLeaders to match new regions
const gymLeaders = {
    "kanto_mountains": { 
        name: "Brock", 
        type: "rock", 
        badge: "Boulder Badge", 
        level: 30, 
        reward: 1500,
        pokemon: [ 
            { name: "Geodude", level: 28, hp: 45, attack: 40 }, 
            { name: "Onix", level: 30, hp: 55, attack: 45 },
            { name: "Golem", level: 32, hp: 80, attack: 110 }
        ] 
    },
    "kanto_coast": { 
        name: "Misty", 
        type: "water", 
        badge: "Cascade Badge", 
        level: 40, 
        reward: 2000,
        pokemon: [ 
            { name: "Staryu", level: 38, hp: 50, attack: 45 }, 
            { name: "Starmie", level: 40, hp: 65, attack: 55 },
            { name: "Gyarados", level: 42, hp: 95, attack: 125 }
        ] 
    },
    "kanto_city": { 
        name: "Lt. Surge", 
        type: "electric", 
        badge: "Thunder Badge", 
        level: 50, 
        reward: 2500,
        pokemon: [ 
            { name: "Voltorb", level: 48, hp: 55, attack: 50 }, 
            { name: "Pikachu", level: 50, hp: 60, attack: 55 }, 
            { name: "Raichu", level: 52, hp: 70, attack: 65 },
            { name: "Electabuzz", level: 54, hp: 65, attack: 83 }
        ] 
    },
    "kanto_plains": {
        name: "Erika",
        type: "grass",
        badge: "Rainbow Badge",
        level: 53,
        reward: 2700,
        pokemon: [
            { name: "Tangela", level: 50, hp: 65, attack: 55 },
            { name: "Weepinbell", level: 52, hp: 65, attack: 65 },
            { name: "Gloom", level: 54, hp: 60, attack: 65 },
            { name: "Vileplume", level: 56, hp: 75, attack: 80 }
        ]
    },
    "kanto_marsh": {
        name: "Koga",
        type: "poison",
        badge: "Soul Badge",
        level: 57,
        reward: 2900,
        pokemon: [
            { name: "Koffing", level: 54, hp: 60, attack: 65 },
            { name: "Muk", level: 56, hp: 105, attack: 105 },
            { name: "Weezing", level: 58, hp: 65, attack: 90 },
            { name: "Arbok", level: 60, hp: 73, attack: 85 }
        ]
    },
    "kanto_volcano": { 
        name: "Blaine", 
        type: "fire", 
        badge: "Volcano Badge", 
        level: 60, 
        reward: 3000,
        pokemon: [ 
            { name: "Growlithe", level: 58, hp: 75, attack: 70 }, 
            { name: "Ponyta", level: 60, hp: 80, attack: 75 }, 
            { name: "Arcanine", level: 62, hp: 95, attack: 110 },
            { name: "Magmar", level: 64, hp: 65, attack: 95 }
        ] 
    },
    "kanto_haunted": { 
        name: "Sabrina", 
        type: "psychic", 
        badge: "Marsh Badge", 
        level: 70, 
        reward: 3500,
        pokemon: [ 
            { name: "Kadabra", level: 68, hp: 60, attack: 55 }, 
            { name: "Mr. Mime", level: 70, hp: 70, attack: 65 }, 
            { name: "Alakazam", level: 72, hp: 80, attack: 75 },
            { name: "Hypno", level: 74, hp: 85, attack: 73 }
        ] 
    },
    "kanto_elite": { 
        name: "Champion Lance", 
        type: "dragon", 
        badge: "Champion Badge", 
        level: 90, 
        reward: 5000,
        pokemon: [ 
            { name: "Gyarados", level: 88, hp: 95, attack: 125 }, 
            { name: "Dragonite", level: 90, hp: 91, attack: 134 }, 
            { name: "Aerodactyl", level: 92, hp: 80, attack: 105 },
            { name: "Charizard", level: 94, hp: 78, attack: 84 },
            { name: "Dragonite", level: 96, hp: 91, attack: 134 }
        ] 
    }
};

// Buddy bonuses
const buddyBonuses = {
    fire: { exploreBonus: 0.1, findRate: 0.05, description: "Increases chance of finding rare items" },
    water: { catchBonus: 0.05, healBonus: 5, description: "Increases catch rate and healing" },
    grass: { xpBonus: 0.1, hpBonus: 10, description: "Increases XP gain and max HP" },
    electric: { speedBonus: 0.1, critBonus: 0.02, description: "Increases speed and critical hit rate" },
    psychic: { moveBonus: 0.1, accuracyBonus: 5, description: "Increases move power and accuracy" },
    ice: { freezeBonus: 0.05, defenseBonus: 10, description: "Chance to freeze and increased defense" },
    dragon: { allBonus: 0.05, rareBonus: 0.1, description: "Small bonus to everything, better rare finds" },
    dark: { stealBonus: 0.1, creditBonus: 0.1, description: "Chance to find extra credits and items" },
    fighting: { attackBonus: 15, critBonus: 0.03, description: "Increases attack power" },
    poison: { poisonBonus: 0.05, healReduction: 0.1, description: "Chance to poison enemies" },
    ground: { defenseBonus: 15, hpBonus: 15, description: "Increases defense and HP" },
    flying: { escapeBonus: 0.1, speedBonus: 0.15, description: "Easier to escape from battles" },
    rock: { defenseBonus: 20, catchReduction: 0.05, description: "High defense but slightly harder to catch" },
    ghost: { evadeBonus: 0.1, stealBonus: 0.05, description: "Chance to evade attacks and steal items" },
    steel: { defenseBonus: 25, speedReduction: 0.05, description: "Very high defense but slower" },
    fairy: { healBonus: 10, happinessBonus: 0.2, description: "Increases healing and happiness gain" },
    bug: { expBonus: 0.15, findBonus: 0.1, description: "Faster XP gain and better item finds" },
    normal: { balancedBonus: 0.1, description: "Small bonus to everything" }
};

// Happiness levels
const happinessLevels = [
    { threshold: 0, name: "Neutral", emoji: "😐", bonus: 1.0 },
    { threshold: 100, name: "Friendly", emoji: "🙂", bonus: 1.1 },
    { threshold: 200, name: "Happy", emoji: "😊", bonus: 1.2 },
    { threshold: 300, name: "Delighted", emoji: "😄", bonus: 1.3 },
    { threshold: 400, name: "Ecstatic", emoji: "🤩", bonus: 1.5 },
    { threshold: 500, name: "Best Friends", emoji: "💖", bonus: 2.0 }
];

// Evolution mapping
const evolutionMap = {};
pokemonDatabase.forEach(p => { if (p.evolution) { evolutionMap[p.name] = p.evolution; } });

// Max level cap
const MAX_LEVEL = 100;