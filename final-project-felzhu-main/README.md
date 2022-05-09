<h1>Fake Stack Overflow - Final</h1>

<h2>Repository Focus</h2>
<p>In this final repository, our focus is to develop a server using Node.js and leverage MongoDB as the back-end database. With Node.js, we can host both static and dynamic resources, creating interactive web applications. MongoDB was chosen as the preferred backend database due to its proven capabilities and our confidence in working with it. This final project builds upon the features developed in HW3, which also utilized MongoDB, while also introduces additional functionalities such as encryption, user creation, and session/cookie management. These enhancements further enrich the site's capabilities and provide a more comprehensive user experience.</p>

<p>This assignment serves as a culmination of your learning journey, encompassing concepts such as server-side programming, database management, front-end integration, and security measures. It is an opportunity to showcase your comprehensive understanding and practical application of these concepts in developing a robust and scalable web application.</p>

<h2>Tools used:</h2>
<ul>
    <li>
    <strong>MongoDB:</strong> MongoDB is a popular NoSQL database used for storing and retrieving data. It provides a flexible, scalable, and document-oriented approach to data storage. MongoDB works well with Node.js and is widely used in modern web application development. It allows you to store structured or unstructured data and provides powerful querying capabilities.
    </li>
    <li>
    <strong>Bcrypt:</strong> Bcrypt is a password hashing library used for securely storing user passwords. It provides a cryptographic hash function that converts passwords into irreversible, salted hashes. Bcrypt enhances security by making it computationally expensive to crack hashed passwords, protecting user credentials from potential breaches.
    </li>
    <li>
    <strong>Express.js:</strong> Express.js is a popular web application framework for Node.js. It provides a set of robust features and middleware that simplifies the process of building web applications. Express.js helps in handling routes, requests, and responses, making it easier to develop the server-side of your application.
    </li>
    <li>
    <strong>Nodemon:</strong> Nodemon is a utility tool that automatically restarts your server whenever changes are made to your code. It helps in the development process by saving you the effort of manually restarting the server after every code modification. Nodemon improves productivity and speeds up the development workflow.
    </li>
    <li>
    <strong>Axios:</strong> Axios is a popular JavaScript library used for making HTTP requests from the client-side of your application. It provides an easy-to-use API for sending asynchronous requests to the server and handling the responses. Axios simplifies the process of fetching data from external APIs or interacting with your own server-side endpoints.
    </li>
    <li>
    <strong>CORS:</strong> CORS stands for Cross-Origin Resource Sharing. It is a mechanism that allows web browsers to securely make requests to a different domain than the one the website originated from. CORS is important when your client-side code needs to communicate with a server hosted on a different domain. It enables the server to control which origins are allowed to access its resources, ensuring secure and controlled data exchange between different domains.
    </li>
</ul>

<h2>Pre-Setup</h2>
<p>This project uses MongoDB, Node.js, express, mongoose, nodemon, axios, cors, bcrypt, and no additional packages.
For the project to run you need to npm install all the packages mentioned in both the client and server directory.</p>


<h2>Server IP/Port</h2>
<p>Database Instance runs at <code>mongodb://127.0.0.1:27017/fake_so</code></p>
<p>Client Instance runs at <code>https://localhost:3000</code></p>
<p>Server Instance runs at <code>https://localhost:8000</code></p>

<h2>Startup</h2>
<p>Personally I run my server with <code>npx nodemon server.js</code> in the server directory. And client with <code>npm start</code> in the client directory. I open my database with <code>"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="c:\data\db"</code></p>
<p>After the instances are opened you would want to populate the database by navigating to the server directory and running the populate_db.js with the argument mongodb://127.0.0.1:27017/fake_so(<code>node populate_db.js mongodb://127.0.0.1:27017/fake_so</code>). This will populate the database for you. </p>

<h2>Populate Database</h2>
<p>You can alter the data that is generated with <code>populate_db.js</code> to your liking. If you wish to create your own custom data, you can use the following provided methods in the populate section of the code.</p>

<p><strong>userCreate(username, email, hashed password, register_date)</strong><br/>
username: String, REQUIRE <br/>
email: String, REQUIRE<br/>
hashed password: String (processed by bcrypt.hash), REQUIRE<br/>
reputation: Integer<br/>
register_date: Date objects<br/></p>

<p><strong>tagCreate(name, tag_by)</strong><br/>
name: String, REQUIRE<br/>
tag_by: User object, REQUIRE<br/></p>

<p><strong>commentCreate(text,comment_by)</strong><br/>
text: String, REQUIRE<br/>
comment_by: User object, REQUIRE<br/></p>

<p><strong>answerCreate(text, ans_by, ans_date_time, upvote, downvote, comment)</strong><br/>
text:String, REQUIRE<br/>
ans_by: User object, REQUIRE<br/>
ans_date_time: Date object<br/>
upvote: array of User objects<br/>
downvote: array of User objects<br/>
comment : array of Comment objects<br/>
</p>

<p><strong>questionCreate(title, summary, text, tags, answers, asked_by, ask_date_time, views, upvote, downvote, comment)</strong><br/>
title: String, REQUIRE<br/>
summary: String, REQUIRE<br/>
text: String, REQUIRE<br/>
tags: array of Tag objects, REQUIRE<br/>
answers: array of Answer objects<br/>
asked_by: User objects<br/>
ask_date_time: Date object<br/>
views: Integer<br/>
upvote: array of User objects<br/>
downvote: array of User objects<br/>
comment : array of Comment objects<br/></p>



<h2>Test Users</h2>
<p>You can test project with the following user:</p>

<p>
username: some1 <br/>
email: some1@gmail.com<br/>
password:123<br/>
reputation: 0<br/>

username: some2 <br/>
email: some2@gmail.com<br/>
password:1234<br/>
reputation: 100<br/>

username: some3 <br/>
email: some3@gmail.com<br/>
password:1235<br/>
reputation: 50<br/>

username: some4 <br/>
email: some4@gmail.com<br/>
password:1236<br/>
reputation: 101<br/>
</p>

<h2>UML Diagram</h2>
<p>The UML model describes the schema for all documents in the MongoDB database</p>
<img src="images/uml.PNG" alt="alt text">



<h2>Resources</h2>
<p>Here are some useful resources:</p>
<ul>
  <li><a href="https://www.mongodb.com/docs/">MongoDB Documentation</a></li>
  <li><a href="https://www.mongodb.com/docs/compass/current/">MongoDB Compass Documentation</a></li>
  <li><a href="https://expressjs.com/">Express.js Documentation</a></li>
  <li><a href="https://mongoosejs.com/docs/">Mongoose Documentation</a></li>
  <li><a href="https://nodemon.io/">Nodemon Documentation</a></li>
  <li><a href="https://axios-http.com/">Axios Documentation</a></li>
  <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">CORS Documentation</a></li>
  <li><a href="https://www.npmjs.com/package/bcrypt">Bcrypt Documentation</a></li>
</ul>

<p>You will find the detailed tasks and instructions in the provided PDF document.</p>


<h2>Assignment Navigation:</h2>
<li style="display: inline-block; margin-right: 20px;"><a href="previous_assignment_url">( Previous )</a></li>


