const AWS = require("aws-sdk");
const fs = require('fs');

AWS.config.update({
  region: "us-east-2",
  endpoint: "http://localhost:8000"
});

// using DocumentClient() class to  create the dynamodb service object
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

console.log("Importing thoughts into DynamoDB. Please wait.");

const allUsers = JSON.parse(fs.readFileSync('./server/seed/users.json', 'utf8'));

// loop through alLUsers and create params
allUsers.forEach(user => {
  const params = {
    TableName: "Thoughts",
    Item: {
      "username": user.username,
      "createdAt": user.createdAt,
      "thought": user.thought
    }
  }
  // make call to database w/ service interface object, dynamodb
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded:", user.username);
    }
  });

});

