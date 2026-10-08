export class CasinoManager {
    constructor(game) {
        this.game = game;
        this.currentCasino = null;
    }

    open(casinoName) {
        this.currentCasino = casinoName;
        this.showCasinoUI();
    }

    showCasinoUI() {
        const casinoModal = document.getElementById('casino-modal');
        if (!casinoModal) {
            this.createCasinoModal();
        } else {
            casinoModal.classList.remove('hidden');
        }
        
        const title = document.getElementById('casino-title');
        if (title) title.textContent = this.currentCasino;
    }

    createCasinoModal() {
        const modal = document.createElement('div');
        modal.id = 'casino-modal';
        modal.className = 'glass-modal casino-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="casino-title">${this.currentCasino}</h3>
                    <button class="close-modal" id="close-casino">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="casino-stats">
                        <span>Your Balance: <span id="casino-balance">$${this.game.state.money.toLocaleString()}</span></span>
                    </div>
                    
                    <div class="casino-games">
                        <div class="game-card" id="double-nothing">
                            <h4>Double or Nothing</h4>
                            <p>50/50 Chance to double your bet!</p>
                            <div class="bet-inputs">
                                <button class="bet-preset" data-amount="100">$100</button>
                                <button class="bet-preset" data-amount="1000">$1k</button>
                                <button class="bet-preset" data-amount="10000">$10k</button>
                            </div>
                            <button class="play-btn" id="play-double">Gamble!</button>
                        </div>

                        <div class="game-card" id="slot-machine">
                            <h4>Ultra Slots</h4>
                            <p>Match 3 icons for a 10x payout!</p>
                            <div class="slots-container">
                                <div class="slot" id="slot1">🍒</div>
                                <div class="slot" id="slot2">🍋</div>
                                <div class="slot" id="slot3">💎</div>
                            </div>
                            <button class="play-btn" id="spin-slots">Spin ($500)</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event Listeners
        modal.querySelector('#close-casino').onclick = () => modal.classList.add('hidden');
        
        modal.querySelector('#play-double').onclick = () => this.playDoubleOrNothing();
        modal.querySelector('#spin-slots').onclick = () => this.spinSlots();
        
        modal.querySelectorAll('.bet-preset').forEach(btn => {
            btn.onclick = () => {
                modal.querySelectorAll('.bet-preset').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedBet = parseInt(btn.dataset.amount);
            };
        });
        
        this.selectedBet = 100;
        modal.querySelector('.bet-preset[data-amount="100"]').classList.add('selected');
    }

    playDoubleOrNothing() {
        const bet = this.selectedBet;
        if (this.game.state.money < bet) {
            this.game.ui.notifications.showToast("Insufficient funds!", "error");
            return;
        }

        this.game.state.money -= bet;
        this.game.ui.updateMoneyUI(this.game.state.money);
        
        const win = Math.random() > 0.5;
        if (win) {
            const reward = bet * 2;
            this.game.state.money += reward;
            this.game.ui.notifications.showToast(`YOU WON $${reward.toLocaleString()}!`, "success");
            this.game.ui.notifications.showFloatingText(`+$${reward.toLocaleString()}`, 'money');
        } else {
            this.game.ui.notifications.showToast(`You lost $${bet.toLocaleString()}. Better luck next time!`, "error");
        }
        
        this.updateBalanceUI();
        this.game.state.save();
    }

    spinSlots() {
        const cost = 500;
        if (this.game.state.money < cost) {
            this.game.ui.notifications.showToast("Insufficient funds!", "error");
            return;
        }

        this.game.state.money -= cost;
        this.updateBalanceUI();
        
        const icons = ['🍒', '🍋', '💎', '🔔', '7️⃣'];
        const s1 = icons[Math.floor(Math.random() * icons.length)];
        const s2 = icons[Math.floor(Math.random() * icons.length)];
        const s3 = icons[Math.floor(Math.random() * icons.length)];

        document.getElementById('slot1').textContent = s1;
        document.getElementById('slot2').textContent = s2;
        document.getElementById('slot3').textContent = s3;

        if (s1 === s2 && s2 === s3) {
            const reward = cost * 10;
            this.game.state.money += reward;
            this.game.ui.notifications.showToast(`JACKPOT! $${reward.toLocaleString()}!`, "success");
            this.game.ui.notifications.showFloatingText(`+$${reward.toLocaleString()}`, 'money');
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            const reward = cost * 2;
            this.game.state.money += reward;
            this.game.ui.notifications.showToast(`Small Match! $${reward.toLocaleString()}`, "success");
        }

        this.updateBalanceUI();
        this.game.state.save();
    }

    updateBalanceUI() {
        const balance = document.getElementById('casino-balance');
        if (balance) balance.textContent = `$${this.game.state.money.toLocaleString()}`;
        this.game.ui.updateMoneyUI(this.game.state.money);
    }
}
