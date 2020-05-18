export function Mask(imageData) {
  // make all pixels opaque 100%
  var nPixels = imageData.data.length;
  for (var i = 3; i < nPixels; i += 4) {
    // if (imageData.data[i] > 0) {
      imageData.data[i] = 255;
    // }
  }
}