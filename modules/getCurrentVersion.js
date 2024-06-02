var currentVersion = 0;
export const getCurrentVersion = () => {
	return currentVersion.toString();
}
export const incrementCurrentVersion = () => {
	currentVersion += 1;
	if (currentVersion === 10) currentVersion = 0;
	return currentVersion.toString();
}