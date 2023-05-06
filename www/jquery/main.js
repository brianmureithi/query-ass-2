$(document).ready(function() {

  $(document).on('click', '#menu-button', function() {
    $('#menu-items').toggle();
   
  });

  /* Camera function event listener */
  $(document).on('click', '#scan-button', function() {
    if (navigator.userAgent.match(/(android)/i)) {
      navigator.camera.getPicture(function(imageData) {
        // Process the QR code data here
        const decodedData = JSON.parse(atob(imageData));
        const bookData = {
          title: decodedData.title,
          author: decodedData.author,
          year_published: decodedData.year_published,
          pages: decodedData.pages,
          genre: decodedData.genre,
          image: decodedData.image
        };
        let storedData = JSON.parse(localStorage.getItem('bookData')) || [];
        storedData.push(bookData);
        localStorage.setItem('bookData', JSON.stringify(storedData));
        alert('Data stored successfully with status 200');
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
    } else {
      const data = prompt('Please enter the data object:');
      const bookData = JSON.parse(data);
      let storedData = JSON.parse(localStorage.getItem('bookData')) || [];
      storedData.push(bookData);
      localStorage.setItem('bookData', JSON.stringify(storedData));
      alert('Data stored successfully with status 200');
    }
  });

  /* Local storage  code */
  $(document).on('pagebeforeshow', '#local-data', function() {
    var localDataList = $('#local-data-list');
  
    // Clear previous data
    localDataList.empty();
  
    // Get local storage data
    var data = JSON.parse(localStorage.getItem('bookData'));
  
    // Check if data exists
    if (data && data.length > 0) {
      $.each(data, function(index, item) {
        // Create list item
        var li = $('<li>');
        var img = $('<img>').attr('src', item.image).appendTo(li);
        $('<h2>').text(item.title).appendTo(li);
        $('<p>').text(item.author).appendTo(li);
        $('<p>').text(item.year_published).appendTo(li);
        $('<p>').text(item.genre).appendTo(li);
        $('<p>').text(item.pages).appendTo(li);
  
        // Append list item to listview
        localDataList.append(li);
      });
    } else {
      // Display message if no data exists
      var li = $('<li>').text('No local data found');
      localDataList.append(li);
    }
  
    // Refresh listview
    localDataList.listview('refresh');
  });

  /* Upload data to cloud */

  // Bind a click event handler to the "Upload Data" button
$('#upload-data').on('click', function() {
  // Retrieve the array of book data from the local storage
  const bookData = JSON.parse(localStorage.getItem('bookData'));
  
  // Send a POST request to the server with the book data
  fetch('http://localhost:5000/submit-to-cloud', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ books: bookData })
  })
  .then(response => {
    if (response.ok) {
      // Clear the local storage if the upload is successful
      localStorage.removeItem('bookData');
      alert('Data uploaded to cloud successfully!');
    } else {
      alert('Data upload failed!');
      throw new Error('Failed to upload data');
    }
  })
  .catch(error => {
    console.error(error);
  });
});


  
});
