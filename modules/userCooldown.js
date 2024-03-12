var usersOnCooldown = [];
export const IsUserIDOnCooldown = (userID) => {
    if (usersOnCooldown.includes(userID)) return true;
    usersOnCooldown.push(userID);
    setTimeout(() => {delete usersOnCooldown[usersOnCooldown.indexOf(userID)]}, 1000);
    return false;
};