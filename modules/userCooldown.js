var usersOnCooldown = [];
export default (userID) => {
	if (usersOnCooldown.includes(userID)) return true;
	usersOnCooldown.push(userID);
	setTimeout(() => {delete usersOnCooldown[usersOnCooldown.indexOf(userID)]}, 1000);
	return false;
};