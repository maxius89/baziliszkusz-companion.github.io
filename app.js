class AdventureSheet {
    constructor() {
        this.AUTOSAVE_INTERVAL = 30000; // 30 seconds
        this.MAX_HISTORY_ITEMS = 10;
        this.STORAGE_KEY_DATA = 'kalandlap_data';
        this.STORAGE_KEY_HISTORY = 'kalandlap_dice_history';

        this.generateBattleCards();
        this.data = this.initializeData();
        this.loadFromStorage();
        this.populateForm();
        this.bindEvents();
        this.setupAutoSave();
    }

    initializeData() {
        return {
            test: 0,
            skill: 0,
            mind: 0,
            occasion: '',
            past: '',
            equipment: '',
            spells: '',
            notes: '',
            battles: Array(9).fill(null).map(() => ({
                test: 0,
                skill: 0,
                mind: 0
            }))
        };
    }

    generateBattleCards() {
    const battleGrid = document.querySelector('.battle-grid');
    if (!battleGrid) return;
    
    // Clear existing cards if any
    battleGrid.innerHTML = '';
    
    // Generate 9 battle cards
    for (let i = 0; i < 9; i++) {
        const card = document.createElement('div');
        card.className = 'battle-card';
        card.innerHTML = `
            <div class="form-group">
                <label>TEST:</label>
                <input type="number" min="0" max="99" value="0" aria-label="Ellenfél ${i + 1} Test">
            </div>
            <div class="form-group">
                <label>KECSES&#201;G:</label>
                <input type="number" min="0" max="99" value="0" aria-label="Ellenfél ${i + 1} Kecseség">
            </div>
            <div class="form-group">
                <label>ELME:</label>
                <input type="number" min="0" max="99" value="0" aria-label="Ellenfél ${i + 1} Elme">
            </div>
        `;
        battleGrid.appendChild(card);
    }
}

    bindEvents() {
        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.collectData();
            this.saveToStorage();
            this.showNotification('KALANDLAP MENTVE! ✓');
        });

        // Load button
        document.getElementById('loadBtn').addEventListener('click', () => {
            this.loadFromStorage();
            this.populateForm();
            this.showNotification('KALANDLAP BETÖLTVE! ✓');
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Biztosan újrakezded? Minden adat törlődik!')) {
                this.reset();
                this.showNotification('KALANDLAP VISSZAÁLLÍTVA! ✓');
            }
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        // File input for import
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // Dice roller button
        document.getElementById('diceBtn').addEventListener('click', () => {
            this.showDiceRoller();
        });
        
        // Help button
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelp();
        });

        // Auto-save on input change (including select elements)
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('change', () => {
                this.collectData();
                this.saveToStorage();
            });
            
            // Also save on blur for better UX
            input.addEventListener('blur', () => {
                this.collectData();
                this.saveToStorage();
            });
        });
    }
    
    showHelp() {
        // Remove existing help modal if present
        const existing = document.querySelector('.help-modal');
        if (existing) {
            existing.remove();
            return; // Toggle off
        }

        // Create help modal
        const modal = document.createElement('div');
        modal.className = 'help-modal';
        modal.innerHTML = `
            <div class="help-content">
                <button class="help-close" onclick="this.parentElement.parentElement.remove()">✕</button>
                <h2>SÚGÓ</h2>
                
                <h3>Billentyűparancsok</h3>
                <div class="help-shortcuts">
                    <div class="shortcut-item">
                        <span class="shortcut-key">Ctrl + S</span>
                        <span class="shortcut-desc">Kalandlap mentése</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-key">Ctrl + L</span>
                        <span class="shortcut-desc">Kalandlap betöltése</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-key">Ctrl + E</span>
                        <span class="shortcut-desc">Exportálás fájlba</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-key">Ctrl + I</span>
                        <span class="shortcut-desc">Importálás fájlból</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-key">Ctrl + D</span>
                        <span class="shortcut-desc">Kockadobó megnyitása</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-key">Ctrl + H</span>
                        <span class="shortcut-desc">Súgó megjelenítése</span>
                    </div>
                </div>
                
                <h3>Funkciók</h3>
                <ul class="help-features">
                    <li><strong>Automatikus mentés:</strong> Az adatok 30 másodpercenként automatikusan mentésre kerülnek</li>
                    <li><strong>Helyi tárolás:</strong> Az adatok a böngésző helyi tárhelyén kerülnek mentésre</li>
                    <li><strong>Export/Import:</strong> JSON fájlba mentheted és onnan visszatöltheted az adatokat</li>
                    <li><strong>Kockadobó:</strong> 1D6, 2D6 dobása és harc dobás 2D6 vs 2D6</li>
                    <li><strong>Ellenfél követés:</strong> 9 ellenfél statisztikáinak nyomon követése</li>
                </ul>
                
                <h3>Karakter Alkaszt</h3>
                <ul class="help-features">
                    <li><strong>Mágusvadász:</strong> Mágikus lények és varázslók ellen specializálódott harcos</li>
                    <li><strong>Szabotőr:</strong> Lopakodás és szabotázs mestere</li>
                    <li><strong>Véreb:</strong> Nyomkövetés és vadászat szakértője</li>
                </ul>
                
                <h3>Karakter Múlt</h3>
                <ul class="help-features">
                    <li><strong>Egy nagyhatalmú mágus testőre:</strong> Elit harcos háttér</li>
                    <li><strong>A Birodalom ellenségeinek ostora:</strong> Katonai veterán</li>
                    <li><strong>Magiko-technikus kísérletek túlélője:</strong> Mágikus kísérlet áldozata</li>
                </ul>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            this.collectData();
            this.saveToStorage();
            console.log('Auto-save triggered');
        }, this.AUTOSAVE_INTERVAL);
    }

    collectData() {
        // Collect player stats
        this.data.test = parseInt(document.getElementById('test').value) || 0;
        this.data.skill = parseInt(document.getElementById('skill').value) || 0;
        this.data.mind = parseInt(document.getElementById('mind').value) || 0;
        this.data.occasion = document.getElementById('occasion').value;
        this.data.past = document.getElementById('past').value;
        this.data.equipment = document.getElementById('equipment').value;
        this.data.spells = document.getElementById('spells').value;
        this.data.notes = document.getElementById('notes').value;

        // Collect battle data - each card has 3 inputs (test, skill, mind)
        document.querySelectorAll('.battle-card').forEach((card, index) => {
            const inputs = card.querySelectorAll('input[type="number"]');
            this.data.battles[index] = {
                test: parseInt(inputs[0].value) || 0,
                skill: parseInt(inputs[1].value) || 0,
                mind: parseInt(inputs[2].value) || 0
            };
        });
    }

    populateForm() {
        // Populate player stats
        document.getElementById('test').value = this.data.test;
        document.getElementById('skill').value = this.data.skill;
        document.getElementById('mind').value = this.data.mind;
        document.getElementById('occasion').value = this.data.occasion || '';
        document.getElementById('past').value = this.data.past || '';
        document.getElementById('equipment').value = this.data.equipment;
        document.getElementById('spells').value = this.data.spells;
        document.getElementById('notes').value = this.data.notes;

        // Populate battle data
        document.querySelectorAll('.battle-card').forEach((card, index) => {
            const inputs = card.querySelectorAll('input[type="number"]');
            inputs[0].value = this.data.battles[index].test;
            inputs[1].value = this.data.battles[index].skill;
            inputs[2].value = this.data.battles[index].mind;
        });
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY_DATA, JSON.stringify(this.data));
            console.log('Data saved to localStorage');
        } catch (e) {
            console.error('Failed to save data:', e);
            this.showNotification('MENTÉS SIKERTELEN! ✗');
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY_DATA);
            if (saved) {
                this.data = JSON.parse(saved);
                console.log('Data loaded from localStorage');
            }
        } catch (e) {
            console.error('Failed to load data:', e);
            this.showNotification('BETÖLTÉS SIKERTELEN! ✗');
        }
    }

    reset() {
        this.data = this.initializeData();
        this.populateForm();
        this.saveToStorage();
    }

    exportData() {
        this.collectData();
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        const dateStr = new Date().toISOString().split('T')[0];
        link.href = url;
        link.download = `kalandlap_${dateStr}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.showNotification('KALANDLAP EXPORTÁLVA! ✓');
    }

    importData(file) {
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate the imported data structure
                if (this.validateImportedData(importedData)) {
                    this.data = importedData;
                    this.populateForm();
                    this.saveToStorage();
                    this.showNotification('IMPORTÁLÁS SIKERES! ✓');
                } else {
                    this.showNotification('ÉRVÉNYTELEN FÁJL! ✗');
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showNotification('IMPORTÁLÁS SIKERTELEN! ✗');
            }
            
            // Reset file input
            document.getElementById('importFile').value = '';
        };
        
        reader.readAsText(file);
    }

    validateImportedData(data) {
        // Check if all required fields exist
        return (
            data.hasOwnProperty('test') &&
            data.hasOwnProperty('skill') &&
            data.hasOwnProperty('mind') &&
            data.hasOwnProperty('battles') &&
            Array.isArray(data.battles) &&
            data.battles.length === 9
        );
    }

    showDiceRoller() {
        // Check if already exists
        let sidebar = document.querySelector('.dice-roller-sidebar');
        
        if (sidebar) {
            // Toggle visibility
            sidebar.classList.toggle('open');
            return;
        }

        // Create dice roller sidebar
        sidebar = document.createElement('div');
        sidebar.className = 'dice-roller-sidebar';
        sidebar.innerHTML = `
            <div class="dice-roller-content">
                <button class="dice-close" onclick="document.querySelector('.dice-roller-sidebar').classList.remove('open')">✕</button>
                <h2>KOCKADOBÁS</h2>
                
                <div class="dice-section">
                    <h3>Egyszerű dobás</h3>
                    <div class="dice-result" id="diceResult">
                        <span class="result-number">?</span>
                    </div>
                    <div class="dice-buttons">
                        <button class="dice-btn" onclick="window.adventureSheet.rollAndShow(1)">
                            1D6
                        </button>
                        <button class="dice-btn" onclick="window.adventureSheet.rollAndShow(2)">
                            2D6
                        </button>
                    </div>
                </div>
                
                <div class="dice-section">
                    <h3>Harc dobás</h3>
                    <div class="battle-rolls">
                        <div class="battle-roll">
                            <h4>JÁTÉKOS</h4>
                            <div class="battle-result" id="attackerRoll">?</div>
                        </div>
                        <div class="battle-roll">
                            <h4>ELLENFÉL</h4>
                            <div class="battle-result" id="defenderRoll">?</div>
                        </div>
                    </div>
                    <div class="dice-buttons">
                        <button class="dice-btn" onclick="window.adventureSheet.rollBattle()">
                            HARC DOBÁS
                        </button>
                    </div>
                </div>
                
                <div class="dice-history" id="diceHistory">
                    <h3>TÖRTÉNET</h3>
                    <div class="history-items"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(sidebar);
        
        // Open it after a brief delay for animation
        setTimeout(() => {
            sidebar.classList.add('open');
        }, 10);
        
        // Load dice history
        this.loadDiceHistory();
    }

    rollAndShow(numDice) {
        const results = [];
        let total = 0;
        
                for (let i = 0; i < numDice; i++) {
            const roll = this.rollDice(6);
            results.push(roll);
            total += roll;
        }
        
        // Animate the result
        const resultElement = document.getElementById('diceResult');
        if (!resultElement) return;
        
        resultElement.classList.add('rolling');
        
        setTimeout(() => {
            resultElement.classList.remove('rolling');
            const resultNumber = resultElement.querySelector('.result-number');
            
            if (numDice === 1) {
                resultNumber.textContent = total;
            } else {
                resultNumber.innerHTML = `${total}<br><small>${results.join(' + ')}</small>`;
            }
            
            // Add to history
            this.addToHistory(numDice, results, total);
        }, 300);
    }

    rollBattle() {
        // Roll for attacker (player)
        const attackerRolls = [this.rollDice(6), this.rollDice(6)];
        const attackerTotal = attackerRolls[0] + attackerRolls[1];
        
        // Roll for defender (enemy)
        const defenderRolls = [this.rollDice(6), this.rollDice(6)];
        const defenderTotal = defenderRolls[0] + defenderRolls[1];
        
        // Animate results
        const attackerElement = document.getElementById('attackerRoll');
        const defenderElement = document.getElementById('defenderRoll');
        
        if (!attackerElement || !defenderElement) return;
        
        attackerElement.classList.add('rolling');
        defenderElement.classList.add('rolling');
        
        setTimeout(() => {
            attackerElement.classList.remove('rolling');
            defenderElement.classList.remove('rolling');
            
            attackerElement.innerHTML = `${attackerTotal}<br><small>${attackerRolls.join(' + ')}</small>`;
            defenderElement.innerHTML = `${defenderTotal}<br><small>${defenderRolls.join(' + ')}</small>`;
            
            // Add to history
            this.addToHistory('Harc', [...attackerRolls, ...defenderRolls], `${attackerTotal} vs ${defenderTotal}`);
        }, 300);
    }

    rollDice(sides = 6) {
        return Math.floor(Math.random() * sides) + 1;
    }

    addToHistory(numDice, results, total) {
        const history = this.getDiceHistory();
        const entry = {
            timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
            numDice: numDice,
            results: results,
            total: total
        };
        
        history.unshift(entry);
        
        // Keep only last 10 rolls
        if (history.length > this.MAX_HISTORY_ITEMS) {
            history.pop();
        }
        
        localStorage.setItem(this.STORAGE_KEY_HISTORY, JSON.stringify(history));
        this.displayDiceHistory(history);
    }

    getDiceHistory() {
        try {
            const history = localStorage.getItem(this.STORAGE_KEY_HISTORY);
            return history ? JSON.parse(history) : [];
        } catch (e) {
            return [];
        }
    }

    loadDiceHistory() {
        const history = this.getDiceHistory();
        this.displayDiceHistory(history);
    }

    displayDiceHistory(history) {
        const container = document.querySelector('.history-items');
        if (!container) return;
        
        if (history.length === 0) {
            container.innerHTML = '<div class="history-empty">Még nem dobtál kockát</div>';
            return;
        }
        
        container.innerHTML = history.map(entry => {
            if (entry.numDice === 'Harc') {
                return `
                    <div class="history-item">
                        <span class="history-time">${entry.timestamp}</span>
                        <span class="history-dice">Harc:</span>
                        <span class="history-total">${entry.total}</span>
                    </div>
                `;
            } else {
                return `
                    <div class="history-item">
                        <span class="history-time">${entry.timestamp}</span>
                        <span class="history-dice">${entry.numDice}D6:</span>
                        <span class="history-total">${entry.total}</span>
                        ${entry.numDice > 1 ? `<span class="history-details">(${entry.results.join(' + ')})</span>` : ''}
                    </div>
                `;
            }
        }).join('');
    }

    showNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after animation
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.adventureSheet = new AdventureSheet();
    console.log('Kalandlap Adventure Companion loaded!');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        document.getElementById('saveBtn').click();
    }
    
    // Ctrl+L to load
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('loadBtn').click();
    }
    
    // Ctrl+E to export
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        document.getElementById('exportBtn').click();
    }
    
    // Ctrl+I to import
    if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        document.getElementById('importBtn').click();
    }
    
    // Ctrl+D for dice roller
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        document.getElementById('diceBtn').click();
    }
    
    // Ctrl+H for help
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        document.getElementById('helpBtn').click();
    }
});

// Prevent accidental page close with unsaved changes
window.addEventListener('beforeunload', (e) => {
    // Always save before leaving
    if (window.adventureSheet) {
        window.adventureSheet.collectData();
        window.adventureSheet.saveToStorage();
    }
});