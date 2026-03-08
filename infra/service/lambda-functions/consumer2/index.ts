import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamo = new DynamoDBClient({});

export const handler = async (event: any) => {
  console.log('Consumer 2 processing:', JSON.stringify(event, null, 2));

  const promises = event.Records.map((record: any) => {
    const snsMessage = JSON.parse(record.body);
    const requestBody = JSON.parse(snsMessage.Message);

    return dynamo.send(new PutItemCommand({
      TableName: process.env.ORDER_TABLE_NAME,
      Item: {
        requestId: { S: requestBody.requestId },
        processedBy: { S: 'Consumer2' },
        timestamp: { S: requestBody.timestamp },
        data: { S: requestBody.data || 'no-data' },
        receivedAt: { S: new Date().toISOString() },
      },
    }));
  });

  await Promise.all(promises);
  console.log('Consumer 2 wrote', promises.length, 'records');
  return { processed: promises.length, queue: 'Consumer2' };
};
