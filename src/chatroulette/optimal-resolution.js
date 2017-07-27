// given a width and a height, calculate the most optimal width and height from a max value
// while still keeping the aspect ratio

export default function(width, height, max) {
	const heightToWidthRatio = width / height;
	const widthToHeightRatio = height / width;
		
	if(width > height) {
		return {
			width: heightToWidthRatio * max,
			height: max
		};
	} else if(height > width) {
		return {
			width: max,
			height: widthToHeightRatio * max
		};
	}
	
	return { width, height };
};