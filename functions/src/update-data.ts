import { APIGatewayProxyEvent, APIGatewayProxyCallback } from 'aws-lambda';
// import axios from 'axios';

export const handler = async function (
  event: APIGatewayProxyEvent,
  _context: any,
  callback: APIGatewayProxyCallback
) {
  if (event.httpMethod === 'POST' && event.body) {
    const jsonBody = JSON.parse(event.body) as { message: string };

    /*
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const SLACKBOT_API_KEY = process.env.SLACKBOT_API_KEY;

    const participantRequest = axios
      .patch(
        `https://api.airtable.com/v0/appqerg3j5MlRwEbk/Participants?api_key=${AIRTABLE_API_KEY}`
      )
      .then((resp) => resp.data);
    */

    callback(null, {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...jsonBody,
      }),
    });
  } else {
    callback(null, {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        'Missing data in event body OR method not supported'
      ),
    });
  }
};
