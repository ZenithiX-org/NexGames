export class ChatManager {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        
        this.npcNames = [
            "TruckKing99", "SpeedyGonsales", "RoadRunner", "DieselDan", 
            "LadyTrucker", "GearHead", "HaulStar", "BigRig_Pro", 
            "CargoMaster", "RoadPirate", "NightOwl", "HighwayHero"
        ];
        
        this.phrases = [
            "Just delivered a massive cargo to NYC!",
            "Anyone seen the police lately?",
            "The new CyberTruck is insanely fast.",
            "Macau casino just took all my money :(",
            "Nice truck, @player!",
            "Heading to the workshop for some upgrades.",
            "The weather in Tokyo is great today.",
            "Just hit level 10! Let's goooo!",
            "Who wants to race to Las Vegas?",
            "Watch out for the speed cameras near Paris.",
            "That nitro boost is a lifesaver.",
            "Is the harbor mission worth it?",
            "Just earned $50k in one haul!",
            "The physics in this game feel great.",
            "Found a secret shortcut through the desert."
        ];

        this.init();
    }

    init() {
        if (!this.input) return;

        // Close button
        const closeBtn = document.getElementById('close-chat');
        if (closeBtn) {
            closeBtn.onclick = () => this.toggle(false);
        }

        // Toggle button in settings
        const toggleBtn = document.getElementById('toggle-chat-btn');
        if (toggleBtn) {
            toggleBtn.onclick = () => this.toggle();
        }

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.activeElement !== this.input) {
                // Only focus if visible
                if (!document.getElementById('chat-container').classList.contains('hidden')) {
                    this.input.focus();
                }
            }
        });

        // Start random NPC chatter
        this.startNPCChatter();
        
        // Welcome message
        setTimeout(() => {
            this.addMessage("System", "Welcome to Global Trucker Online!", "system");
        }, 1000);
    }

    toggle(force) {
        const chat = document.getElementById('chat-container');
        if (typeof force === 'boolean') {
            chat.classList.toggle('hidden', !force);
        } else {
            chat.classList.toggle('hidden');
        }
    }

    sendMessage() {
        const text = this.input.value.trim();
        if (text) {
            this.addMessage("You", text, "user");
            this.input.value = '';
            
            // Small chance for NPCs to react to player
            if (Math.random() > 0.7) {
                setTimeout(() => this.simulateNPCReply(), 1500);
            }
        }
    }

    addMessage(user, text, type = "npc") {
        if (!this.container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg';
        
        const userSpan = document.createElement('span');
        userSpan.className = `chat-${type}`;
        userSpan.textContent = user + ": ";
        
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        
        msgDiv.appendChild(userSpan);
        msgDiv.appendChild(textSpan);
        
        this.container.appendChild(msgDiv);
        this.container.scrollTop = this.container.scrollHeight;

        // Auto-remove old messages to keep it clean
        if (this.container.children.length > 50) {
            this.container.removeChild(this.container.firstChild);
        }
    }

    startNPCChatter() {
        const delay = 5000 + Math.random() * 15000;
        setTimeout(() => {
            const name = this.npcNames[Math.floor(Math.random() * this.npcNames.length)];
            const phrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
            this.addMessage(name, phrase, "npc");
            this.startNPCChatter();
        }, delay);
    }

    simulateNPCReply() {
        const reactions = [
            "Lol nice", "I agree!", "Same here.", "Wait, really?", 
            "Cool!", "Haha", "GG", "Interesting..."
        ];
        const name = this.npcNames[Math.floor(Math.random() * this.npcNames.length)];
        const text = reactions[Math.floor(Math.random() * reactions.length)];
        this.addMessage(name, text, "npc");
    }
}
