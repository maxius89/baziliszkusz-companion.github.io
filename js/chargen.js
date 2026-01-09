// Character generator module
export class CharacterGenerator {
    constructor(adventureSheet) {
        this.adventureSheet = adventureSheet;
        this.availableSpells = [
            { name: 'Ragyog&#225;s', nameText: 'Ragyogás', mindReq: 6 },
            { name: 'Gyors&#237;t&#225;s', nameText: 'Gyorsítás', mindReq: 7 },
            { name: 'Var&#225;zsl&#243;k v&#233;gzete', nameText: 'Varázslók végzete', mindReq: 9 },
            { name: 'Manat&#252;ske', nameText: 'Manatüske', mindReq: 8 },
            { name: 'Izomsorvad&#225;s', nameText: 'Izomsorvadás', mindReq: 9 },
            { name: '&#201;terfolyam', nameText: 'Éterfolyam', mindReq: 8 }
        ];
    }

show() {
    let sidebar = document.querySelector('.chargen-sidebar');
    
    if (sidebar) {
        sidebar.classList.toggle('open');
        return;
    }

    sidebar = document.createElement('div');
    sidebar.className = 'chargen-sidebar';
    sidebar.innerHTML = this.getHTML();
    
    document.body.appendChild(sidebar);

    sidebar.querySelector('#chargenClose').addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
    
    this.init();
    
    setTimeout(() => sidebar.classList.add('open'), 10);
}

    getHTML() {
        return `
            <div class="chargen-content">
                <button class="chargen-close" id="chargenClose">✕</button>
                <h2>KARAKTER GENER&#193;L&#193;S</h2>
                
                <div class="chargen-info">
                    <strong>Alap értékek:</strong><br>
                    Test: 18 | Kecsesség: 7 | Elme: 7<br>
                    Max varázslatok: 1<br><br>
                    <strong>14 fejlődéspont</strong> áll rendelkezésre.
                </div>
                
                <div class="chargen-section">
                    <div class="points-display">
                        <div class="points-remaining" id="pointsRemaining">14</div>
                        <div class="points-label">Fejlődéspont</div>
                    </div>
                </div>
                
                <div class="chargen-section">
                    <div class="stat-row">
                        <div class="stat-header">
                            <span class="stat-name">TEST</span>
                            <span class="stat-value" id="genTest">18</span>
                        </div>
                        <div class="stat-controls" id="testControls"></div>
                        <div class="stat-cost">+1 = 1 pont (max +10)</div>
                    </div>
                    
                    <div class="stat-row">
                        <div class="stat-header">
                            <span class="stat-name">KECSESS&#201;G</span>
                            <span class="stat-value" id="genSkill">7</span>
                        </div>
                        <div class="stat-controls" id="skillControls"></div>
                        <div class="stat-cost">+1 = 2 pont | +2 = 5 pont | +3 = 9 pont</div>
                    </div>
                    
                    <div class="stat-row">
                        <div class="stat-header">
                            <span class="stat-name">ELME</span>
                            <span class="stat-value" id="genMind">7</span>
                        </div>
                        <div class="stat-controls" id="mindControls"></div>
                        <div class="stat-cost">+1 = 2 pont | +2 = 5 pont | +3 = 9 pont</div>
                    </div>
                    
                    <div class="stat-row">
                        <div class="stat-header">
                            <span class="stat-name">MAX VAR&#193;ZSLATOK</span>
                            <span class="stat-value" id="genSpells">1</span>
                        </div>
                        <div class="stat-controls" id="spellsControls"></div>
                        <div class="stat-cost">+1 = 4 pont | +2 = 8 pont (max +2)</div>
                    </div>
                </div>
                
                <div class="chargen-section">
                    <div class="spell-selection">
                        <h4>VAR&#193;ZSLATV&#193;LASZT&#193;S</h4>
                        <div class="spell-list" id="spellList"></div>
                        <div class="spell-counter" id="spellCounter">
                            <span id="selectedSpellCount">0</span> / <span id="maxSpellCount">1</span> varázslat kiválasztva
                        </div>
                    </div>
                </div>
                
                <div class="chargen-actions">
                    <button class="chargen-btn primary" id="applyCharGen">
                        &#10004; ALKALMAZ
                    </button>
                    <button class="chargen-btn" id="resetCharGen">
                        &#8634; VISSZA&#193;LL&#205;T
                    </button>
                </div>
            </div>
        `;
    }

    init() {
        this.data = {
            test: 18,
            skill: 7,
            mind: 7,
            maxSpells: 1,
            pointsSpent: 0,
            totalPoints: 14,
            selections: {
                test: 0,
                skill: 0,
                mind: 0,
                spells: 0
            },
            selectedSpells: []
        };
        
        this.setupControls();
        this.renderSpellList();
        this.updateDisplay();
        
        document.getElementById('applyCharGen').addEventListener('click', () => this.apply());
        document.getElementById('resetCharGen').addEventListener('click', () => this.reset());
    }

