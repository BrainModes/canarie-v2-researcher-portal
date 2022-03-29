idleLogout = () => {
	let t, u;
	window.onload = resetTimer;
	window.onmousemove = resetTimer;
	window.onmousedown = resetTimer; // catches touchscreen presses as well
	window.ontouchstart = resetTimer; // catches touchscreen swipes as well
	window.onclick = resetTimer; // catches touchpad clicks as well
	window.onkeypress = resetTimer;
	window.addEventListener("scroll", resetTimer, true); // improved; see comments

	function yourFunction() {
		// your function for too long inactivity goes here
		console.log("comfirming");
		countdownLogout();
	}

	function logout() {
		console.log("logging out");
	}

	function resetTimer() {
		console.log("reset timer!");
		clearTimeout(t);
		clearTimeout(u);
		t = setTimeout(yourFunction, 10000); // time is in milliseconds
	}

	function countdownLogout() {
		console.log("countdown logout");
		clearTimeout(u);
		u = setTimeout(logout, 3000); // time is in milliseconds
	}
};
