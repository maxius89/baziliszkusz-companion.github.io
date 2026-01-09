// Character generator module
export class CharacterGenerator {
    constructor(adventureSheet) {
        this.adventureSheet = adventureSheet;

        // Available classes with bonuses
        this.classes = {
            magusvadasz: {
                name: 'Mágusvadász',
                bonus: '+1 varázslat',
                effect: { type: 'spells', value: 1 }
            },
            szabotor: {
                name: 'Szabotőr',
                bonus: '+5 Test',
                effect: { type: 'test', value: 5 }
            },
            vereb: {
                name: 'Véreb',
                bonus: '+1 Kecsesség',
                effect: { type: 'skill', value: 1 }
            }
        };

        // Available backgrounds with bonuses
        this.backgrounds = {
            testor: {
                name: 'Egy nagyhatalmú mágus testőre',
                bonus: 'Kezdeti felszerelés: Rúnapajzs',
                effect: { type: 'equipment', value: 'Rúnapajzs' }
            },
            ostora: {
                name: 'A Birodalom ellenségeinek ostora',
                bonus: 'Kezdeti felszerelés: 3 Dobókés',
                effect: { type: 'equipment', value: '3× Dobókés' }
            },
            tulelo: {
                name: 'Magiko-technikus kísérletek túlélője',
                bonus: 'Speciális képesség: Áldozz fel 1 Elmepontot, hogy 2 Testpontot gyógyulj',
                effect: { type: 'ability', value: 'Magiko-regeneráció: -1 Elme → +2 Test' }
            }
        };

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

        const template = document.getElementById('chargen-template');
        const content = template.content.cloneNode(true);

        sidebar = document.createElement('div');
        sidebar.className = 'chargen-sidebar sidebar';
        sidebar.appendChild(content);

        document.body.appendChild(sidebar);

        sidebar.querySelector('#chargenClose').addEventListener('click', () => {
            sidebar.classList.remove('open');
        });

        this.init();

        setTimeout(() => sidebar.classList.add('open'), 10);
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
            selectedSpells: [],
            selectedClass: '',
            selectedBackground: ''
        };

        this.setupClassAndBackgroundListeners();
        this.setupControls();
        this.renderSpellList();
        this.updateDisplay();

