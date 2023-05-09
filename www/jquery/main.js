$(document).ready(function() {
  let baseUrl='http://localhost:5000/'

  $(document).on('click', '#menu-button', function() {
    $('#menu-items').toggle();
  
   
  });

  /* Camera function event listener */
  $(document).on('click', '#scan-button', function() {
    if (navigator.userAgent.match(/(android)/i)) {
    QRScanner.scan(function(result) {
      const decodedData = JSON.parse(atob(result));
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
        let img = $('<img>').attr('src', `../img/${item.image}`).appendTo(li);
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

 //event handler to the "Upload Data" button
$('#upload-data').on('click', function() {
  
  if (confirm('Uploading data to cloud will erase all local data. Are you sure?')) {
    // Retrieve the array of book data from the local storage
    const bookData = JSON.parse(localStorage.getItem('bookData'));
  
    // Send a POST request to the server with the book data
    fetch(`${baseUrl}submit-to-cloud`, {
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
  }
});

/* Get cloud data */

$(document).on('pagebeforeshow', '#cloud-data', function() {
 // When the cloud data page is shown, fetch the books data from the server
 $('#cloud-data-list').empty();
 const timestamp = new Date().getTime();
  const url = `${baseUrl}get_books?timestamp=${timestamp}`;
 fetch(url)
 .then(response => response.json())
 .then(data => {
  listLoaded = true;
   if (data.length === 0) {
    $('#cloud-data-list').empty();
     $('#cloud-data-list').append($('<li>').text('No items found'));
   } else {
     // Clear the list before appending new data
     $('#cloud-data-list').empty();
     
     data.forEach(item => {
       var li = $('<li>').css("margin-bottom","12px");
       let img = $('<img>').attr('src',  `../img/${item.image}`).appendTo(li);
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

});

// Event listener for deleting local data
$('#delete-local-data').on('click', function() {
  try {
    localStorage.clear();
    alert('Local data has been successfully deleted.');
    $('#menu-items').toggle();

  } catch(error) {
    alert('Error deleting local data: ' + error.message);
    $('#menu-items').toggle();
  }
});

// Event listener for deleting cloud data
$('#delete-cloud-data').on('click', function() {
  fetch(`${baseUrl}delete_cloud_data`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      alert('Cloud data has been successfully deleted.')
      $('#menu-items').toggle();
    } else {
      alert('Error deleting cloud data: ' + response.status + ' ' + response.statusText);
      $('#menu-items').toggle();
    }
  })
  .catch(error => alert('Error deleting cloud data: ' + error.message));
});




  
});
