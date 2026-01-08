// Main application module
import { StorageManager } from './storage.js';
import { DiceRoller } from './dice.js';
import { CharacterGenerator } from './chargen.js';

class AdventureSheet {
    constructor() {
        // Initialize managers
        this.storageManager = new StorageManager('kalandlap_data');
        this.diceRoller = new DiceRoller(this);
        this.charGen = new CharacterGenerator(this);
        
        // Initialize data
        this.data = this.initializeData();
        
        // Setup
        this.generateBattleCards();
        const savedData = this.storageManager.load();
        if (savedData) {
            this.data = savedData;
        }
        this.populateForm();
        this.bindEvents();
        this.setupAutoSave();
        
        // Make globally accessible for onclick handlers
        window.adventureSheet = this;
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
        
        battleGrid.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const card = document.createElement('div');
            card.className = 'battle-card';
            card.innerHTML = `
                <div class="form-group">
                    <label>TEST:</label>
                    <input type="number" min="0" max="99" value="0" aria-label="Ellenfél ${i + 1} Test">
                </div>
                <div class="form-group">
                    <label>KECSESS&#201;G:</label>
                    <input type="number" min="0" max="99" value="0" aria-label="Ellenfél ${i + 1} Kecsesség">
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
            if (this.storageManager.save(this.data)) {
                this.showNotification('KALANDLAP MENTVE! ✓');
            } else {
                this.showNotification('MENTÉS SIKERTELEN! ✗');
            }
        });

        // Load button
        document.getElementById('loadBtn').addEventListener('click', () => {
            const loaded = this.storageManager.load();
            if (loaded) {
                this.data = loaded;
                this.populateForm();
                this.showNotification('KALANDLAP BETÖLTVE! ✓');
            } else {
                this.showNotification('BETÖLTÉS SIKERTELEN! ✗');
            }
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.collectData();
            const dateStr = new Date().toISOString().split('T')[0];
            this.storageManager.exportToFile(this.data, `kalandlap_${dateStr}.json`);
            this.showNotification('KALANDLAP EXPORTÁLVA! ✓');
        });

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        // File input for import
        document.getElementById('importFile').addEventListener('change', async (e) => {
            try {
                const file = e.target.files[0];
                const importedData = await this.storageManager.importFromFile(file);
                
                if (this.validateImportedData(importedData)) {
                    this.data = importedData;
                    this.populateForm();
                    this.storageManager.save(this.data);
                    this.showNotification('IMPORTÁLÁS SIKERES! ✓');
                } else {
                    this.showNotification('ÉRVÉNYTELEN FÁJL! ✗');
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showNotification('IMPORTÁLÁS SIKERTELEN! ✗');
            }
            
            document.getElementById('importFile').value = '';
        });

        // Character generator button
        document.getElementById('charGenBtn').addEventListener('click', () => {
            this.charGen.show();
        });

        // Dice roller button
        document.getElementById('diceBtn').addEventListener('click', () => {
            this.diceRoller.show();
        });

        // Help button
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelp();
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Biztosan újrakezded? Minden adat törlődik!')) {
                this.reset();
                this.showNotification('KALANDLAP VISSZAÁLLÍTVA! ✓');
            }
        });

        // Auto-save on input change
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('change', () => {
                this.collectData();
                this.storageManager.save(this.data);
            });
            
            input.addEventListener('blur', () => {
                this.collectData();
                this.storageManager.save(this.data);
            });
        });
    }

    setupAutoSave() {
        setInterval(() => {
            this.collectData();
            this.storageManager.save(this.data);
            console.log('Auto-save triggered');
        }, 30000);
    }

    collectData() {
        this.data.test = parseInt(document.getElementById('test').value) || 0;
        this.data.skill = parseInt(document.getElementById('skill').value) || 0;
        this.data.mind = parseInt(document.getElementById('mind').value) || 0;
        this.data.occasion = document.getElementById('occasion').value;
        this.data.past = document.getElementById('past').value;
        this.data.equipment = document.getElementById('equipment').value;
        this.data.spells = document.getElementById('spells').value;
        this.data.notes = document.getElementById('notes').value;

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
        document.getElementById('test').value = this.data.test;
        document.getElementById('skill').value = this.data.skill;
        document.getElementById('mind').value = this.data.mind;
        document.getElementById('occasion').value = this.data.occasion || '';
        document.getElementById('past').value = this.data.past || '';
        document.getElementById('equipment').value = this.data.equipment;
        document.getElementById('spells').value = this.data.spells;
        document.getElementById('notes').value = this.data.notes;

        document.querySelectorAll('.battle-card').forEach((card, index) => {
            const inputs = card.querySelectorAll('input[type="number"]');
            inputs[0].value = this.data.battles[index].test;
            inputs[1].value = this.data.battles[index].skill;
            inputs[2].value = this.data.battles[index].mind;
        });
    }

    reset() {
        this.data = this.initializeData();
        this.populateForm();
        this.storageManager.save(this.data);
    }

    validateImportedData(data) {
        return (
            data.hasOwnProperty('test') &&
            data.hasOwnProperty('skill') &&
            data.hasOwnProperty('mind') &&
            data.hasOwnProperty('battles') &&
            Array.isArray(data.battles) &&
            data.battles.length === 9
        );
    }

    showHelp() {
        const existing = document.querySelector('.help-modal');
        if (existing) {
            existing.remove();
            return;
        }

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
                        <span class="shortcut-key">Ctrl + G</span>
                        <span class="shortcut-desc">Karakter generálás</span>
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
                
                <h3>Karakter Generálás</h3>
                <ul class="help-features">
                    <li><strong>Alap értékek:</strong> Test: 18, Kecsesség: 7, Elme: 7, Max varázslatok: 1</li>
                    <li><strong>14 fejlődéspont:</strong> Költhető a karakter fejlesztésére</li>
                    <li><strong>Test:</strong> +1 = 1 pont (maximum +10)</li>
                    <li><strong>Kecsesség/Elme:</strong> +1 = 2 pont, +2 = 5 pont, +3 = 9 pont</li>
                    <li><strong>Max Varázslatok:</strong> +1 = 4 pont, +2 = 8 pont (maximum +2)</li>
                    <li><strong>Varázslatok:</strong> 6 varázslat közül választhatsz, mindegyiknek van Elme követelménye</li>
                </ul>

                <h3>Elérhető Varázslatok</h3>
                <ul class="help-features">
                    <li><strong>Ragyogás</strong> - Elme követelmény: 6</li>
                    <li><strong>Gyorsítás</strong> - Elme követelmény: 7</li>
                    <li><strong>Varázslók végzete</strong> - Elme követelmény: 9</li>
                    <li><strong>Manatüske</strong> - Elme követelmény: 8</li>
                    <li><strong>Izomsorvadás</strong> - Elme követelmény: 9</li>
                    <li><strong>Éterfolyam</strong> - Elme követelmény: 8</li>
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
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showNotification(message) {
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AdventureSheet();
    console.log('Kalandlap Adventure Companion loaded!');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        document.getElementById('saveBtn').click();
    }
    
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('loadBtn').click();
    }
    
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        document.getElementById('exportBtn').click();
    }
    
    if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        document.getElementById('importBtn').click();
    }
    
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        document.getElementById('charGenBtn').click();
    }
    
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        document.getElementById('diceBtn').click();
    }
    
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        document.getElementById('helpBtn').click();
    }
});

// Save before page close
window.addEventListener('beforeunload', (e) => {
    if (window.adventureSheet) {
        window.adventureSheet.collectData();
        window.adventureSheet.storageManager.save(window.adventureSheet.data);
    }
});