        document.getElementById('applyCharGen').addEventListener('click', () => this.apply());
        document.getElementById('resetCharGen').addEventListener('click', () => this.reset());
    }

    setupClassAndBackgroundListeners() {
        document.getElementById('classSelect').addEventListener('change', (e) => {
            this.data.selectedClass = e.target.value;
            this.updateClassBonus();

            const maxSpells = this.getTotalMaxSpells();
            if (this.data.selectedSpells.length > maxSpells) {
                this.data.selectedSpells = this.data.selectedSpells.slice(0, maxSpells);
            }

            this.renderSpellList();

            const selectedCount = this.data.selectedSpells.length;
            document.getElementById('selectedSpellCount').textContent = String(selectedCount);
            document.getElementById('maxSpellCount').textContent = String(maxSpells);
        });

        document.getElementById('backgroundSelect').addEventListener('change', (e) => {
            this.data.selectedBackground = e.target.value;
            this.updateBackgroundBonus();
        });
    }

    updateClassBonus() {
        const bonusElement = document.getElementById('classBonus');
        if (this.data.selectedClass && this.classes[this.data.selectedClass]) {
            bonusElement.textContent = ` ${this.classes[this.data.selectedClass].bonus}`;
            bonusElement.style.display = 'block';
        } else {
            bonusElement.style.display = 'none';
        }
    }

    updateBackgroundBonus() {
        const bonusElement = document.getElementById('backgroundBonus');
        if (this.data.selectedBackground && this.backgrounds[this.data.selectedBackground]) {
            bonusElement.textContent = `${this.backgrounds[this.data.selectedBackground].bonus}`;
            bonusElement.style.display = 'block';
        } else {
            bonusElement.style.display = 'none';
        }
    }

    getTotalMaxSpells() {
        let maxSpells = 1 + this.data.selections.spells;

        if (this.data.selectedClass === 'magusvadasz') {
            maxSpells += this.classes.magusvadasz.effect.value;
        }

        return maxSpells;
    }

    updateSpellCounter() {
        const maxSpells = this.getTotalMaxSpells();
        const selectedCount = this.data.selectedSpells.length;

        const selectedCountElement = document.getElementById('selectedSpellCount');
        const maxSpellCountElement = document.getElementById('maxSpellCount');
        const counter = document.getElementById('spellCounter');

        if (!selectedCountElement || !maxSpellCountElement || !counter) {
            console.warn('Spell counter elements not found');
            return;
        }

        selectedCountElement.textContent = String(selectedCount);
        maxSpellCountElement.textContent = String(maxSpells);

        if (selectedCount > maxSpells) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
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
        [{ val: 1, cost: 2 }, { val: 2, cost: 5 }, { val: 3, cost: 9 }].forEach(opt => {
            const btn = this.createStatButton('skill', opt.val, opt.cost);
            skillControls.appendChild(btn);
        });

        // Mind controls
        const mindControls = document.getElementById('mindControls');
        mindControls.innerHTML = '';
        [{ val: 1, cost: 2 }, { val: 2, cost: 5 }, { val: 3, cost: 9 }].forEach(opt => {
            const btn = this.createStatButton('mind', opt.val, opt.cost);
            mindControls.appendChild(btn);
        });

        // Spells controls
        const spellsControls = document.getElementById('spellsControls');
        spellsControls.innerHTML = '';
        [{ val: 1, cost: 4 }, { val: 2, cost: 8 }].forEach(opt => {
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

        switch (stat) {
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
        const maxSpells = this.getTotalMaxSpells();
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
        if (!spellList) {
            console.warn('Spell list element not found');
            return;
        }

        spellList.innerHTML = '';

        const currentMind = 7 + this.data.selections.mind;
        const template = document.getElementById('spell-item-template');

        this.availableSpells.forEach((spell, index) => {
            const spellItem = template.content.cloneNode(true);
            const container = spellItem.querySelector('.spell-item');

            const isSelected = this.data.selectedSpells.includes(index);
            const canSelect = currentMind >= spell.mindReq;

            if (isSelected) container.classList.add('selected');
            if (!canSelect) container.classList.add('disabled');

            spellItem.querySelector('[data-spell-name]').innerHTML = spell.name;
            spellItem.querySelector('[data-spell-req]').textContent = `(Elme: ${spell.mindReq})`;

            if (canSelect) {
                container.addEventListener('click', () => this.toggleSpell(index));
            }

            spellList.appendChild(spellItem);
        });

        this.updateSpellCounter();
    }

    toggleSpell(spellIndex) {
        const maxSpells = this.getTotalMaxSpells();
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
        const maxSpells = this.getTotalMaxSpells();
        const selectedCount = this.data.selectedSpells.length;

        const selectedCountElement = document.getElementById('selectedSpellCount');
        const maxSpellCountElement = document.getElementById('maxSpellCount');
        const counter = document.getElementById('spellCounter');

        if (!selectedCountElement || !maxSpellCountElement || !counter) {
            console.warn('Spell counter elements not found');
            return;
        }

        selectedCountElement.textContent = String(selectedCount);
        maxSpellCountElement.textContent = String(maxSpells);

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
        this.data.selectedClass = '';
        this.data.selectedBackground = '';

        document.getElementById('classSelect').value = '';
        document.getElementById('backgroundSelect').value = '';

        this.updateClassBonus();
        this.updateBackgroundBonus();
        this.renderSpellList();
        this.updateDisplay();

        this.adventureSheet.showNotification('KARAKTER VISSZAÁLLÍTVA! ✓');
    }

    apply() {
        const maxSpells = this.getTotalMaxSpells();
        if (this.data.selectedSpells.length > maxSpells) {
            this.adventureSheet.showNotification('TÚL SOK VARÁZSLAT KIVÁLASZTVA! ✗');
            return;
        }

        // Validate selections
        if (!this.data.selectedClass) {
            this.adventureSheet.showNotification('VÁLASSZ ALKASZTOT! ✗');
            return;
        }

        if (!this.data.selectedBackground) {
            this.adventureSheet.showNotification('VÁLASSZ MÚLTAT! ✗');
            return;
        }

        // Apply base stats
        let finalTest = 18 + this.data.selections.test;
        let finalSkill = 7 + this.data.selections.skill;
        let finalMind = 7 + this.data.selections.mind;

        // Apply class bonuses
        const classEffect = this.classes[this.data.selectedClass].effect;
        if (classEffect.type === 'test') {
            finalTest += classEffect.value;
        } else if (classEffect.type === 'skill') {
            finalSkill += classEffect.value;
        }

        // Update main form
        this.adventureSheet.data.test = finalTest;
        this.adventureSheet.data.skill = finalSkill;
        this.adventureSheet.data.mind = finalMind;
        this.adventureSheet.data.occasion = this.data.selectedClass;
        this.adventureSheet.data.past = this.data.selectedBackground;

        document.getElementById('test').value = finalTest;
        document.getElementById('skill').value = finalSkill;
        document.getElementById('mind').value = finalMind;
        document.getElementById('occasion').value = this.data.selectedClass;
        document.getElementById('past').value = this.data.selectedBackground;

        // Update bonus displays on main sheet
        this.adventureSheet.updateMainSheetBonuses();

        // Build spell list
        let spellsText = '';
        if (this.data.selectedSpells.length > 0) {
            const selectedSpellNames = this.data.selectedSpells.map(index =>
                this.availableSpells[index].nameText
            );
            spellsText = selectedSpellNames.join('\n');
        }

        this.adventureSheet.data.spells = spellsText;
        document.getElementById('spells').value = spellsText;

        // Apply background bonuses to equipment - REPLACE instead of append
        const bgEffect = this.backgrounds[this.data.selectedBackground].effect;

        if (bgEffect.type === 'equipment') {
            // Replace equipment with background bonus only
            this.adventureSheet.data.equipment = bgEffect.value;
            document.getElementById('equipment').value = bgEffect.value;
        } else {
            // Clear equipment if background doesn't provide equipment
            this.adventureSheet.data.equipment = '';
            document.getElementById('equipment').value = '';
        }

        // Save
        this.adventureSheet.storageManager.save(this.adventureSheet.data);

        // Close sidebar
        document.querySelector('.chargen-sidebar').classList.remove('open');

        this.adventureSheet.showNotification('KARAKTER ALKALMAZVA! ✓');
    }
}