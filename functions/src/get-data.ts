import { APIGatewayProxyEvent, APIGatewayProxyCallback } from 'aws-lambda';
import axios from 'axios';

export const handler = async function (
  event: APIGatewayProxyEvent,
  _context: any,
  callback: APIGatewayProxyCallback
) {
  if (event.httpMethod === 'GET') {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

    const participants = await axios
      .get(
        `https://api.airtable.com/v0/appqerg3j5MlRwEbk/Participants?api_key=${AIRTABLE_API_KEY}`
      )
      .then((resp) => resp.data);

    const projects = await axios
      .get(
        `https://api.airtable.com/v0/appqerg3j5MlRwEbk/Projects?api_key=${AIRTABLE_API_KEY}`
      )
      .then((resp) => resp.data);

    callback(null, {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projects, participants }),
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
