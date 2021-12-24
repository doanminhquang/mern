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

export const isVideo = (file) => {
  if (file.size > 0) {
    var ext = getExtension(file.name);
    switch (ext.toLowerCase()) {
      case "ogm":
      case "wmv":
      case "mpg":
      case "webm":
      case "ogv":
      case "mov":
      case "asx":
      case "mpeg":
      case "mp4":
      case "m4v":
      case "avi":
        return true;
      default:
        return false;
    }
  }
  return false;
};
