const ui = {
    showNotification: function(message, isSuccess = true) {
        const existing = document.querySelectorAll('.save-notification');
        existing.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.style.background = isSuccess ? '#4caf50' : '#f44336';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.padding = '12px 24px';
        notification.style.borderRadius = '8px';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        notification.style.border = '2px solid #ffd700';
        notification.style.animation = 'slideInRight 0.3s ease';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 2000);
    },

    updateStats: function() {
        document.getElementById('trainerLevel').textContent = player.level;
        document.getElementById('creditCount').textContent = player.credits;
        document.getElementById('pokedexCount').textContent = `${Object.keys(player.pokedex).length}/151`;
        document.getElementById('maxLevel').textContent = player.pokemon.reduce((max, p) => Math.max(max, p.level), 1);
    },

    updateBadges: function() {
        const badgeIds = ['kanto_mountains', 'kanto_coast', 'kanto_city', 'kanto_plains', 'kanto_marsh', 'kanto_volcano', 'kanto_haunted', 'kanto_elite'];
        for (let i = 0; i < 8; i++) {
            const badge = document.getElementById(`badge${i+1}`);
            if (badge) {
                if (player.badges.includes(badgeIds[i])) {
                    badge.classList.add('earned');
                } else {
                    badge.classList.remove('earned');
                }
            }
        }
        document.getElementById('badgeCount').textContent = `${player.badges.length}/8`;
    },

    updateRegionButtons: function() {
        const regionSelector = document.getElementById('regionSelector');
        if (!regionSelector) return;
        
        let html = '<div class="region-grid">';
        
        regions.forEach(region => {
            if (!region) return;
            const unlocked = player.unlockedRegions.includes(region.id);
            const activeClass = currentRegion === region.id ? 'active' : '';
            
            html += `
                <button class="region-btn ${region.id} ${activeClass} ${region.hasGym ? 'has-gym' : ''}" 
                        onclick="game.selectRegion('${region.id}')" 
                        id="region-${region.id}"
                        style="opacity: ${unlocked ? 1 : 0.5};">
                    <span class="region-icon">${this.getRegionIcon(region.id)}</span>
                    <span class="region-name">${region.name}</span>
                    <span class="region-levels">Lv.${region.levelMin}-${region.levelMax}</span>
                </button>
            `;
        });
        
        html += '</div>';
        regionSelector.innerHTML = html;
        this.updateCurrentRegionDisplay();
    },

    updateCurrentRegionDisplay: function() {
        const region = regionsMap[currentRegion];
        if (region) {
            document.getElementById('currentRegion').textContent = region.name;
            document.getElementById('regionLevels').textContent = `Levels ${region.levelMin}-${region.levelMax}`;
            document.body.className = `region-${currentRegion}`;
        }
    },

    selectRegion: function(regionId) {
        if (!player.unlockedRegions.includes(regionId)) return;
        
        currentRegion = regionId;
        document.querySelectorAll('.region-btn').forEach(btn => btn.classList.remove('active'));
        const btn = document.getElementById(`region-${regionId}`);
        if (btn) btn.classList.add('active');
        
        this.updateCurrentRegionDisplay();
        this.showNotification(`Now exploring: ${regionsMap[regionId].name}`, true);
    },

    showStarters: function() {
        const starters = pokemonDatabase.filter(p => ['Bulbasaur', 'Charmander', 'Squirtle'].includes(p.name));
        let html = '<h2>Choose Your Starter</h2><div class="pokemon-collection">';
        
        starters.forEach(p => {
            html += `<div class="pokemon-card ${p.rarity}" onclick="ui.selectStarter('${p.name}')">`;
            html += `<div class="pokemon-card-header"><span class="pokemon-card-name">${p.name}</span></div>`;
            html += `<div class="pokemon-card-image">${this.getPokemonSprite(p, 110)}</div>`;
            html += `<div class="pokemon-card-types">${p.types.map(t => `<span class="pokemon-card-type type-${t}">${t}</span>`).join('')}</div>`;
            html += `<div class="pokemon-card-stats"><div class="pokemon-card-stat"><span class="pokemon-card-stat-label">HP</span><span class="pokemon-card-stat-value">${p.hp}</span></div><div class="pokemon-card-stat"><span class="pokemon-card-stat-label">ATK</span><span class="pokemon-card-stat-value">${p.attack}</span></div></div>`;
            html += `</div>`;
        });
        
        html += '</div>';
        document.getElementById('gameScreen').innerHTML = html;
        this.updateRegionButtons();
    },

    selectStarter: function(name) {
        if (player.hasStarter) return;
        
        const starterData = pokemonDatabase.find(p => p.name === name);
        const starter = {
            ...starterData,
            dexId: starterData.id,
            id: Date.now(),
            level: 5,
            currentHP: starterData.hp + 20,
            maxHP: starterData.hp + 20,
            attack: starterData.attack + 10,
            xp: 0,
            moves: game.getMovesForPokemon({...starterData, level: 5}),
            isShiny: Math.random() < 0.01
        };
        
        player.pokemon = [starter];
        player.hasStarter = true;
        // NOTE: starter does NOT go in pokedex — only caught wild pokemon count
        
        ['exploreBtn', 'gymBtn', 'pokemonBtn', 'shopBtn', 'healBtn'].forEach(id => 
            document.getElementById(id).disabled = false
        );
        
        const typeColors = {
            fire:'#F08030', water:'#6890F0', grass:'#78C850',
        };
        const tc = typeColors[starterData.types[0]] || '#ffd700';
        document.getElementById('gameScreen').innerHTML = `
            <div style="text-align:center;padding:30px;">
                <div style="margin-bottom:12px;">${this.getPokemonSprite(starter, 120)}</div>
                <h2 style="color:${tc};margin-bottom:8px;">✨ You chose ${starter.name}!</h2>
                ${starter.isShiny ? '<p style="color:#ffd700;font-size:1.1em;margin-bottom:8px;">⭐ SHINY Starter! Lucky!</p>' : ''}
                <p style="color:#aaa;margin-bottom:20px;">Your adventure begins now. Explore the Kanto region!</p>
                <button onclick="game.explore()" style="padding:14px 36px;font-size:1.1em;background:linear-gradient(135deg,#4caf50,#388e3c);border-radius:14px;border:2px solid #ffd700;">
                    Start Exploring →
                </button>
            </div>
        `;
        
        this.updateStats();
        this.updateRegionButtons();
        game.checkRegionUnlocks();
    },

    getPokemonEmoji: function(type) {
        const emojis = {
            fire:'🔥', water:'💧', grass:'🌿', electric:'⚡', psychic:'🧠',
            ice:'❄️', dragon:'🐉', dark:'🌑', fighting:'👊', poison:'☠️',
            ground:'🌍', flying:'🦅', rock:'🪨', ghost:'👻', steel:'⚙️',
            fairy:'🧚', bug:'🐛', normal:'⭐'
        };
        return emojis[type] || '❓';
    },

    // Returns an <img> sprite if the pokemon has a valid id, else falls back to emoji
    getPokemonSprite: function(p, size) {
        size = size || 120;
        // Use dexId (Pokédex number) for sprite URL — player pokemon have id=Date.now() so we store dexId separately
        const spriteId = p && (p.dexId || (p.id <= 151 ? p.id : null));
        if (!p || !spriteId) {
            const type = p ? (p.types ? p.types[0] : 'normal') : 'normal';
            return `<span style="font-size:${Math.round(size * 0.55)}px;line-height:1;">${this.getPokemonEmoji(type)}</span>`;
        }
        const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
        const url = p.isShiny ? `${baseUrl}/shiny/${spriteId}.png` : `${baseUrl}/${spriteId}.png`;
        const fallbackEmoji = this.getPokemonEmoji(p.types ? p.types[0] : 'normal');
        return `<img src="${url}" width="${size}" height="${size}"
            style="image-rendering:pixelated;object-fit:contain;"
            onerror="this.style.display='none';this.nextElementSibling.style.display='inline';"
            alt="${p.name}">
            <span style="font-size:${Math.round(size * 0.55)}px;line-height:1;display:none;">${fallbackEmoji}</span>`;
    },

    getRegionIcon: function(id) {
        const icons = {
            'kanto_forest':'🌳', 'kanto_mountains':'⛰️', 'kanto_coast':'🌊',
            'kanto_city':'🏙️', 'kanto_volcano':'🌋', 'kanto_haunted':'👻',
            'kanto_safari':'🦁', 'kanto_elite':'🏆'
        };
        return icons[id] || '📍';
    },

    // Shared helper — renders a detailed Pokémon card for selection screens
    _renderSelectCard: function(p, index, onclick, options) {
        const disabled = (options && options.disabled) || false;
        const badge    = (options && options.badge)    || '';
        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };
        const mainType  = p.types[0];
        const typeColor = typeColors[mainType] || '#888';
        const hpPercent = Math.max(0, (p.currentHP / p.maxHP) * 100);
        const xpPercent = Math.min(100, ((p.xp || 0) / (p.level * 50)) * 100);
        const hpColor   = hpPercent > 50 ? '#4caf50' : hpPercent > 20 ? '#ffd700' : '#ff4444';
        const isBuddy   = game.buddy.currentBuddy && game.buddy.currentBuddy.name === p.name;
        const clickAttr = disabled ? '' : `onclick="${onclick}"`;
        const dimStyle  = disabled ? 'opacity:0.4;cursor:not-allowed;' : 'cursor:pointer;';
        const hoverOn   = disabled ? '' : `onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 6px 24px ${typeColor}55'"`;
        const hoverOff  = disabled ? '' : `onmouseout="this.style.transform='none';this.style.boxShadow='none'"`;

        return `<div ${clickAttr} ${hoverOn} ${hoverOff} style="
            background:linear-gradient(145deg,rgba(20,20,50,0.97),${typeColor}33);
            border:2px solid ${typeColor};border-radius:18px;padding:16px;
            transition:transform 0.15s,box-shadow 0.15s;${dimStyle}">

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div style="font-weight:bold;font-size:1.05em;color:#fff;">${p.name}${p.isShiny ? ' ✨' : ''}${isBuddy ? ' 🤝' : ''}</div>
                <span style="background:${typeColor};color:#fff;font-size:0.65em;padding:2px 8px;border-radius:10px;font-weight:bold;">${mainType.toUpperCase()}</span>
            </div>

            <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">
                <div style="min-width:72px;text-align:center;">${this.getPokemonSprite(p, 120)}</div>
                <div style="flex:1;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:6px;">
                        <div style="background:rgba(0,0,0,0.35);border-radius:8px;padding:5px;text-align:center;">
                            <div style="color:#888;font-size:0.65em;">LV</div>
                            <div style="color:#ffd700;font-weight:bold;font-size:1em;">${p.level}</div>
                        </div>
                        <div style="background:rgba(0,0,0,0.35);border-radius:8px;padding:5px;text-align:center;">
                            <div style="color:#888;font-size:0.65em;">ATK</div>
                            <div style="color:#ff8888;font-weight:bold;font-size:1em;">${p.attack}</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:4px;flex-wrap:wrap;">
                        ${p.types.map(t => `<span style="background:${typeColors[t]||'#888'};color:#fff;font-size:0.62em;padding:2px 7px;border-radius:8px;">${t.toUpperCase()}</span>`).join('')}
                    </div>
                </div>
            </div>

            <div style="margin-bottom:6px;">
                <div style="display:flex;justify-content:space-between;font-size:0.75em;margin-bottom:3px;">
                    <span style="color:#888;">HP</span>
                    <span style="color:${hpColor};">${p.currentHP} / ${p.maxHP}</span>
                </div>
                <div style="background:rgba(0,0,0,0.5);border-radius:5px;height:8px;overflow:hidden;">
                    <div style="background:${hpColor};height:100%;width:${hpPercent}%;border-radius:5px;"></div>
                </div>
            </div>

            <div style="margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;font-size:0.72em;margin-bottom:2px;">
                    <span style="color:#888;">XP</span>
                    <span style="color:#9988ff;">${p.xp||0}/${p.level*50}</span>
                </div>
                <div style="background:rgba(0,0,0,0.5);border-radius:5px;height:5px;overflow:hidden;">
                    <div style="background:#7038F8;height:100%;width:${xpPercent}%;border-radius:5px;"></div>
                </div>
            </div>

            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;">
                ${(p.moves||[]).filter(Boolean).map(m=>`<span style="background:${typeColors[m.type]||'#888'}33;border:1px solid ${typeColors[m.type]||'#888'};color:#ddd;font-size:0.62em;padding:2px 7px;border-radius:8px;">${m.name}</span>`).join('')}
            </div>

            ${badge ? `<div style="text-align:center;font-size:0.82em;padding:5px;border-radius:8px;background:rgba(255,215,0,0.12);color:#ffd700;border:1px solid rgba(255,215,0,0.3);">${badge}</div>` : ''}
            ${p.currentHP <= 0 ? '<div style="text-align:center;color:#ff4444;font-weight:bold;margin-top:6px;">💀 Fainted</div>' : ''}
        </div>`;
    },

    showPokemonSelectionForBattle: function(wild) {
        const wildData = JSON.stringify(wild).replace(/"/g, '&quot;');
        let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h2 style="margin:0;">⚔️ Choose Your Pokémon</h2>
            <button onclick="game.explore()" style="padding:6px 16px;font-size:0.85em;">Cancel</button>
        </div><div class="pokemon-collection">`;
        player.pokemon.forEach((p, index) => {
            html += this._renderSelectCard(p, index,
                'game.startBattleWithPokemon(' + JSON.stringify(wild).replace(/"/g, '&quot;') + ', ' + index + ')',
                { disabled: p.currentHP <= 0 }
            );
        });
        html += '</div>';
        document.getElementById('gameScreen').innerHTML = html;
    },

    showPokemonSelectionForSwitch: function() {
        if (!currentBattle) return;
        let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h2 style="margin:0;">🔄 Switch Pokémon</h2>
            <button onclick="ui.showBattle()" style="padding:6px 16px;font-size:0.85em;">← Back</button>
        </div><div class="pokemon-collection">`;
        player.pokemon.forEach((p, index) => {
            const isCurrent = index === currentBattle.currentPokemonIndex;
            html += this._renderSelectCard(p, index,
                'game.switchPokemon(' + index + ')',
                { disabled: p.currentHP <= 0 || isCurrent, badge: isCurrent ? '⚔️ Currently Battling' : '' }
            );
        });
        html += '</div>';
        document.getElementById('gameScreen').innerHTML = html;
    },
    showBattle: function() {
    if (!currentBattle) return;
    
    const wild = currentBattle.wild;
    const playerPoke = currentBattle.player;
    
    const wildPercent = (wild.currentHP / wild.maxHP) * 100;
    const playerPercent = (playerPoke.currentHP / playerPoke.maxHP) * 100;
    const catchRate = game.calculateCatchRate(0.3, wild.currentHP, wild.maxHP, wild.rarity);
    
    let hpColor = '#4caf50';
    if (wildPercent <= 10) hpColor = '#ff4444';
    else if (wildPercent <= 20) hpColor = '#ff8800';
    else if (wildPercent <= 30) hpColor = '#ffbb33';
    else if (wildPercent <= 40) hpColor = '#ffd700';

    // Check last log message for effectiveness display
    const lastMsg = currentBattle.log[currentBattle.log.length - 1] || '';
    let effectBanner = '';
    if (lastMsg.includes('Super effective')) {
        effectBanner = '<div class="effectiveness-banner effective-super">🔥 Super Effective!</div>';
    } else if (lastMsg.includes('Not very effective')) {
        effectBanner = '<div class="effectiveness-banner effective-not">💧 Not Very Effective...</div>';
    } else if (lastMsg.includes('Critical hit')) {
        effectBanner = '<div class="effectiveness-banner effective-critical">⚡ Critical Hit!</div>';
    }

    let html = `<h2>⚔️ BATTLE ⚔️</h2>`;
    
    html += `<div class="battle-log">${currentBattle.log.slice(-6).map(msg => `<div class="log-entry">${msg}</div>`).join('')}</div>`;
    if (effectBanner) html += effectBanner;
    
    const shinyClass = wild.isShiny ? 'shiny-glow' : '';
    html += `<div class="pokemon-card ${wild.rarity} ${shinyClass}" id="wildPokemonCard" style="margin-bottom:10px;">`;
    html += `<div class="pokemon-card-header"><span class="pokemon-card-name">Wild ${wild.name}</span>`;
    html += `<span style="background:rgba(255,215,0,0.2);color:#ffd700;font-size:0.75em;padding:2px 8px;border-radius:10px;font-weight:bold;">Lv.${wild.level}</span>`;
    if (wild.isShiny) html += `<span class="pokemon-card-shiny">✨ SHINY</span>`;
    html += `</div>`;
    html += `<div class="pokemon-card-image">${this.getPokemonSprite(wild, 110)}</div>`;
    html += `<div class="pokemon-card-hp" style="color:${hpColor};">HP: ${wild.currentHP}/${wild.maxHP} (${Math.round(wildPercent)}%)</div>`;
    html += `<div class="pokemon-card-hp-bar"><div class="pokemon-card-hp-fill" style="width:${wildPercent}%; background:${hpColor}; transition:width 0.4s;"></div></div>`;
    html += `<div>Catch: ${Math.round(catchRate*100)}%</div>`;
    html += `</div>`;
    
    // Battle actions
    html += `<div class="battle-actions">`;
    html += `<button onclick="ui.showMoveSelection()">⚔️ Move</button>`;
    html += `<button onclick="ui.showPokemonSelectionForSwitch()">🔄 Switch</button>`;
    const ballImg = (name, id) => `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png" class="ball-img" onerror="this.style.display='none'">`;
    html += `<button onclick="game.battleUseBall('pokeball')" ${player.inventory.pokeball <= 0 ? 'disabled' : ''}>${ballImg('poke-ball','pokeball')}Poké (${player.inventory.pokeball})</button>`;
    html += `<button onclick="game.battleUseBall('greatball')" ${player.inventory.greatball <= 0 ? 'disabled' : ''}>${ballImg('great-ball','greatball')}Great (${player.inventory.greatball})</button>`;
    html += `<button onclick="game.battleUseBall('ultraball')" ${player.inventory.ultraball <= 0 ? 'disabled' : ''}>${ballImg('ultra-ball','ultraball')}Ultra (${player.inventory.ultraball})</button>`;
    html += `<button onclick="game.battleUseBall('masterball')" ${player.inventory.masterball <= 0 ? 'disabled' : ''}>${ballImg('master-ball','masterball')}Master (${player.inventory.masterball})</button>`;
    html += `<button onclick="game.battleUsePotion('potion')" ${player.inventory.potion <= 0 ? 'disabled' : ''}>💊 Potion (${player.inventory.potion})</button>`;
    html += `<button onclick="game.battleRun()">🏃 Run</button>`;
    html += `</div>`;
    
    const playerShinyClass = playerPoke.isShiny ? 'shiny-glow' : '';
    html += `<div class="pokemon-card ${playerPoke.rarity} ${playerShinyClass}" id="playerPokemonCard" style="margin-top:10px;">`;
    html += `<div class="pokemon-card-header"><span class="pokemon-card-name">${playerPoke.name}</span>`;
    html += `<span style="background:rgba(104,144,240,0.25);color:#88aaff;font-size:0.75em;padding:2px 8px;border-radius:10px;font-weight:bold;">Lv.${playerPoke.level}</span>`;
    if (playerPoke.isShiny) html += `<span class="pokemon-card-shiny">✨ SHINY</span>`;
    html += `</div>`;
    html += `<div class="pokemon-card-image">${this.getPokemonSprite(playerPoke, 110)}</div>`;
    html += `<div class="pokemon-card-hp">HP: ${playerPoke.currentHP}/${playerPoke.maxHP}</div>`;
    html += `<div class="pokemon-card-hp-bar"><div class="pokemon-card-hp-fill" style="width:${playerPercent}%; transition:width 0.4s;"></div></div>`;
    html += `</div>`;
    
    document.getElementById('gameScreen').innerHTML = html;

    // Trigger shake animation if last action was an attack
    if (lastMsg && (lastMsg.includes('used') || lastMsg.includes('hit'))) {
        setTimeout(() => {
            const wildCard = document.getElementById('wildPokemonCard');
            if (wildCard) battleFX.shakeElement(wildCard);
        }, 50);
    }
},

    showMoveSelection: function() {
        if (!currentBattle) return;

        const playerPoke = currentBattle.player;
        const wild = currentBattle.wild;
        const moves = playerPoke.moves || [];

        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };

        const getEff = (move) => {
            let eff = 1.0;
            wild.types.forEach(defType => {
                if (typeEffectiveness[move.type] && typeEffectiveness[move.type][defType] !== undefined)
                    eff *= typeEffectiveness[move.type][defType];
            });
            if (eff === 0)  return { label:'✗ No Effect',       color:'#888',    bg:'rgba(100,100,100,0.2)', border:'#555' };
            if (eff < 1)    return { label:'▼ Not Very Effective', color:'#88aaff', bg:'rgba(80,100,220,0.2)', border:'#8899ee' };
            if (eff === 1)  return { label:'— Normal Damage',    color:'#aaa',    bg:'rgba(150,150,150,0.1)', border:'#555' };
            if (eff < 2)    return { label:'▲ Effective!',       color:'#88ee88', bg:'rgba(60,180,60,0.2)',  border:'#66cc66' };
            return              { label:'⚡ Super Effective!!', color:'#ffaa00', bg:'rgba(255,140,0,0.25)',  border:'#ffaa00' };
        };

        const wildPercent = (wild.currentHP / wild.maxHP) * 100;
        let hpColor = wildPercent <= 20 ? '#ff4444' : wildPercent <= 50 ? '#ffd700' : '#4caf50';

        let html = `
        <!-- Enemy mini card -->
        <div style="display:flex;align-items:center;gap:12px;background:rgba(0,0,0,0.4);border-radius:14px;padding:14px;margin-bottom:18px;border:1px solid rgba(255,215,0,0.25);">
            ${this.getPokemonSprite(wild, 96)}
            <div style="flex:1;">
                <div style="color:#ffd700;font-weight:bold;font-size:1.1em;">Wild ${wild.name}</div>
                <div style="display:flex;gap:5px;margin:3px 0;">
                    ${wild.types.map(t=>`<span style="background:${typeColors[t]||'#888'};color:#fff;font-size:0.7em;padding:2px 8px;border-radius:10px;font-weight:bold;">${t.toUpperCase()}</span>`).join('')}
                </div>
                <div style="color:${hpColor};font-size:0.85em;">HP: ${wild.currentHP}/${wild.maxHP}</div>
                <div style="background:rgba(0,0,0,0.5);border-radius:6px;height:8px;margin-top:4px;overflow:hidden;">
                    <div style="background:${hpColor};height:100%;width:${wildPercent}%;border-radius:6px;transition:width 0.3s;"></div>
                </div>
            </div>
        </div>

        <div style="color:#ffd700;font-weight:bold;font-size:1em;margin-bottom:12px;text-align:center;">⚔️ ${playerPoke.name}'s Moves</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;">`;

        moves.forEach((move, index) => {
            if (!move) return;
            const eff = getEff(move);
            const typeColor = typeColors[move.type] || '#888';
            html += `
            <div onclick="game.battleAttack(${index})"
                style="background:linear-gradient(145deg,${typeColor}28,${typeColor}48);
                       border:2px solid ${typeColor};border-radius:16px;padding:18px 14px;
                       cursor:pointer;transition:all 0.18s;user-select:none;"
                onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 6px 24px ${typeColor}55'"
                onmouseout="this.style.transform='none';this.style.boxShadow='none'"
                onmousedown="this.style.transform='scale(0.97)'"
                onmouseup="this.style.transform='translateY(-3px)'">
                <!-- Move name -->
                <div style="font-weight:bold;font-size:1.15em;color:#fff;margin-bottom:8px;">${move.name}</div>
                <!-- Tags row -->
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                    <span style="background:${typeColor};color:#fff;font-size:0.72em;padding:3px 9px;border-radius:12px;font-weight:bold;">${move.type.toUpperCase()}</span>
                    <span style="background:rgba(0,0,0,0.45);color:#eee;font-size:0.72em;padding:3px 9px;border-radius:12px;">PWR ${move.power}</span>
                    <span style="background:rgba(0,0,0,0.45);color:#eee;font-size:0.72em;padding:3px 9px;border-radius:12px;">ACC ${move.accuracy || 100}%</span>
                </div>
                <!-- Effectiveness badge -->
                <div style="background:${eff.bg};border:1px solid ${eff.border};border-radius:10px;padding:6px 10px;text-align:center;">
                    <span style="color:${eff.color};font-size:0.88em;font-weight:bold;">${eff.label}</span>
                </div>
            </div>`;
        });

        if (moves.length === 0) {
            html += `<div style="color:#aaa;text-align:center;grid-column:1/-1;padding:20px;">No moves available — Tackle will be used</div>`;
        }

        html += `</div>
        <button onclick="ui.showBattle()"
            style="width:100%;padding:12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
                   border-radius:12px;color:#ccc;cursor:pointer;font-size:1em;transition:background 0.2s;"
            onmouseover="this.style.background='rgba(255,255,255,0.15)'"
            onmouseout="this.style.background='rgba(255,255,255,0.08)'">← Back to Battle</button>`;

        document.getElementById('gameScreen').innerHTML = html;
    },

    showPokemon: function() {
        if (player.pokemon.length === 0) {
            this.showMessage("No Pokémon yet!");
            return;
        }

        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };

        let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h2 style="margin:0;">📋 Your Pokémon (${player.pokemon.length})</h2>
            <button onclick="game.explore()" style="padding:6px 16px;font-size:0.85em;">← Back</button>
        </div>
        <div class="pokemon-collection">`;

        player.pokemon.forEach((p, index) => {
            const hpPercent = Math.max(0, (p.currentHP / p.maxHP) * 100);
            const xpPercent = Math.min(100, ((p.xp || 0) / (p.level * 50)) * 100);
            const mainType = p.types[0];
            const typeColor = typeColors[mainType] || '#888';
            const isBuddy = game.buddy.currentBuddy && game.buddy.currentBuddy.name === p.name;
            let hpColor = hpPercent > 50 ? '#4caf50' : hpPercent > 20 ? '#ffd700' : '#ff4444';

            html += `<div class="pokemon-card ${p.rarity}" onclick="ui.showPokemonDetails(${index})"
                style="border-color:${typeColor};background:linear-gradient(145deg,rgba(42,42,74,0.95) 60%,${typeColor}22);">
                <div class="pokemon-card-header">
                    <span class="pokemon-card-name">${p.name}${p.isShiny ? ' ✨' : ''}${isBuddy ? ' 🤝' : ''}</span>
                    <span style="background:${typeColor};color:#fff;font-size:0.65em;padding:2px 7px;border-radius:10px;">${mainType.toUpperCase()}</span>
                </div>
                <div class="pokemon-card-image">${this.getPokemonSprite(p, 110)}</div>
                <div style="font-size:0.78em;color:#ffd700;margin-bottom:4px;">Lv.${p.level}</div>
                <div class="pokemon-card-hp" style="color:${hpColor};">HP ${p.currentHP}/${p.maxHP}</div>
                <div class="pokemon-card-hp-bar"><div class="pokemon-card-hp-fill" style="width:${hpPercent}%;background:${hpColor};transition:width 0.3s;"></div></div>
                <div style="margin-top:5px;">
                    <div style="font-size:0.7em;color:#888;margin-bottom:2px;">XP</div>
                    <div style="background:rgba(0,0,0,0.4);border-radius:4px;height:5px;overflow:hidden;">
                        <div style="background:#7038F8;height:100%;width:${xpPercent}%;border-radius:4px;transition:width 0.3s;"></div>
                    </div>
                </div>
                <div class="pokemon-card-stats" style="margin-top:8px;">
                    <div class="pokemon-card-stat"><span class="pokemon-card-stat-label">⚔️ ATK</span><span class="pokemon-card-stat-value">${p.attack}</span></div>
                    <div class="pokemon-card-stat"><span class="pokemon-card-stat-label">❤️ MAX</span><span class="pokemon-card-stat-value">${p.maxHP}</span></div>
                </div>
            </div>`;
        });

        html += '</div>';
        document.getElementById('gameScreen').innerHTML = html;
    },

    showPokemonDetails: function(index) {
        const p = player.pokemon[index];
        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };
        const mainType = p.types[0];
        const typeColor = typeColors[mainType] || '#888';
        const hpPercent = Math.max(0, (p.currentHP / p.maxHP) * 100);
        const xpPercent = Math.min(100, ((p.xp || 0) / (p.level * 50)) * 100);
        let hpColor = hpPercent > 50 ? '#4caf50' : hpPercent > 20 ? '#ffd700' : '#ff4444';
        const isBuddy = game.buddy.currentBuddy && game.buddy.currentBuddy.name === p.name;

        let html = `
        <!-- Back button row -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <button onclick="ui.showPokemon()" style="padding:6px 16px;font-size:0.85em;">← Back</button>
            <span style="color:#ffd700;font-weight:bold;">Pokémon Details</span>
        </div>

        <!-- Main info card -->
        <div style="background:linear-gradient(145deg,rgba(20,20,50,0.95),${typeColor}33);border:2px solid ${typeColor};border-radius:18px;padding:20px;margin-bottom:14px;display:flex;gap:18px;align-items:flex-start;">
            <div style="text-align:center;min-width:80px;">
                <div style="margin-bottom:6px;">${this.getPokemonSprite(p, 120)}</div>
                ${p.isShiny ? '<div style="color:#ffd700;font-size:0.85em;">✨ SHINY</div>' : ''}
                ${isBuddy ? '<div style="color:#88ff88;font-size:0.8em;margin-top:4px;">🤝 Buddy</div>' : ''}
            </div>
            <div style="flex:1;">
                <div style="font-size:1.5em;font-weight:bold;color:#fff;margin-bottom:6px;">${p.name}</div>
                <div style="display:flex;gap:6px;margin-bottom:10px;">
                    ${p.types.map(t=>`<span style="background:${typeColors[t]||'#888'};color:#fff;font-size:0.72em;padding:3px 10px;border-radius:12px;font-weight:bold;">${t.toUpperCase()}</span>`).join('')}
                    <span style="background:rgba(255,255,255,0.1);color:#ccc;font-size:0.72em;padding:3px 10px;border-radius:12px;">${p.rarity}</span>
                </div>

                <!-- Stats grid -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                    <div style="background:rgba(0,0,0,0.3);border-radius:10px;padding:8px;text-align:center;">
                        <div style="color:#888;font-size:0.72em;">LEVEL</div>
                        <div style="color:#ffd700;font-size:1.3em;font-weight:bold;">${p.level}</div>
                    </div>
                    <div style="background:rgba(0,0,0,0.3);border-radius:10px;padding:8px;text-align:center;">
                        <div style="color:#888;font-size:0.72em;">ATTACK</div>
                        <div style="color:#ff8888;font-size:1.3em;font-weight:bold;">${p.attack}</div>
                    </div>
                </div>

                <!-- HP bar -->
                <div style="margin-bottom:8px;">
                    <div style="display:flex;justify-content:space-between;font-size:0.8em;margin-bottom:3px;">
                        <span style="color:#888;">HP</span>
                        <span style="color:${hpColor};">${p.currentHP} / ${p.maxHP}</span>
                    </div>
                    <div style="background:rgba(0,0,0,0.5);border-radius:6px;height:10px;overflow:hidden;">
                        <div style="background:${hpColor};height:100%;width:${hpPercent}%;border-radius:6px;transition:width 0.3s;"></div>
                    </div>
                </div>

                <!-- XP bar -->
                <div>
                    <div style="display:flex;justify-content:space-between;font-size:0.8em;margin-bottom:3px;">
                        <span style="color:#888;">XP to next level</span>
                        <span style="color:#9988ff;">${p.xp || 0} / ${p.level * 50}</span>
                    </div>
                    <div style="background:rgba(0,0,0,0.5);border-radius:6px;height:8px;overflow:hidden;">
                        <div style="background:#7038F8;height:100%;width:${xpPercent}%;border-radius:6px;transition:width 0.3s;"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Moves -->
        <div style="margin-bottom:14px;">
            <div style="color:#ffd700;font-weight:bold;margin-bottom:8px;">⚔️ Moves</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">`;

        if (p.moves && p.moves.length > 0) {
            p.moves.forEach(move => {
                if (!move) return;
                const mc = typeColors[move.type] || '#888';
                html += `<div style="background:linear-gradient(135deg,${mc}22,${mc}33);border:1px solid ${mc};border-radius:12px;padding:10px;">
                    <div style="font-weight:bold;color:#fff;margin-bottom:4px;">${move.name}</div>
                    <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        <span style="background:${mc};color:#fff;font-size:0.68em;padding:2px 7px;border-radius:8px;">${move.type.toUpperCase()}</span>
                        <span style="background:rgba(0,0,0,0.4);color:#ccc;font-size:0.68em;padding:2px 7px;border-radius:8px;">PWR ${move.power}</span>
                        <span style="background:rgba(0,0,0,0.4);color:#ccc;font-size:0.68em;padding:2px 7px;border-radius:8px;">ACC ${move.accuracy || 100}%</span>
                    </div>
                </div>`;
            });
        } else {
            html += `<div style="color:#aaa;grid-column:1/-1;">No moves learned yet</div>`;
        }

        html += `</div></div>

        <!-- Action buttons -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button onclick="ui.healPokemon(${index})" ${player.inventory.potion <= 0 ? 'disabled' : ''}
                style="padding:12px;border-radius:12px;font-size:0.9em;">
                💊 Heal (${player.inventory.potion} potions)
            </button>
            <button onclick="ui.selectBuddyFromDetails(${index})"
                style="padding:12px;border-radius:12px;font-size:0.9em;background:linear-gradient(135deg,#2196f3,#1565c0);">
                🤝 ${isBuddy ? 'Remove Buddy' : 'Make Buddy'}
            </button>
            <button onclick="ui.usePotionType('superpotion', ${index})" ${player.inventory.superpotion <= 0 ? 'disabled' : ''}
                style="padding:12px;border-radius:12px;font-size:0.9em;">
                💉 Super Potion (${player.inventory.superpotion})
            </button>
            <button onclick="ui.useRareCandy(${index})" ${player.inventory.rarecandy <= 0 ? 'disabled' : ''}
                style="padding:12px;border-radius:12px;font-size:0.9em;background:linear-gradient(135deg,#9c27b0,#6a0080);">
                🍬 Rare Candy (${player.inventory.rarecandy})
            </button>
            <button onclick="ui.showTMSelect(${index})" ${(!player.tms || player.tms.length === 0) ? 'disabled' : ''}
                style="padding:12px;border-radius:12px;font-size:0.9em;background:linear-gradient(135deg,#00897b,#004d40);">
                📀 Use TM (${(player.tms||[]).length} owned)
            </button>
            <button onclick="ui.removePokemon(${index})"
                style="padding:12px;border-radius:12px;font-size:0.9em;background:linear-gradient(135deg,#f44336,#b71c1c);">
                ❌ Release
            </button>
        </div>`;

        document.getElementById('gameScreen').innerHTML = html;
    },

    usePotionType: function(type, index) {
        const heals = { potion: 20, superpotion: 50, hyperpotion: 100 };
        if (!player.inventory[type] || player.inventory[type] <= 0) {
            this.showNotification(`No ${type} left!`, false);
            return;
        }
        player.inventory[type]--;
        const p = player.pokemon[index];
        p.currentHP = Math.min(p.maxHP, p.currentHP + heals[type]);
        this.showNotification(`Healed ${heals[type]} HP!`, true);
        this.updateStats();
        this.updateInventory();
        this.showPokemonDetails(index);
    },

    useRareCandy: function(index) {
        if (!player.inventory.rarecandy || player.inventory.rarecandy <= 0) {
            this.showNotification('No Rare Candy!', false);
            return;
        }
        const p = player.pokemon[index];
        if (p.level >= 100) {
            this.showNotification(`${p.name} is already at max level!`, false);
            return;
        }
        player.inventory.rarecandy--;
        p.xp = p.level * 50;
        game.checkPokemonLevelUp(p);
        this.showNotification(`${p.name} levelled up!`, true);
        this.updateStats();
        this.updateInventory();
        this.showPokemonDetails(index);
    },

    showTMSelect: function(pokemonIndex) {
        const p = player.pokemon[pokemonIndex];
        const tms = player.tms || [];
        if (tms.length === 0) {
            this.showNotification('No TMs owned!', false);
            return;
        }

        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };

        let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h2 style="margin:0;">📀 Teach a TM</h2>
            <button onclick="ui.showPokemonDetails(${pokemonIndex})" style="padding:6px 16px;font-size:0.85em;">← Back</button>
        </div>
        <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:12px;margin-bottom:14px;display:flex;gap:12px;align-items:center;">
            <div>${this.getPokemonSprite(p, 72)}</div>
            <div>
                <div style="font-weight:bold;color:#fff;">${p.name}</div>
                <div style="color:#aaa;font-size:0.85em;">Current moves: ${(p.moves||[]).filter(Boolean).map(m=>m.name).join(', ') || 'None'}</div>
                <div style="color:#aaa;font-size:0.8em;margin-top:2px;">${p.moves && p.moves.length >= 4 ? '⚠️ Has 4 moves — you must replace one' : `Has ${(p.moves||[]).length}/4 moves`}</div>
            </div>
        </div>
        <div style="color:#ffd700;font-size:0.9em;margin-bottom:10px;">Choose a TM to teach:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">`;

        tms.forEach((tm, tmIndex) => {
            const alreadyKnows = (p.moves || []).some(m => m && m.name === tm.name);
            const tc = typeColors[tm.type] || '#888';
            html += `
            <div style="background:linear-gradient(145deg,${tc}22,${tc}33);border:2px solid ${alreadyKnows ? '#555' : tc};border-radius:12px;padding:12px;opacity:${alreadyKnows ? '0.5' : '1'};">
                <div style="font-weight:bold;color:#fff;margin-bottom:4px;">${tm.name}</div>
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">
                    <span style="background:${tc};color:#fff;font-size:0.68em;padding:2px 7px;border-radius:8px;">${tm.type.toUpperCase()}</span>
                    <span style="background:rgba(0,0,0,0.4);color:#ccc;font-size:0.68em;padding:2px 7px;border-radius:8px;">PWR ${tm.power}</span>
                    <span style="background:rgba(0,0,0,0.4);color:#ccc;font-size:0.68em;padding:2px 7px;border-radius:8px;">ACC ${tm.accuracy||100}%</span>
                </div>
                ${alreadyKnows
                    ? '<div style="color:#888;font-size:0.8em;text-align:center;">Already known</div>'
                    : `<button onclick="ui.teachTM(${pokemonIndex}, ${tmIndex})"
                        style="width:100%;padding:8px;background:linear-gradient(135deg,${tc},${tc}cc);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:bold;font-size:0.85em;">
                        ✅ Teach
                       </button>`
                }
            </div>`;
        });

        html += '</div>';
        document.getElementById('gameScreen').innerHTML = html;
    },

    teachTM: function(pokemonIndex, tmIndex) {
        const p = player.pokemon[pokemonIndex];
        const tm = (player.tms || [])[tmIndex];
        if (!tm) return;

        // If already knows move
        if ((p.moves || []).some(m => m && m.name === tm.name)) {
            this.showNotification(`${p.name} already knows ${tm.name}!`, false);
            return;
        }

        // If room in moveset (fewer than 4)
        if (!p.moves) p.moves = [];
        if (p.moves.length < 4) {
            p.moves.push(tm);
            this.showNotification(`${p.name} learned ${tm.name}!`, true);
            this.showPokemonDetails(pokemonIndex);
            return;
        }

        // Party full — show move replacement screen
        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };
        const tc = typeColors[tm.type] || '#888';

        let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h2 style="margin:0;">📀 Replace a Move</h2>
            <button onclick="ui.showTMSelect(${pokemonIndex})" style="padding:6px 16px;font-size:0.85em;">← Back</button>
        </div>
        <div style="background:linear-gradient(145deg,${tc}22,${tc}33);border:2px solid ${tc};border-radius:12px;padding:12px;margin-bottom:14px;">
            <div style="color:#aaa;font-size:0.85em;margin-bottom:6px;">New move to learn:</div>
            <div style="font-weight:bold;color:#fff;font-size:1.1em;">${tm.name}</div>
            <div style="display:flex;gap:5px;margin-top:4px;">
                <span style="background:${tc};color:#fff;font-size:0.68em;padding:2px 7px;border-radius:8px;">${tm.type.toUpperCase()}</span>
                <span style="background:rgba(0,0,0,0.4);color:#ccc;font-size:0.68em;padding:2px 7px;border-radius:8px;">PWR ${tm.power}</span>
                <span style="background:rgba(0,0,0,0.4);color:#ccc;font-size:0.68em;padding:2px 7px;border-radius:8px;">ACC ${tm.accuracy||100}%</span>
            </div>
        </div>
        <div style="color:#ffd700;font-size:0.9em;margin-bottom:10px;">Choose a move to replace:</div>
        <div style="display:grid;gap:8px;">`;

        p.moves.forEach((move, moveIndex) => {
            if (!move) return;
            const mc = typeColors[move.type] || '#888';
            html += `
            <div style="background:linear-gradient(145deg,${mc}22,${mc}33);border:2px solid ${mc};border-radius:12px;padding:12px;display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-weight:bold;color:#fff;">${move.name}</div>
                    <div style="display:flex;gap:4px;margin-top:3px;">
                        <span style="background:${mc};color:#fff;font-size:0.65em;padding:1px 6px;border-radius:8px;">${move.type.toUpperCase()}</span>
                        <span style="background:rgba(0,0,0,0.4);color:#ccc;font-size:0.65em;padding:1px 6px;border-radius:8px;">PWR ${move.power}</span>
                    </div>
                </div>
                <button onclick="ui.confirmReplaceTM(${pokemonIndex}, ${tmIndex}, ${moveIndex})"
                    style="padding:8px 14px;background:linear-gradient(135deg,#f44336,#b71c1c);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:0.85em;font-weight:bold;">
                    Replace
                </button>
            </div>`;
        });

        html += `</div>
        <button onclick="ui.showPokemonDetails(${pokemonIndex})"
            style="width:100%;margin-top:12px;padding:11px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.2);border-radius:12px;color:#aaa;cursor:pointer;">
            ✗ Don't learn ${tm.name}
        </button>`;

        document.getElementById('gameScreen').innerHTML = html;
    },

    confirmReplaceTM: function(pokemonIndex, tmIndex, moveIndex) {
        const p = player.pokemon[pokemonIndex];
        const tm = (player.tms || [])[tmIndex];
        if (!tm || !p) return;

        const oldMove = p.moves[moveIndex];
        p.moves[moveIndex] = tm;
        this.showNotification(`${p.name} forgot ${oldMove ? oldMove.name : '?'} and learned ${tm.name}!`, true);
        this.showPokemonDetails(pokemonIndex);
    },

    removePokemon: function(index) {
        game.removePokemon(index);
    },

    selectBuddyFromDetails: function(index) {
        game.buddy.setBuddy(index);
        this.updateBuddyDisplay();
        this.showPokemonDetails(index);
    },

    healPokemon: function(index) {
        if (player.inventory.potion <= 0) {
            this.showNotification("No potions!", false);
            return;
        }
        player.inventory.potion--;
        player.pokemon[index].currentHP = Math.min(player.pokemon[index].maxHP, player.pokemon[index].currentHP + 20);
        this.showNotification(`Healed!`, true);
        this.updateStats();
        this.showPokemonDetails(index);
    },

    updateBuddyDisplay: function() {
        const container = document.getElementById('buddyContainer');
        if (game.buddy.currentBuddy) {
            container.style.display = 'block';
            const buddy = game.buddy.currentBuddy;
            const level = game.buddy.getHappinessLevel();
            document.getElementById('buddyName').textContent = `${buddy.name} ${level.emoji}`;
            
            const nextLevel = happinessLevels.find(l => l.threshold > buddy.happiness) || happinessLevels[5];
            if (nextLevel.threshold > level.threshold) {
                const progress = ((buddy.happiness - level.threshold) / (nextLevel.threshold - level.threshold)) * 100;
                document.getElementById('buddyProgressBar').style.width = `${progress}%`;
                document.getElementById('buddyStats').textContent = `${buddy.happiness}/${nextLevel.threshold}`;
            } else {
                document.getElementById('buddyProgressBar').style.width = '100%';
                document.getElementById('buddyStats').textContent = `Max! ✨`;
            }
        } else {
            container.style.display = 'none';
        }
    },

    showBuddySelection: function() {
        if (player.pokemon.length === 0) {
            this.showNotification("No Pokémon!", false);
            return;
        }
        
        const modal = document.getElementById('moveLearnModal');
        let html = '<h2>Choose Buddy</h2><div class="buddy-selection-grid">';
        
        player.pokemon.forEach((p, index) => {
            const isSelected = game.buddy.currentBuddy && game.buddy.currentBuddy.name === p.name;
            html += `<div class="buddy-option ${isSelected ? 'selected' : ''}" onclick="ui.selectBuddy(${index})">`;
            html += `<div class="buddy-option-name">${p.name}</div>`;
            html += `<div class="buddy-option-level">Lv.${p.level}</div>`;
            html += `<div class="buddy-option-hp">❤️ ${p.currentHP}/${p.maxHP}</div>`;
            html += `</div>`;
        });
        
        html += '</div><button onclick="ui.closeMoveLearnModal()">Cancel</button>';
        document.getElementById('moveLearnContent').innerHTML = html;
        modal.style.display = 'block';
    },

    selectBuddy: function(index) {
        game.buddy.setBuddy(index);
        this.closeMoveLearnModal();
    },

    closeMoveLearnModal: function() {
        document.getElementById('moveLearnModal').style.display = 'none';
    },

    // SHOP FUNCTIONS - FIXED WITH TMs
    openShop: function() {
        document.getElementById('shopModal').style.display = 'block';
        this.updateShopItems();
    },

    closeShop: function() {
        document.getElementById('shopModal').style.display = 'none';
    },

    switchShopTab: function(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('shopItems').style.display = tab === 'items' ? 'block' : 'none';
        document.getElementById('shopTMs').style.display  = tab === 'tms'   ? 'block' : 'none';
    },

    updateShopItems: function() {
        const inv = player.inventory;
        const ballBase = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

        const items = [
            { key:'pokeball',    img:`${ballBase}/poke-ball.png`,    name:'Poké Ball',    desc:'Basic catch chance (30%)',      price:200,  qty:5,  stock: inv.pokeball },
            { key:'greatball',   img:`${ballBase}/great-ball.png`,   name:'Great Ball',   desc:'Better catch chance (50%)',     price:500,  qty:3,  stock: inv.greatball },
            { key:'ultraball',   img:`${ballBase}/ultra-ball.png`,   name:'Ultra Ball',   desc:'Great catch chance (70%)',      price:1000, qty:2,  stock: inv.ultraball },
            { key:'masterball',  img:`${ballBase}/master-ball.png`,  name:'Master Ball',  desc:'Guaranteed catch (100%)',       price:5000, qty:1,  stock: inv.masterball },
            { key:'potion',      img:`${ballBase}/potion.png`,       name:'Potion',       desc:'Restore 20 HP',                 price:150,  qty:3,  stock: inv.potion },
            { key:'superpotion', img:`${ballBase}/super-potion.png`, name:'Super Potion', desc:'Restore 50 HP',                 price:400,  qty:2,  stock: inv.superpotion },
            { key:'hyperpotion', img:`${ballBase}/hyper-potion.png`, name:'Hyper Potion', desc:'Restore 100 HP',                price:800,  qty:1,  stock: inv.hyperpotion },
            { key:'rarecandy',   img:`${ballBase}/rare-candy.png`,   name:'Rare Candy',   desc:'Instantly level up a Pokémon',  price:1000, qty:1,  stock: inv.rarecandy },
        ];

        let html = `<div style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);border-radius:10px;padding:10px;margin-bottom:15px;text-align:center;">
            <span style="color:#ffd700;font-size:1.1em;">💰 Credits: <strong>${player.credits.toLocaleString()}</strong></span>
        </div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">`;

        items.forEach(item => {
            const canAfford = player.credits >= item.price;
            html += `<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,215,0,${canAfford ? '0.4' : '0.15'});border-radius:12px;padding:12px;opacity:${canAfford ? '1' : '0.6'};">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="${item.img}" style="width:36px;height:36px;object-fit:contain;image-rendering:pixelated;flex-shrink:0;" onerror="this.style.display='none'">
                    <div><div style="color:#fff;font-weight:bold;font-size:0.95em;">${item.name}</div>
                    <div style="color:#aaa;font-size:0.75em;">${item.desc}</div></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
                    <span style="color:#aaa;font-size:0.78em;">Bag: <strong style="color:#ffd700;">${item.stock}</strong></span>
                    <button onclick="ui.buyItem('${item.key}')" ${canAfford ? '' : 'disabled'}
                        style="background:${canAfford ? 'linear-gradient(135deg,#ffd700,#ffaa00)' : 'rgba(100,100,100,0.3)'};color:${canAfford ? '#333' : '#666'};border:none;border-radius:8px;padding:5px 10px;cursor:${canAfford ? 'pointer' : 'not-allowed'};font-weight:bold;font-size:0.82em;">
                        💰${item.price}×${item.qty}</button>
                </div></div>`;
        });

        html += '</div>';
        document.getElementById('shopItems').innerHTML = html;

        // TMs
        let tmHtml = `<div style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);border-radius:10px;padding:10px;margin-bottom:15px;text-align:center;">
            <span style="color:#ffd700;font-size:1.1em;">💰 Your Credits: <strong>${player.credits.toLocaleString()}</strong></span>
        </div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">`;

        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };

        const tmMoves = Object.values(moveDatabase).filter(m => m.tm);
        tmMoves.forEach(move => {
            const owned = (player.tms || []).some(t => t.name === move.name);
            const canAfford = player.credits >= move.tmPrice && !owned;
            const typeColor = typeColors[move.type] || '#888';
            tmHtml += `
            <div style="background:linear-gradient(135deg,${typeColor}22,${typeColor}33);border:1px solid ${typeColor}66;border-radius:12px;padding:12px;opacity:${owned ? '0.6' : '1'};">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                    <span style="font-size:1.4em;">📀</span>
                    <div>
                        <div style="color:#fff;font-weight:bold;font-size:0.9em;">${move.name}</div>
                        <span style="background:${typeColor};color:#fff;font-size:0.68em;padding:1px 6px;border-radius:8px;">${move.type.toUpperCase()}</span>
                        <span style="color:#aaa;font-size:0.75em;margin-left:4px;">Pwr: ${move.power}</span>
                    </div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    ${owned ? '<span style="color:#4caf50;font-size:0.8em;">✅ Owned</span>' : '<span></span>'}
                    <button onclick="ui.buyTM('${move.name}')" ${canAfford ? '' : 'disabled'}
                        style="background:${canAfford ? `linear-gradient(135deg,${typeColor},${typeColor}cc)` : 'rgba(100,100,100,0.3)'};color:${canAfford ? '#fff' : '#666'};border:none;border-radius:8px;padding:5px 10px;cursor:${canAfford ? 'pointer' : 'not-allowed'};font-weight:bold;font-size:0.82em;">
                        💰${move.tmPrice}
                    </button>
                </div>
            </div>`;
        });

        tmHtml += '</div>';
        document.getElementById('shopTMs').innerHTML = tmHtml;
    },

    buyItem: function(item) {
        const prices = { pokeball:200, greatball:500, ultraball:1000, masterball:5000, potion:150, superpotion:400, hyperpotion:800, rarecandy:1000 };
        const qty    = { pokeball:5,   greatball:3,   ultraball:2,    masterball:1,    potion:3,   superpotion:2,   hyperpotion:1,   rarecandy:1 };

        if (player.credits >= prices[item]) {
            player.credits -= prices[item];
            player.inventory[item] += qty[item];
            this.updateStats();
            this.updateInventory();
            this.updateShopItems(); // refresh shop in-place (credits + stock)
            this.showNotification(`Bought ${qty[item]}× ${item.replace('ball',' Ball').replace('potion',' Potion')}!`, true);
        } else {
            this.showNotification('Not enough credits!', false);
        }
    },

    buyTM: function(moveName) {
        const move = Object.values(moveDatabase).find(m => m.name === moveName);
        if (!move || !move.tm) return;

        if (player.credits >= move.tmPrice) {
            player.credits -= move.tmPrice;
            if (!player.tms) player.tms = [];
            player.tms.push(move);
            this.updateStats();
            this.updateInventory();
            this.updateShopItems();
            this.showNotification(`Bought TM: ${move.name}!`, true);
        } else {
            this.showNotification('Not enough credits!', false);
        }
    },

    showInventory: function() {
        const panel = document.getElementById('inventoryPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if (panel.style.display === 'block') this.updateInventory();
    },

    updateInventory: function() {
        const panel = document.getElementById('inventoryPanel');
        if (!panel || panel.style.display === 'none') return;

        const inv = player.inventory;
        const ballBase = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';
        const items = [
            { img:`${ballBase}/poke-ball.png`,   name:'Poké Ball',    key:'pokeball' },
            { img:`${ballBase}/great-ball.png`,  name:'Great Ball',   key:'greatball' },
            { img:`${ballBase}/ultra-ball.png`,  name:'Ultra Ball',   key:'ultraball' },
            { img:`${ballBase}/master-ball.png`, name:'Master Ball',  key:'masterball' },
            { img:`${ballBase}/potion.png`,      name:'Potion',       key:'potion' },
            { img:`${ballBase}/super-potion.png`,name:'Super Potion', key:'superpotion' },
            { img:`${ballBase}/hyper-potion.png`,name:'Hyper Potion', key:'hyperpotion' },
            { img:null, icon:'🍬',               name:'Rare Candy',   key:'rarecandy' },
        ];

        let html = '';
        items.forEach(it => {
            const count = inv[it.key] || 0;
            const icon = it.img
                ? `<img src="${it.img}" style="width:32px;height:32px;object-fit:contain;image-rendering:pixelated;" onerror="this.outerHTML='<span style=\"font-size:1.4em;\">${it.icon||'📦'}</span>'">`
                : `<span style="font-size:1.6em;">${it.icon}</span>`;
            html += `<div class="inventory-item" style="opacity:${count > 0 ? '1' : '0.4'}">
                <span class="inv-icon">${icon}</span>
                <span class="inv-name">${it.name}</span>
                <span class="inv-count">×${count}</span>
            </div>`;
        });

        // Show owned TMs too
        if (player.tms && player.tms.length > 0) {
            player.tms.forEach(tm => {
                html += `<div class="inventory-item">
                    <span class="inv-icon">📀</span>
                    <span class="inv-name">${tm.name}</span>
                    <span class="inv-count" style="color:#88aaff;font-size:0.75em;">${tm.type}</span>
                </div>`;
            });
        }

        document.getElementById('inventoryGrid').innerHTML = html;
    },

    openPokedex: function() {
        const modal = document.getElementById('pokedexModal');
        document.querySelector('#pokedexModal h2').textContent = '📖 Pokédex';
        const caught = Object.keys(player.pokedex).length;
        const total = pokemonDatabase.length;
        const pct = Math.round((caught/total)*100);

        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };

        let html = `
        <div style="margin-bottom:15px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="color:#ffd700;font-size:1.1em;">📖 ${caught}/${total} Caught (${pct}%)</span>
                <div style="display:flex;gap:8px;">
                    <button onclick="ui.filterPokedex('all')" id="pdex-all" style="background:#ffd700;color:#333;border:none;padding:5px 12px;border-radius:15px;cursor:pointer;font-weight:bold;">All</button>
                    <button onclick="ui.filterPokedex('caught')" id="pdex-caught" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid #ffd700;padding:5px 12px;border-radius:15px;cursor:pointer;">Caught</button>
                    <button onclick="ui.filterPokedex('unseen')" id="pdex-unseen" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid #ffd700;padding:5px 12px;border-radius:15px;cursor:pointer;">Not Caught</button>
                </div>
            </div>
            <div style="background:rgba(255,215,0,0.15);border-radius:10px;height:10px;overflow:hidden;margin-bottom:12px;">
                <div style="background:#ffd700;height:100%;width:${pct}%;transition:width 0.5s;border-radius:10px;"></div>
            </div>
            <input id="pokedexSearch" type="text" placeholder="🔍 Search Pokémon..." 
                oninput="ui.renderPokedexEntries()" 
                style="width:100%;padding:10px;border:2px solid #ffd700;border-radius:10px;background:rgba(255,255,255,0.1);color:#fff;font-size:1em;box-sizing:border-box;">
        </div>
        <div id="pokedexGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;max-height:50vh;overflow-y:auto;padding-right:5px;"></div>`;

        document.getElementById('pokedexEntries').innerHTML = html;
        modal.style.display = 'block';
        this._pokedexFilter = 'all';
        this.renderPokedexEntries();
    },

    _pokedexFilter: 'all',

    filterPokedex: function(filter) {
        this._pokedexFilter = filter;
        ['all','caught','unseen'].forEach(f => {
            const btn = document.getElementById('pdex-'+f);
            if (btn) btn.style.background = f === filter ? '#ffd700' : 'rgba(255,255,255,0.1)';
            if (btn) btn.style.color = f === filter ? '#333' : '#fff';
        });
        this.renderPokedexEntries();
    },

    renderPokedexEntries: function() {
        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };
        const searchEl = document.getElementById('pokedexSearch');
        const query = searchEl ? searchEl.value.toLowerCase() : '';
        const filter = this._pokedexFilter || 'all';

        let list = pokemonDatabase.slice().sort((a,b) => a.id - b.id);

        if (query) list = list.filter(p => p.name.toLowerCase().includes(query) || String(p.id).includes(query));
        if (filter === 'caught') list = list.filter(p => player.pokedex[p.id]);
        if (filter === 'unseen') list = list.filter(p => !player.pokedex[p.id]);

        const grid = document.getElementById('pokedexGrid');
        if (!grid) return;

        if (list.length === 0) {
            grid.innerHTML = '<div style="color:#aaa;grid-column:1/-1;text-align:center;padding:20px;">No Pokémon found</div>';
            return;
        }

        grid.innerHTML = list.map(p => {
            const isCaught = player.pokedex[p.id];
            const mainType = p.types ? p.types[0] : 'normal';
            const typeColor = typeColors[mainType] || '#888';
            const caught = player.pokemon.find(cp => cp.name === p.name);
            const level = caught ? `Lv.${caught.level}` : '';
            const shiny = caught && caught.isShiny ? '✨' : '';

            if (!isCaught) {
                return `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px;text-align:center;opacity:0.5;">
                    <div style="font-size:2em;filter:grayscale(1);">❓</div>
                    <div style="color:#888;font-size:0.85em;">#${String(p.id).padStart(3,'0')}</div>
                    <div style="color:#555;font-size:0.85em;">???</div>
                </div>`;
            }

            return `<div style="background:linear-gradient(135deg,${typeColor}22,${typeColor}44);border:2px solid ${typeColor};border-radius:10px;padding:10px;text-align:center;cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                <div style="min-height:48px;display:flex;align-items:center;justify-content:center;">${this.getPokemonSprite({...p, isShiny: !!caught && caught.isShiny}, 48)}</div>
                <div style="color:#aaa;font-size:0.75em;">#${String(p.id).padStart(3,'0')}</div>
                <div style="color:#fff;font-size:0.85em;font-weight:bold;">${p.name}</div>
                <div style="margin-top:4px;">${p.types.map(t => `<span style="background:${typeColors[t]||'#888'};color:#fff;font-size:0.65em;padding:2px 5px;border-radius:8px;margin:1px;display:inline-block;">${t}</span>`).join('')}</div>
                ${level ? `<div style="color:#ffd700;font-size:0.75em;margin-top:3px;">${level}</div>` : ''}
            </div>`;
        }).join('');
    },

    closePokedex: function() {
        document.getElementById('pokedexModal').style.display = 'none';
    },

    showPokemonSelectionForGym: function(gym) {
        let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h2 style="margin:0;">🏆 Gym Challenge</h2>
            <button onclick="game.explore()" style="padding:6px 16px;font-size:0.85em;">Cancel</button>
        </div>
        <div style="background:rgba(255,215,0,0.1);border:2px solid #ffd700;border-radius:12px;padding:14px;margin-bottom:14px;text-align:center;">
            <div style="font-size:2em;">🏅</div>
            <div style="color:#ffd700;font-weight:bold;font-size:1.2em;">${gym.name}</div>
            <div style="color:#aaa;font-size:0.9em;margin-top:4px;">Reward: 💰${gym.reward} + ${gym.badge}</div>
        </div>
        <div style="color:#ddd;margin-bottom:10px;text-align:center;">Choose your Pokémon:</div>
        <div class="pokemon-collection">`;

        player.pokemon.forEach((p, index) => {
            html += this._renderSelectCard(p, index,
                'game.startGymBattleWithPokemon(gymLeaders[currentRegion], ' + index + ')',
                { disabled: p.currentHP <= 0 }
            );
        });

        html += '</div>';
        document.getElementById('gameScreen').innerHTML = html;
    },


    startGymBattle: function() {
        if (!gymChallenge) return;
        const gc = gymChallenge;
        const gymPoke = gc.pokemon[gc.currentPokemon];
        const playerPoke = gc.player;
        const gymPercent = Math.max(0, (gymPoke.currentHP / gymPoke.maxHP) * 100);
        const playerPercent = Math.max(0, (playerPoke.currentHP / playerPoke.maxHP) * 100);

        let gymHpColor = gymPercent <= 20 ? '#ff4444' : gymPercent <= 50 ? '#ffd700' : '#4caf50';
        let playerHpColor = playerPercent <= 20 ? '#ff4444' : playerPercent <= 50 ? '#ffd700' : '#4caf50';

        // Effectiveness banner from last log entry
        const lastMsg = gc.log[gc.log.length - 1] || '';
        let effectBanner = '';
        if (lastMsg.includes('Super effective')) effectBanner = '<div class="effectiveness-banner effective-super">🔥 Super Effective!</div>';
        else if (lastMsg.includes('Not very effective')) effectBanner = '<div class="effectiveness-banner effective-not">💧 Not Very Effective...</div>';
        else if (lastMsg.includes('Critical')) effectBanner = '<div class="effectiveness-banner effective-critical">⚡ Critical Hit!</div>';

        let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <h2 style="margin:0;font-size:1.2em;">🏆 GYM BATTLE</h2>
            <span style="color:#ffd700;font-size:0.85em;">vs. ${gc.leader} — ${gc.currentPokemon+1}/${gc.pokemon.length}</span>
        </div>
        <div class="battle-log">${gc.log.slice(-6).map(m => `<div class="log-entry">${m}</div>`).join('')}</div>
        ${effectBanner}

        <!-- Gym Pokemon -->
        <div class="pokemon-card epic" id="gymPokemonCard" style="margin-bottom:10px;">
            <div class="pokemon-card-header">
                <span class="pokemon-card-name">🏅 ${gymPoke.name}</span>
                <span style="background:rgba(255,215,0,0.2);color:#ffd700;font-size:0.75em;padding:2px 8px;border-radius:10px;font-weight:bold;">Lv.${gymPoke.level}</span>
            </div>
            <div class="pokemon-card-image">${this.getPokemonSprite(gymPoke, 110)}</div>
            <div class="pokemon-card-hp" style="color:${gymHpColor};">HP: ${gymPoke.currentHP}/${gymPoke.maxHP} (${Math.round(gymPercent)}%)</div>
            <div class="pokemon-card-hp-bar"><div class="pokemon-card-hp-fill" style="width:${gymPercent}%;background:${gymHpColor};transition:width 0.4s;"></div></div>
        </div>

        <!-- Action buttons -->
        <div class="battle-actions">
            <button onclick="ui.showGymMoveSelection()" style="background:linear-gradient(135deg,#e53935,#b71c1c);">⚔️ Move</button>
            <button onclick="game.gymFlee()" style="background:rgba(100,100,100,0.4);">🏃 Flee</button>
        </div>

        <!-- Player Pokemon -->
        <div class="pokemon-card ${playerPoke.rarity}" id="playerGymCard" style="margin-top:10px;">
            <div class="pokemon-card-header">
                <span class="pokemon-card-name">${playerPoke.name}${playerPoke.isShiny?' ✨':''}</span>
                <span style="background:rgba(104,144,240,0.25);color:#88aaff;font-size:0.75em;padding:2px 8px;border-radius:10px;font-weight:bold;">Lv.${playerPoke.level}</span>
            </div>
            <div class="pokemon-card-image">${this.getPokemonSprite(playerPoke, 110)}</div>
            <div class="pokemon-card-hp" style="color:${playerHpColor};">HP: ${playerPoke.currentHP}/${playerPoke.maxHP}</div>
            <div class="pokemon-card-hp-bar"><div class="pokemon-card-hp-fill" style="width:${playerPercent}%;background:${playerHpColor};transition:width 0.4s;"></div></div>
        </div>`;

        document.getElementById('gameScreen').innerHTML = html;

        // Shake gym pokemon card if last move was an attack
        if (lastMsg.includes('used')) {
            setTimeout(() => {
                const card = document.getElementById('gymPokemonCard');
                if (card) battleFX.shakeElement(card);
            }, 50);
        }
    },

    showGymMoveSelection: function() {
        if (!gymChallenge) return;
        const gc = gymChallenge;
        const playerPoke = gc.player;
        const gymPoke = gc.pokemon[gc.currentPokemon];
        const moves = playerPoke.moves || [];

        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };

        const getEff = (move) => {
            let eff = 1.0;
            (gymPoke.types || ['normal']).forEach(defType => {
                if (typeEffectiveness[move.type] && typeEffectiveness[move.type][defType] !== undefined)
                    eff *= typeEffectiveness[move.type][defType];
            });
            if (eff === 0)  return { label:'✗ No Effect',         color:'#888',    bg:'rgba(100,100,100,0.2)', border:'#555' };
            if (eff < 1)    return { label:'▼ Not Very Effective', color:'#88aaff', bg:'rgba(80,100,220,0.2)', border:'#8899ee' };
            if (eff === 1)  return { label:'— Normal Damage',      color:'#aaa',    bg:'rgba(150,150,150,0.1)', border:'#555' };
            if (eff < 2)    return { label:'▲ Effective!',         color:'#88ee88', bg:'rgba(60,180,60,0.2)',  border:'#66cc66' };
            return              { label:'⚡ Super Effective!!',   color:'#ffaa00', bg:'rgba(255,140,0,0.25)', border:'#ffaa00' };
        };

        const gymPercent = Math.max(0, (gymPoke.currentHP / gymPoke.maxHP) * 100);
        const hpColor = gymPercent <= 20 ? '#ff4444' : gymPercent <= 50 ? '#ffd700' : '#4caf50';

        let html = `
        <!-- Gym pokemon mini-card -->
        <div style="display:flex;align-items:center;gap:12px;background:rgba(0,0,0,0.4);border-radius:14px;padding:14px;margin-bottom:18px;border:1px solid rgba(255,215,0,0.25);">
            <div>${this.getPokemonSprite(gymPoke, 72)}</div>
            <div style="flex:1;">
                <div style="color:#ffd700;font-weight:bold;font-size:1.1em;">🏅 ${gymPoke.name}</div>
                <div style="display:flex;gap:5px;margin:3px 0;">
                    ${(gymPoke.types||['normal']).map(t=>`<span style="background:${typeColors[t]||'#888'};color:#fff;font-size:0.7em;padding:2px 8px;border-radius:10px;font-weight:bold;">${t.toUpperCase()}</span>`).join('')}
                </div>
                <div style="color:${hpColor};font-size:0.85em;">HP: ${gymPoke.currentHP}/${gymPoke.maxHP}</div>
                <div style="background:rgba(0,0,0,0.5);border-radius:6px;height:8px;margin-top:4px;overflow:hidden;">
                    <div style="background:${hpColor};height:100%;width:${gymPercent}%;border-radius:6px;"></div>
                </div>
            </div>
        </div>

        <div style="color:#ffd700;font-weight:bold;font-size:1em;margin-bottom:12px;text-align:center;">⚔️ ${playerPoke.name}'s Moves</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;">`;

        moves.forEach((move, index) => {
            if (!move) return;
            const eff = getEff(move);
            const tc = typeColors[move.type] || '#888';
            html += `
            <div onclick="game.gymAttackWithMove(${index})"
                style="background:linear-gradient(145deg,${tc}28,${tc}48);border:2px solid ${tc};border-radius:16px;padding:18px 14px;cursor:pointer;transition:all 0.18s;user-select:none;"
                onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 6px 24px ${tc}55'"
                onmouseout="this.style.transform='none';this.style.boxShadow='none'">
                <div style="font-weight:bold;font-size:1.15em;color:#fff;margin-bottom:8px;">${move.name}</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                    <span style="background:${tc};color:#fff;font-size:0.72em;padding:3px 9px;border-radius:12px;font-weight:bold;">${move.type.toUpperCase()}</span>
                    <span style="background:rgba(0,0,0,0.45);color:#eee;font-size:0.72em;padding:3px 9px;border-radius:12px;">PWR ${move.power}</span>
                    <span style="background:rgba(0,0,0,0.45);color:#eee;font-size:0.72em;padding:3px 9px;border-radius:12px;">ACC ${move.accuracy||100}%</span>
                </div>
                <div style="background:${eff.bg};border:1px solid ${eff.border};border-radius:10px;padding:6px 10px;text-align:center;">
                    <span style="color:${eff.color};font-size:0.88em;font-weight:bold;">${eff.label}</span>
                </div>
            </div>`;
        });

        if (moves.length === 0) html += `<div style="color:#aaa;text-align:center;grid-column:1/-1;padding:20px;">No moves available</div>`;

        html += `</div>
        <button onclick="ui.startGymBattle()" style="width:100%;padding:12px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);border-radius:12px;color:#ccc;cursor:pointer;font-size:1em;"
            onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">← Back to Battle</button>`;

        document.getElementById('gameScreen').innerHTML = html;
    },

    openMoveModal: function() {
        document.getElementById('moveModal').style.display = 'block';
    },

    closeMoveModal: function() {
        document.getElementById('moveModal').style.display = 'none';
    },

    showPC: function() {
        if (!player.pc) player.pc = [];
        const PC_MAX = Infinity;

        const typeColors = {
            fire:'#F08030',water:'#6890F0',grass:'#78C850',electric:'#F8D030',
            psychic:'#F85888',ice:'#98D8D8',dragon:'#7038F8',dark:'#705848',
            fighting:'#C03028',ground:'#E0C068',rock:'#B8A038',bug:'#A8B820',
            ghost:'#705898',steel:'#B8B8D0',fairy:'#EE99AC',poison:'#A040A0',
            flying:'#A890F0',normal:'#A8A878'
        };

        const renderPcCard = (p, index, fromPC) => {
            const tc = typeColors[p.types[0]] || '#888';
            const hpPct = Math.max(0, (p.currentHP / p.maxHP) * 100);
            const hpColor = hpPct > 50 ? '#4caf50' : hpPct > 20 ? '#ffd700' : '#ff4444';
            const action = fromPC
                ? `ui.withdrawPokemon(${index})`
                : `ui.depositPokemon(${index})`;
            const btnLabel = fromPC ? '← Withdraw' : 'Deposit →';
            const btnColor = fromPC ? '#2196f3' : '#ff9800';

            return `<div style="background:linear-gradient(145deg,rgba(20,20,50,0.97),${tc}22);border:2px solid ${tc};border-radius:14px;padding:12px;display:flex;gap:10px;align-items:center;">
                <div style="flex-shrink:0;">${this.getPokemonSprite(p, 64)}</div>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:bold;color:#fff;font-size:0.95em;">${p.name}${p.isShiny?' ✨':''}</div>
                    <div style="display:flex;gap:4px;margin:3px 0;">
                        ${p.types.map(t=>`<span style="background:${typeColors[t]||'#888'};color:#fff;font-size:0.6em;padding:1px 6px;border-radius:8px;">${t.toUpperCase()}</span>`).join('')}
                    </div>
                    <div style="font-size:0.78em;color:#ffd700;">Lv.${p.level}</div>
                    <div style="background:rgba(0,0,0,0.5);border-radius:4px;height:5px;margin-top:4px;overflow:hidden;">
                        <div style="background:${hpColor};height:100%;width:${hpPct}%;"></div>
                    </div>
                </div>
                <button onclick="${action}" style="padding:6px 10px;font-size:0.75em;background:${btnColor};border:none;border-radius:8px;color:#fff;cursor:pointer;white-space:nowrap;">${btnLabel}</button>
            </div>`;
        };

        let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <h2 style="margin:0;">🖥️ PC Box</h2>
            <button onclick="game.explore()" style="padding:6px 16px;font-size:0.85em;">← Back</button>
        </div>

        <!-- Party -->
        <div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.3);border-radius:14px;padding:14px;margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="color:#ffd700;font-weight:bold;">👜 Party (${player.pokemon.length}/6)</span>
                <span style="color:#aaa;font-size:0.8em;">Deposit to store here</span>
            </div>
            ${player.pokemon.length === 0
                ? '<div style="color:#555;text-align:center;padding:10px;">Party is empty</div>'
                : `<div style="display:grid;gap:8px;">${player.pokemon.map((p, i) => renderPcCard(p, i, false)).join('')}</div>`
            }
        </div>

        <!-- PC Storage -->
        <div style="background:rgba(33,150,243,0.06);border:1px solid rgba(33,150,243,0.3);border-radius:14px;padding:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="color:#64b5f6;font-weight:bold;">🖥️ PC Storage (${player.pc.length}/${PC_MAX})</span>
                <span style="color:#aaa;font-size:0.8em;">Withdraw to your party</span>
            </div>
            ${player.pc.length === 0
                ? '<div style="color:#555;text-align:center;padding:10px;">PC is empty — deposit Pokémon from your party</div>'
                : `<div style="display:grid;gap:8px;">${player.pc.map((p, i) => renderPcCard(p, i, true)).join('')}</div>`
            }
        </div>`;

        document.getElementById('gameScreen').innerHTML = html;
    },

    depositPokemon: function(index) {
        if (!player.pc) player.pc = [];
        if (player.pokemon.length <= 1) {
            this.showNotification("Can't deposit your last Pokémon!", false);
            return;
        }
        // No PC limit — unlimited storage
        const p = player.pokemon.splice(index, 1)[0];
        player.pc.push(p);
        this.showNotification(`${p.name} deposited to PC.`, true);
        this.showPC();
    },

    withdrawPokemon: function(index) {
        if (!player.pc) player.pc = [];
        if (player.pokemon.length >= 6) {
            this.showNotification('Party is full! (6/6)', false);
            return;
        }
        const p = player.pc.splice(index, 1)[0];
        player.pokemon.push(p);
        this.showNotification(`${p.name} added to party!`, true);
        this.showPC();
    },

    openManual: function() {
        const modal = document.getElementById('manualModal');
        document.getElementById('manualContent').innerHTML = `
        <div style="line-height:1.7;color:#ddd;">

            <div style="background:rgba(255,215,0,0.08);border-left:4px solid #ffd700;border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:16px;">
                <div style="color:#ffd700;font-weight:bold;font-size:1.05em;margin-bottom:4px;">🎮 Getting Started</div>
                <div>Click <strong style="color:#fff;">New Game</strong> on the main menu, then pick one of three starter Pokémon — Bulbasaur (Grass), Charmander (Fire), or Squirtle (Water). Your starter won't count towards your Pokédex — only Pokémon you catch in the wild do.</div>
            </div>

            <div style="background:rgba(78,205,196,0.08);border-left:4px solid #4ecdc4;border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:16px;">
                <div style="color:#4ecdc4;font-weight:bold;font-size:1.05em;margin-bottom:4px;">🌲 Exploring</div>
                <div>Press <strong style="color:#fff;">Explore</strong> to search the current region. You'll find wild Pokémon (70% chance) or items like Pokéballs and credits (30% chance). New regions unlock when your strongest Pokémon reaches the required level.</div>
            </div>

            <div style="background:rgba(240,80,48,0.08);border-left:4px solid #F08030;border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:16px;">
                <div style="color:#F08030;font-weight:bold;font-size:1.05em;margin-bottom:4px;">⚔️ Battles</div>
                <div>When a wild Pokémon appears, choose your fighter then pick <strong style="color:#fff;">Move</strong> to see your attacks. Each move card shows the <strong>type, power, accuracy</strong>, and how effective it is against the enemy's type. Lower the enemy's HP to increase your catch rate — below 10% HP gives 100% catch rate!</div>
                <div style="margin-top:6px;display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.85em;">
                    <div style="background:rgba(255,140,0,0.15);border:1px solid #ffaa00;border-radius:8px;padding:5px 8px;">⚡ Super Effective = ×2 damage</div>
                    <div style="background:rgba(80,100,220,0.15);border:1px solid #8899ee;border-radius:8px;padding:5px 8px;">▼ Not Very Effective = ×0.5</div>
                    <div style="background:rgba(100,100,100,0.15);border:1px solid #555;border-radius:8px;padding:5px 8px;">✗ No Effect = ×0 damage</div>
                    <div style="background:rgba(60,180,60,0.15);border:1px solid #66cc66;border-radius:8px;padding:5px 8px;">▲ Effective = ×1.5 damage</div>
                </div>
            </div>

            <div style="background:rgba(104,144,240,0.08);border-left:4px solid #6890F0;border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:16px;">
                <div style="color:#6890F0;font-weight:bold;font-size:1.05em;margin-bottom:4px;">🎣 Catching Pokémon</div>
                <div>Use a Poké Ball during battle. Higher-tier balls have better catch rates:</div>
                <div style="margin-top:6px;display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:0.85em;">
                    <div>🟤 Poké Ball — 30%</div><div>🔵 Great Ball — 50%</div>
                    <div>🟡 Ultra Ball — 70%</div><div>💜 Master Ball — 100%</div>
                </div>
            </div>

            <div style="background:rgba(112,56,248,0.08);border-left:4px solid #7038F8;border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:16px;">
                <div style="color:#aa88ff;font-weight:bold;font-size:1.05em;margin-bottom:4px;">📈 Levelling & Evolution</div>
                <div>Pokémon gain XP from battles and catches. When they level up, their HP and Attack increase. At certain levels they evolve into stronger forms — keep an eye on the notifications! Use a <strong style="color:#fff;">🍬 Rare Candy</strong> from the shop to instantly level up any Pokémon.</div>
            </div>

            <div style="background:rgba(255,215,0,0.08);border-left:4px solid #ffd700;border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:16px;">
                <div style="color:#ffd700;font-weight:bold;font-size:1.05em;margin-bottom:4px;">🏆 Gym Battles</div>
                <div>Each region (except Kanto Forest and Safari Zone) has a Gym Leader. Challenge them with the <strong style="color:#fff;">Gym</strong> button once you reach that region. Gyms use type-specialist teams — bring Pokémon with super-effective moves! Beating a Gym earns a <strong>Badge</strong> and credits.</div>
            </div>

            <div style="background:rgba(136,255,136,0.08);border-left:4px solid #4caf50;border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:16px;">
                <div style="color:#4caf50;font-weight:bold;font-size:1.05em;margin-bottom:4px;">🤝 Buddy System</div>
                <div>Set a buddy Pokémon from your party details screen. As you explore, your buddy gains happiness. Higher happiness unlocks special bonuses and rewards!</div>
            </div>

            <div style="background:rgba(33,150,243,0.08);border-left:4px solid #2196f3;border-radius:0 10px 10px 0;padding:12px 16px;margin-bottom:16px;">
                <div style="color:#64b5f6;font-weight:bold;font-size:1.05em;margin-bottom:4px;">🖥️ PC Box</div>
                <div>Your party holds up to <strong style="color:#fff;">6 Pokémon</strong>. Use the <strong style="color:#fff;">PC</strong> button to deposit extras into storage (up to 30). Withdraw them any time to swap your active team.</div>
            </div>

            <div style="background:rgba(255,80,80,0.08);border-left:4px solid #f44336;border-radius:0 10px 10px 0;padding:12px 16px;">
                <div style="color:#ef5350;font-weight:bold;font-size:1.05em;margin-bottom:4px;">💾 Saving</div>
                <div>Click <strong style="color:#fff;">Save</strong> to download a save file to your device. Use <strong style="color:#fff;">Load</strong> to restore it. Your game also auto-saves to the browser every 60 seconds. <strong style="color:#ff8888;">Reset</strong> wipes all progress — use with caution!</div>
            </div>
        </div>`;
        modal.style.display = 'block';
    },

    closeManual: function() {
        document.getElementById('manualModal').style.display = 'none';
    },

    showMessage: function(msg) {
        document.getElementById('gameScreen').innerHTML = `<div style="text-align:center; padding:30px;"><h3>${msg}</h3><button onclick="game.explore()">Continue</button></div>`;
    },

    showAchievements: function() {
        const modal = document.getElementById('pokedexModal');
        document.querySelector('#pokedexModal h2').textContent = '🏆 Achievements';

        const unlocked = achievements.getUnlocked();
        const total = achievements.list.length;
        const pct = Math.round((unlocked.length / total) * 100);

        let html = `
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="color:#ffd700;font-size:1.05em;">🏆 ${unlocked.length} / ${total} Unlocked</span>
                <span style="color:#aaa;font-size:0.85em;">${pct}% complete</span>
            </div>
            <div style="background:rgba(255,215,0,0.15);border-radius:10px;height:10px;overflow:hidden;">
                <div style="background:#ffd700;height:100%;width:${pct}%;border-radius:10px;transition:width 0.5s;"></div>
            </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px;">`;

        achievements.list.forEach(ach => {
            const done = unlocked.includes(ach.id);
            html += `<div style="
                background:${done ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)'};
                border:2px solid ${done ? '#ffd700' : 'rgba(255,255,255,0.1)'};
                border-radius:12px;padding:12px;
                display:flex;gap:12px;align-items:flex-start;
                opacity:${done ? '1' : '0.5'};">
                <div style="font-size:2em;flex-shrink:0;${done ? '' : 'filter:grayscale(1);'}">${ach.icon}</div>
                <div style="flex:1;min-width:0;">
                    <div style="color:${done ? '#ffd700' : '#888'};font-weight:bold;font-size:0.9em;margin-bottom:2px;">${ach.name}</div>
                    <div style="color:#aaa;font-size:0.76em;line-height:1.4;">${ach.desc}</div>
                    ${done ? '<div style="color:#4caf50;font-size:0.75em;margin-top:4px;">✅ Unlocked</div>' : '<div style="color:#555;font-size:0.75em;margin-top:4px;">🔒 Locked</div>'}
                </div>
            </div>`;
        });

        html += '</div>';
        document.getElementById('pokedexEntries').innerHTML = html;
        modal.style.display = 'block';
    },
};