    setupControls() {
        // Test controls
        const testControls = document.getElementById('testControls');
        testControls.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const btn = this.createStatButton('test', i, i);
            testControls.appendChild(btn);
        }
        
        // Skill controls
        const skillControls = document.getElementById('skillControls');
        skillControls.innerHTML = '';
        [{val: 1, cost: 2}, {val: 2, cost: 5}, {val: 3, cost: 9}].forEach(opt => {
            const btn = this.createStatButton('skill', opt.val, opt.cost);
            skillControls.appendChild(btn);
        });
        
        // Mind controls
        const mindControls = document.getElementById('mindControls');
        mindControls.innerHTML = '';
        [{val: 1, cost: 2}, {val: 2, cost: 5}, {val: 3, cost: 9}].forEach(opt => {
            const btn = this.createStatButton('mind', opt.val, opt.cost);
            mindControls.appendChild(btn);
        });
        
        // Spells controls
        const spellsControls = document.getElementById('spellsControls');
        spellsControls.innerHTML = '';
        [{val: 1, cost: 4}, {val: 2, cost: 8}].forEach(opt => {
            const btn = this.createStatButton('spells', opt.val, opt.cost);
            spellsControls.appendChild(btn);
        });
    }

    createStatButton(stat, value, cost) {
        const btn = document.createElement('button');
        btn.className = 'stat-btn';
        btn.textContent = `+${value}`;
        btn.dataset.stat = stat;
        btn.dataset.value = value;
        btn.dataset.cost = cost;
        btn.addEventListener('click', () => this.selectStatBonus(stat, value, cost));
        return btn;
    }

    selectStatBonus(stat, value, cost) {
        const currentSelection = this.data.selections[stat];
        
        if (currentSelection === value) {
            this.data.selections[stat] = 0;
        } else {
            const currentCost = this.getStatCost(stat, currentSelection);
            const pointsAfterRemoval = this.data.pointsSpent - currentCost;
            const newTotal = pointsAfterRemoval + cost;
            
            if (newTotal > this.data.totalPoints) {
                this.adventureSheet.showNotification('NINCS ELÉG PONT! ✗');
                return;
            }
            
            this.data.selections[stat] = value;
        }
        
        if (stat === 'mind' || stat === 'spells') {
            const currentMind = 7 + this.data.selections.mind;
            const maxSpells = 1 + this.data.selections.spells;
            
            this.data.selectedSpells = this.data.selectedSpells.filter(spellIndex => {
                return this.availableSpells[spellIndex].mindReq <= currentMind;
            });
            
            if (this.data.selectedSpells.length > maxSpells) {
                this.data.selectedSpells = this.data.selectedSpells.slice(0, maxSpells);
            }
            
            this.renderSpellList();
        }
        
        this.updateDisplay();
    }

    getStatCost(stat, value) {
        if (value === 0) return 0;
        
        switch(stat) {
            case 'test':
                return value;
            case 'skill':
            case 'mind':
                if (value === 1) return 2;
                if (value === 2) return 5;
                if (value === 3) return 9;
                break;
            case 'spells':
                if (value === 1) return 4;
                if (value === 2) return 8;
                break;
        }
        return 0;
    }

    updateDisplay() {
        let totalSpent = 0;
        totalSpent += this.getStatCost('test', this.data.selections.test);
        totalSpent += this.getStatCost('skill', this.data.selections.skill);
        totalSpent += this.getStatCost('mind', this.data.selections.mind);
        totalSpent += this.getStatCost('spells', this.data.selections.spells);
        
        this.data.pointsSpent = totalSpent;
        
        document.getElementById('genTest').textContent = 18 + this.data.selections.test;
        document.getElementById('genSkill').textContent = 7 + this.data.selections.skill;
        document.getElementById('genMind').textContent = 7 + this.data.selections.mind;
        document.getElementById('genSpells').textContent = 1 + this.data.selections.spells;
        
        const remaining = this.data.totalPoints - totalSpent;
        const pointsElement = document.getElementById('pointsRemaining');
        pointsElement.textContent = remaining;
        
        if (remaining < 0) {
            pointsElement.classList.add('warning');
        } else {
            pointsElement.classList.remove('warning');
        }
        
        this.updateButtons();
        this.updateSpellCounter();
        
        const applyBtn = document.getElementById('applyCharGen');
        const maxSpells = 1 + this.data.selections.spells;
        const selectedCount = this.data.selectedSpells.length;
        applyBtn.disabled = remaining < 0 || selectedCount > maxSpells;
    }

    updateButtons() {
        const remaining = this.data.totalPoints - this.data.pointsSpent;
        
        ['test', 'skill', 'mind', 'spells'].forEach(stat => {
            const controls = document.getElementById(`${stat}Controls`);
            const buttons = controls.querySelectorAll('.stat-btn');
            const currentSelection = this.data.selections[stat];
            
            buttons.forEach(btn => {
                const value = parseInt(btn.dataset.value);
                const cost = parseInt(btn.dataset.cost);
                
                if (value === currentSelection) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
                
                const currentCost = this.getStatCost(stat, currentSelection);
                const pointsAfterRemoval = this.data.pointsSpent - currentCost;
                const wouldHaveEnough = (pointsAfterRemoval + cost) <= this.data.totalPoints;
                
                btn.disabled = !wouldHaveEnough && value !== currentSelection;
            });
        });
    }

    renderSpellList() {
        const spellList = document.getElementById('spellList');
        spellList.innerHTML = '';
        
        const currentMind = 7 + this.data.selections.mind;
        
        this.availableSpells.forEach((spell, index) => {
            const spellItem = document.createElement('div');
            spellItem.className = 'spell-item';
            
            const isSelected = this.data.selectedSpells.includes(index);
            const canSelect = currentMind >= spell.mindReq;
            
            if (isSelected) spellItem.classList.add('selected');
            if (!canSelect) spellItem.classList.add('disabled');
            
            spellItem.innerHTML = `
                <div class="spell-checkbox"></div>
                <div class="spell-info">
                    <span class="spell-name">${spell.name}</span>
                    <span class="spell-requirement">(Elme: ${spell.mindReq})</span>
                </div>
            `;
            
            if (canSelect) {
                spellItem.addEventListener('click', () => this.toggleSpell(index));
            }
            
            spellList.appendChild(spellItem);
        });
        
        this.updateSpellCounter();
    }

    toggleSpell(spellIndex) {
        const maxSpells = 1 + this.data.selections.spells;
        const currentIndex = this.data.selectedSpells.indexOf(spellIndex);
        
        if (currentIndex > -1) {
            this.data.selectedSpells.splice(currentIndex, 1);
        } else {
            if (this.data.selectedSpells.length >= maxSpells) {
                this.adventureSheet.showNotification('MAXIMUM VARÁZSLAT ELÉRVE! ✗');
                return;
            }
            this.data.selectedSpells.push(spellIndex);
        }
        
        this.renderSpellList();
    }

    updateSpellCounter() {
        const maxSpells = 1 + this.data.selections.spells;
        const selectedCount = this.data.selectedSpells.length;
        
        document.getElementById('selectedSpellCount').textContent = selectedCount;
        document.getElementById('maxSpellCount').textContent = maxSpells;
        
        const counter = document.getElementById('spellCounter');
        if (selectedCount > maxSpells) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }

    reset() {
        this.data.selections = { test: 0, skill: 0, mind: 0, spells: 0 };
        this.data.pointsSpent = 0;
        this.data.selectedSpells = [];
        this.renderSpellList();
        this.updateDisplay();
                this.adventureSheet.showNotification('KARAKTER VISSZAÁLLÍTVA! ✓');
    }

    apply() {
        const maxSpells = 1 + this.data.selections.spells;
        if (this.data.selectedSpells.length > maxSpells) {
            this.adventureSheet.showNotification('TÚL SOK VARÁZSLAT KIVÁLASZTVA! ✗');
            return;
        }
        
        // Apply stats
        this.adventureSheet.data.test = 18 + this.data.selections.test;
        this.adventureSheet.data.skill = 7 + this.data.selections.skill;
        this.adventureSheet.data.mind = 7 + this.data.selections.mind;
        
        // Update form
        document.getElementById('test').value = this.adventureSheet.data.test;
        document.getElementById('skill').value = this.adventureSheet.data.skill;
        document.getElementById('mind').value = this.adventureSheet.data.mind;
        
        // Build spell list
        let spellsText = '';
        if (this.data.selectedSpells.length > 0) {
            const selectedSpellNames = this.data.selectedSpells.map(index => 
                this.availableSpells[index].nameText
            );
            spellsText = selectedSpellNames.join('\n');
        }
        
        // Update spells textarea
        this.adventureSheet.data.spells = spellsText;
        document.getElementById('spells').value = spellsText;
        
        // Save
        this.adventureSheet.storageManager.save(this.adventureSheet.data);
        
        // Close sidebar
        document.querySelector('.chargen-sidebar').classList.remove('open');
        
        this.adventureSheet.showNotification('KARAKTER ALKALMAZVA! ✓');
    }
}