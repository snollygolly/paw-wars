const upgrades = {
	"Bookkeeping Retainer": function bookkeepingRetainer(currentLife) {
		currentLife.upgrades.bookkeeping = {
			enabled: true
		};

		return currentLife.upgrades;
	}
};

module.exports.addUpgrade = function addUpgrade(upgradeName, currentLife) {
	if (upgrades.hasOwnProperty(upgradeName)) {
		return upgrades[upgradeName](currentLife);
	}
};
