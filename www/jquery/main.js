$(document).ready(function() {
  console.log("Brian in the building")
  $(document).on('click', '#menu-button', function() {
    $('#menu-items').toggle();
  });

  /* Camera function event listener */
  $(document).on('click', '#scan-button', function() {
    navigator.camera.getPicture(function(imageData) {
      // Process the QR code data here
      $.post("http://localhost:5000/store-image-data", { imageData: imageData }, function(data, status) {
          console.log("Data: " + data + "\nStatus: " + status);
      });
    }, function(err) {
      console.log(err);
    }, {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      cameraDirection: Camera.Direction.BACK,
      targetWidth: 1000,
      targetHeight: 1000,
      saveToPhotoAlbum: false,
      correctOrientation: true
    });
  });
});
