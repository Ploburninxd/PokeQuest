const saveSystem = {
    saveGame: function() {
        const saveData = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            player: {
                level: player.level,
                xp: player.xp,
                pokemon: player.pokemon,
                inventory: player.inventory,
                credits: player.credits,
                pokedex: player.pokedex,
                hasStarter: player.hasStarter,
                unlockedRegions: player.unlockedRegions,
                badges: player.badges,
                tms: player.tms,
                _wins: player._wins || 0,
                _evolutions: player._evolutions || 0,
                pc: player.pc || []
            }
        };
        
        const jsonString = JSON.stringify(saveData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `pokemon_save_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        ui.showNotification('Game saved to file!', true);
    },

    loadGame: function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    if (!saveData.player) {
                        throw new Error('Invalid save file');
                    }
                    
                    player.level = saveData.player.level || 1;
                    player.xp = saveData.player.xp || 0;
                    player.pokemon = saveData.player.pokemon || [];
                    player.inventory = saveData.player.inventory || { 
                        pokeball: 10, greatball: 10, ultraball: 10, masterball: 5, 
                        potion: 5, superpotion: 0, hyperpotion: 0, rarecandy: 0 
                    };
                    player.credits = saveData.player.credits || 10000;
                    player.pokedex = saveData.player.pokedex || {};
                    player.hasStarter = saveData.player.hasStarter || false;
                    player.unlockedRegions = saveData.player.unlockedRegions || ['kanto_forest'];
                    player.badges = saveData.player.badges || [];
                    player.tms = saveData.player.tms || [];
                    player._wins = saveData.player._wins || 0;
                    player._evolutions = saveData.player._evolutions || 0;
                    player.pc = saveData.player.pc || [];
                    
                    currentBattle = null;
                    gymChallenge = null;
                    pendingMoveLearn = null;
                    
                    document.getElementById('startMenu').style.display = 'none';
                    document.getElementById('gameContainer').style.display = 'block';
                    
                    if (!player.unlockedRegions.includes(currentRegion)) {
                        currentRegion = 'kanto_forest';
                    }
                    
                    if (player.hasStarter) {
                        document.getElementById('exploreBtn').disabled = false;
                        document.getElementById('gymBtn').disabled = false;
                        document.getElementById('pokemonBtn').disabled = false;
                        document.getElementById('shopBtn').disabled = false;
                        document.getElementById('healBtn').disabled = false;
                        
                        ui.updateStats();
                        ui.updateBadges();
                        ui.updateRegionButtons();
                        game.selectRegion(currentRegion);
                        ui.updateBuddyDisplay();
                        
                        ui.showMessage("Game loaded! Continue your adventure.");
                    } else {
                        ui.showStarters();
                    }
                    
                    ui.showNotification('Game loaded successfully from file!', true);
                    
                } catch (error) {
                    console.error('Error loading save:', error);
                    ui.showNotification('Invalid save file!', false);
                }
                
                document.body.removeChild(fileInput);
            };
            
            reader.readAsText(file);
        };
        
        fileInput.click();
    },

    resetToDefault: function() {
        player = {
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
        
        currentBattle = null;
        gymChallenge = null;
        currentRegion = 'kanto_forest';
        pendingMoveLearn = null;
        game.buddy.currentBuddy = null;
        game.buddy.happiness = 0;
        game.buddy.steps = 0;
        
        document.getElementById('exploreBtn').disabled = true;
        document.getElementById('gymBtn').disabled = true;
        document.getElementById('pokemonBtn').disabled = true;
        document.getElementById('shopBtn').disabled = true;
        document.getElementById('healBtn').disabled = true;
        
        ui.updateStats();
        ui.updateBadges();
        ui.updateRegionButtons();
        game.selectRegion('kanto_forest');
        ui.updateBuddyDisplay();
    },

    resetGame: function() {
        if (confirm("Reset all progress? This cannot be undone!")) {
            this.resetToDefault();
            ui.showStarters();
            ui.showNotification('Game reset!', true);
        }
    }
};