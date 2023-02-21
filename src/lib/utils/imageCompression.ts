/**
 * Function scaling an image from a file input to specified dimensions
 * If the specified dimensions are not proportional to image dimensions the output image will be cropped at center
 *
 * @param file {File} Input file of a form
 * @param dimensions {{width: number, height: number}} Dimensions of the output image
 * @returns {Promise<Blob | null>} Promise resolving to a scale image or a null if provided an invalid file type
 * https://stackoverflow.com/a/72728396
 */
export async function scaleImageBeforeUpload(
	file: File,
	dimensions: { width: number; height: number }
): Promise<Blob | null> {
	// Ensure the file is an image
	if (!file.type.match(/image.*/)) {
		return null
	}

	const image = new Image()
	image.src = URL.createObjectURL(file)

	// Wait for image to load
	await new Promise<Event>((res) => (image.onload = res))
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d', { alpha: true })

	canvas.width = dimensions.width
	canvas.height = dimensions.height

	// Scale the image proportionally
	if (image.height <= image.width) {
		const scaleProportions = canvas.height / image.height
		const scaledWidth = scaleProportions * image.width
		context?.drawImage(image, (canvas.width - scaledWidth) / 2, 0, scaledWidth, canvas.height)
	} else {
		const scaleProportions = canvas.width / image.width
		const scaledHeight = scaleProportions * image.height
		context?.drawImage(image, 0, (canvas.height - scaledHeight) / 2, canvas.width, scaledHeight)
	}

	// Return the scaled image as a Blob
	return new Promise((res) => canvas.toBlob(res))
}
