export const ACHIEVEMENTS = {
    // Mission based
    FIRST_DELIVERY: {
        name: 'First Delivery',
        description: 'Complete your first mission.',
        reward: { xp: 50, money: 500 },
        check: (stats, gameState) => stats.missionsCompleted >= 1
    },
    SEASONED_DRIVER: {
        name: 'Seasoned Driver',
        description: 'Complete 10 missions.',
        reward: { xp: 200, money: 2000 },
        check: (stats, gameState) => stats.missionsCompleted >= 10
    },
    MASTER_HAULER: {
        name: 'Master Hauler',
        description: 'Complete 50 missions.',
        reward: { xp: 1000, money: 10000 },
        check: (stats, gameState) => stats.missionsCompleted >= 50
    },

    // Money based
    GETTING_STARTED: {
        name: 'Getting Started',
        description: 'Earn a total of $20,000.',
        reward: { xp: 100 },
        check: (stats, gameState) => stats.totalEarnings >= 20000
    },
    BIG_SPENDER: {
        name: 'Big Spender',
        description: 'Own at least 3 vehicles.',
        reward: { xp: 150 },
        check: (stats, gameState) => gameState.ownedVehicles.length >= 3
    },
    TYCOON: {
        name: 'Tycoon',
        description: 'Earn a total of $100,000.',
        reward: { xp: 500, money: 25000 },
        check: (stats, gameState) => stats.totalEarnings >= 100000
    },

    // Exploration based
    WORLD_TRAVELER: {
        name: 'World Traveler',
        description: 'Visit 5 different countries.',
        reward: { xp: 300 },
        check: (stats, gameState) => new Set(stats.distinctCountriesVisited).size >= 5
    },
    GLOBETROTTER: {
        name: 'Globetrotter',
        description: 'Visit 15 different countries.',
        reward: { xp: 1000, money: 5000 },
        check: (stats, gameState) => new Set(stats.distinctCountriesVisited).size >= 15
    },

    // Progression based
    LEVEL_5: {
        name: 'Level 5',
        description: 'Reach level 5.',
        reward: { xp: 100, money: 1000 },
        check: (stats, gameState) => gameState.level >= 5
    },
    LEVEL_10: {
        name: 'Level 10',
        description: 'Reach level 10.',
        reward: { xp: 500, money: 5000 },
        check: (stats, gameState) => gameState.level >= 10
    },
    COMPANY_FOUNDER: {
        name: 'Company Founder',
        description: 'Start your own company.',
        reward: { xp: 1000, money: 10000 },
        check: (stats, gameState) => gameState.companyStarted
    }
};

