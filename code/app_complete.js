const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// Initialise our array of students with some names
let students = ['Carlie', 'Tony', 'Sam', 'Carl', 'Sherine', 'Lelani', 'Aidan', 'Jack', 'Mark', 'Rachel'];

// A simple function to return two random students as a string
// It is possible we'll get the same student twice
function randomPair() {
  let s1Ind = Math.floor(Math.random() * students.length);
  let s2Ind = Math.floor(Math.random() * students.length);
  return `${students[s1Ind]} ${students[s2Ind]}`;
}

// Callback function that will handle all of our server functions
const serverResponse = (req, res) => {

  // Get the http method, url, and headers from the request
  const {
    method,
    url,
    headers
  } = req;


  // handle the routes
  if (method === 'GET' && url === '/') {
    // Get request on '/'
    console.log('Getting a random pair of students');
    res.setHeader('Content-type', 'text/plain');
    res.end(randomPair());
  } else if (method === 'GET' && url === '/students') {
    // Get request on '/students'
    console.log("Getting a list of students");
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(students));
  } else if (method === 'POST' && url === '/students') {
    // Post request on '/students'
    console.log('Got a POST request on /students');
    res.setHeader('Content-type', 'applicaton/json');
  } else {
    // Invalid method or url
    console.log('Got an invalid method or route');
    res.statusCode = 404;
    res.setHeader('Content-type', 'text/plain');
    res.end('Route not found');
  }

  // Handle getting data from the client request (on POST)
  let data = []; // Used to collect chunks of data
  req.on('data', chunk => {
    // This event fires when we receive data in the request. The data comes in chunks
    // Only handle when we have the expected url
    if (url === '/students') {
      console.log(`Data chunk available: ${chunk}`);
      // We need to parse the chunk, or we will store it as a stream object
      data.push(JSON.parse(chunk));
    }
  });
  req.on('end', () => {
    // The end event signifies the end of the request, and therfore the end of the data stream 
    // We'll store any data we got from a post in our array, then send our response to the client
    // If we got data (for a post), add it to our array of students
    // In this case, we only expect to get a single chunk of data - just a student name to add to our array of students
    if (data.length > 0) {
      console.log('retrieved data', data[0]);
      students.push(data[0].name);
      // Send the updated list of students in the response with a 201 status
      res.statusCode = 201;
      res.end(JSON.stringify(students));
    }
  });
}

// When we create an http server, we will pass it a callback function that the routes for the server
const server = http.createServer(serverResponse);

// What is the third argument to the listen method on http server? When do you think it is called?
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});