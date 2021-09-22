const express = require('express');
const router = express.Router(); 
const AWS = require("aws-sdk"); // connecting w/ local dynamodb instance
const awsConfig = {
  region: "us-east-2", // points to local dynamodb instance 
  endpoint: "http://localhost:8000", //
};

AWS.config.update(awsConfig);

const dynamodb = new AWS.DynamoDB.DocumentClient(); // DocumentClient() class uses native JS objects to interface w/ dynamodb service object
const table = "Thoughts"; // table value is set here to Thoughts


// GET ALL the users thoughts
router.get('/users', (req, res) => {
  const params = {
    TableName: table
  };
  dynamodb.scan(params, (err, data) => { // Scan returns all items in the table
    if (err) {
      res.status(500).json(err); // an error occurred
    }else {
      res.json(data.Items)
    }
  });
});

// GET INDIVIDUAL user thoughts
router.get('/users/:username', (req, res) => {
  console.log(`Querying for thought(s) from ${req.params.username}.`);
  // defining query call to dynamodb. in order to obtain single user and their thoughts
  const params = {
    TableName: table,
    KeyConditionExpression: "#un = :user", // specifies the search criteria (similar to WHERE in SQL)
    ExpressionAttributeNames: { // using assigned alias (#un, #ca, #th) to represent attribute names
      "#un": "username",
      "#ca": "createdAt",
      "#th": "thought"
    },
    ExpressionAttributeValues: { // using the username selected by the user in the client to determine condition of the search (user decides which name to query)
      ":user": req.params.username
    },
    ProjectionExpression: "#th, #ca", // determines which attributes or columns will be returned (similar to SELECT in SQL)
    ScanIndexForward: false // boolean value. specifies order of sort key (default (true) is ascending). set to false b/c we want recent posts on top
  };
  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Query succeeded.");
      res.json(data.Items)
    }
  });
});// closes the route for router.get(users/:username)

// POST new USER at /api/users
router.post('/users', (req, res) => {
  const params = {
    TableName: table,
    Item: { // shit we're sending in the request body
      "username": req.body.username,
      "createdAt": Date.now(), // JS native
      "thought": req.body.thought
    }
  };
  dynamodb.put(params, (err, data) => { // database call, it is a PUT when using dynanamodb since we are adding to the Thoughts table
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
      res.json({"Added": JSON.stringify(data, null, 2)});
    }
  });
});

module.exports = router;