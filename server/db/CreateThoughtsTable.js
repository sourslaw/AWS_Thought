const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-east-2"
  // endpoint: "http://localhost:8000" // removed this endpoint to deploy to AWS
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const params = {
  TableName : "Thoughts",
  KeySchema: [      // where the partion key and sort keys are defined
    { AttributeName: "username", KeyType: "HASH"},  // Partition key
    { AttributeName: "createdAt", KeyType: "RANGE" }  // Sort key
  ],
  AttributeDefinitions: [       // defines attributes we've used for the hash and range keys
    { AttributeName: "username", AttributeType: "S" }, // data type must be assigned to declared attributes. S is string, N is number
    { AttributeName: "createdAt", AttributeType: "N" }
  ],
  ProvisionedThroughput: {       
    ReadCapacityUnits: 10, 
    WriteCapacityUnits: 10
  }
};

// using the params object to make a call to the DynamoDB instance and creating a table
dynamodb.createTable(params, (err, data) => {
  if (err) {
      console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
      console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});