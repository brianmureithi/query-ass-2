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
    let localDataList = $('#local-data-list');
  
    // Clear previous data
    localDataList.empty();
  
    // Get local storage data
    let data = JSON.parse(localStorage.getItem('bookData'));
  
    // Check if data exists
    if (data && data.length > 0) {
      $.each(data, function(index, item) {
        // Create list item
        let li = $('<li>').css("margin-bottom","12px");
        let img = $('<img>').attr('src', item.image).appendTo(li);
        $('<h2>').text(item.title).appendTo(li);
        $('<p>').text(`Author: ${item.author}`).appendTo(li);
        $('<p>').text(`Year Published: ${item.year_published}`).appendTo(li);
        $('<p>').text(`Genre: ${item.genre}`).appendTo(li);
        $('<p>').text(`Pages: ${item.pages}`).appendTo(li);
        
  
        // Append list item to listview
        localDataList.append(li);
      });
    } else {
      // Display message if no data exists
      let li = $('<li>').text('No local data found');
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

/* Get cloud data */
let listLoaded = false;
function loadList() {
  // check if the list has already been loaded
  if (listLoaded) {
    return;
  }
   // When the cloud data page is shown, fetch the books data from the server
   fetch('http://localhost:5000/get_books')
   .then(response => response.json())
   .then(data => {
    listLoaded = true;
     if (data.length === 0) {
       $('#cloud-data-list').append($('<li>').text('No items found'));
     } else {
       // Clear the list before appending new data
       $('#cloud-data-list').empty();
       
       data.forEach(item => {
         var li = $('<li>').css("margin-bottom","12px");
         let img = $('<img>').attr('src', item.image).appendTo(li);
         $('<h2>').text('Title: ' + item.title).appendTo(li);
         $('<p>').text('Author: ' + item.author).appendTo(li);
         $('<p>').text('Year Published: ' + item.year_published).appendTo(li);
         $('<p>').text('Genre: ' + item.genre).appendTo(li);
         $('<p>').text('Pages: ' + item.pages).appendTo(li);
         $('#cloud-data-list').append(li);
       });
     }
     $('#cloud-data-list').listview('refresh');
   })
   .catch(error => alert(error.message));
}

$(document).on('pagebeforeshow', '#cloud-data', function() {
  loadList();

});




  
});
