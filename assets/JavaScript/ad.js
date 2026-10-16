fetch("assets/texts/ads.txt")
	.then((response) => response.text())
	.then((text) => {
		const images = text.trim().split(/\r?\n/);
		const randomImage = images[Math.floor(Math.random() * images.length)];
		document.getElementById("ad").innerHTML = randomImage;
	});
