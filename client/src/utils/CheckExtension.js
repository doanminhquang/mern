export const getExtension = (filename) => {
  var parts = filename.split(".");
  return parts[parts.length - 1];
};

export const isImage = (file) => {
  if (file.size > 0) {
    var ext = getExtension(file.name);
    switch (ext.toLowerCase()) {
      case "jpg":
      case "jpeg":
      case "gif":
      case "png":
      case "tiff":
      case "bmp":
      case "pjp":
      case "pjpeg":
        return true;
      default:
        return false;
    }
  }
  return false;
};
