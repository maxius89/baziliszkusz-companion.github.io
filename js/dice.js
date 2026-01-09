// Dice roller module
export class DiceRoller {
    constructor(adventureSheet) {
        this.adventureSheet = adventureSheet;
        this.historyKey = 'kalandlap_dice_history';
    }

    show() {
        let sidebar = document.querySelector('.dice-roller-sidebar');

        if (sidebar) {
            sidebar.classList.toggle('open');
            return;
        }

        const template = document.getElementById('dice-roller-template');
        const content = template.content.cloneNode(true);

        sidebar = document.createElement('div');
        sidebar.className = 'dice-roller-sidebar sidebar';
        sidebar.appendChild(content);

        document.body.appendChild(sidebar);

        this.bindDiceEvents(sidebar);

        setTimeout(() => sidebar.classList.add('open'), 10);
        this.loadHistory();
    }

    bindDiceEvents(sidebar) {
        // Close button
        sidebar.querySelector('#diceClose').addEventListener('click', () => {
            sidebar.classList.remove('open');
        });

        // Simple roll buttons
        sidebar.querySelector('#roll1d6').addEventListener('click', () => this.rollAndShow(1));
        sidebar.querySelector('#roll2d6').addEventListener('click', () => this.rollAndShow(2));

        // Battle roll button
        sidebar.querySelector('#rollBattle').addEventListener('click', () => this.rollBattle());
    }

    rollDice(sides = 6) {
        return Math.floor(Math.random() * sides) + 1;
    }

    rollAndShow(numDice) {
        const results = [];
        let total = 0;

        for (let i = 0; i < numDice; i++) {
            const roll = this.rollDice(6);
            results.push(roll);
            total += roll;
        }

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

            this.addToHistory(numDice, results, total);
        }, 300);
    }

    rollBattle() {
        const attackerRolls = [this.rollDice(6), this.rollDice(6)];
        const attackerTotal = attackerRolls[0] + attackerRolls[1];

        const defenderRolls = [this.rollDice(6), this.rollDice(6)];
        const defenderTotal = defenderRolls[0] + defenderRolls[1];

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

            this.addToHistory('Harc', [...attackerRolls, ...defenderRolls], `${attackerTotal} vs ${defenderTotal}`);
        }, 300);
    }

    addToHistory(numDice, results, total) {
        const history = this.getHistory();
        const entry = {
            timestamp: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
            numDice: numDice,
            results: results,
            total: total
        };

        history.unshift(entry);
        if (history.length > 10) history.pop();

        localStorage.setItem(this.historyKey, JSON.stringify(history));
        this.displayHistory(history);
    }

    getHistory() {
        try {
            const history = localStorage.getItem(this.historyKey);
            return history ? JSON.parse(history) : [];
        } catch (e) {
            return [];
        }
    }

    loadHistory() {
        const history = this.getHistory();
        this.displayHistory(history);
    }

    displayHistory(history) {
        const container = document.querySelector('.history-items');
        if (!container) return;

        if (history.length === 0) {
            container.innerHTML = '<div class="history-empty">Még nem dobtál kockát</div>';
            return;
        }

        container.innerHTML = '';
        const template = document.getElementById('history-item-template');

        history.forEach(entry => {
            const item = template.content.cloneNode(true);
            const container = item.querySelector('.history-item');

            item.querySelector('[data-time]').textContent = entry.timestamp;

            if (entry.numDice === 'Harc') {
                item.querySelector('[data-dice]').textContent = 'Harc:';
                item.querySelector('[data-total]').textContent = entry.total;
                item.querySelector('[data-details]').remove(); // Not needed for battle
            } else {
                item.querySelector('[data-dice]').textContent = `${entry.numDice}D6:`;
                item.querySelector('[data-total]').textContent = entry.total;

                if (entry.numDice > 1) {
                    item.querySelector('[data-details]').textContent = `(${entry.results.join(' + ')})`;
                } else {
                    item.querySelector('[data-details]').remove();
                }
            }

            container.appendChild(item);
        });
    }
}