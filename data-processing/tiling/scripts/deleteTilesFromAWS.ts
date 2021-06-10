const fs = require("fs");
const { S3Client } = require("@aws-sdk/client-s3");


// // Set the AWS region
// const REGION = "us-east-1";

// // Create S3 service object
// const s3 = new S3Client({
//   region: REGION,
//   accessKeyId: '09DRV25F1FYR5FP2BKG2',
//   secretAccessKey: 'Ash36TxONdLfSvPMx5PBSpML2SHK6ehdhlun9KVW',
// });

// console.log(s3);

// const run = async () => {
//   try {
//     const data = await s3.send(new ListBucketsCommand({}));
//     console.log("Success", data.Buckets);
//   } catch (err) {
//     console.log("Error", err);
//   }
// };
// run();
