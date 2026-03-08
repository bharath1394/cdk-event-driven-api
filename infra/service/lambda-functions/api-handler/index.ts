import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sns = new SNSClient({});

export const handler = async (event: any) => {
  const body = JSON.parse(event.body || '{}');
  const message = {
    requestId: event.requestContext.requestId,
    timestamp: new Date().toISOString(),
    data: body.data || 'Hello World',
  };

  await sns.send(new PublishCommand({
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: JSON.stringify(message),
  }));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Request published successfully',
      requestId: message.requestId,
    }),
  };
};
