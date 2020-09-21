import { APIGatewayProxyEvent, APIGatewayProxyCallback } from 'aws-lambda';
import * as querystring from 'querystring';
import { WebClient } from '@slack/web-api';
import axios from 'axios';

// TODO: Create shared type between client and functions

type IAirtableParticipant = {
  id: string;
  fields: {
    'Last Updated': string;
    Name: string;
    Image: string;
    Twitter: string;
    Status: 'online' | 'offline';
    Slack: string;
    Message: string;
    Location: string;
    'Current Project': string[]; // ID of Project
  };
  createdTime: string;
};

type ISlackWebhook = {
  user_id: string;
  channel_id: string;
  text: string;
};

export const handler = async function (
  event: APIGatewayProxyEvent,
  _context: any,
  callback: APIGatewayProxyCallback
) {
  if (event.httpMethod === 'POST' && event.body) {
    const SLACKBOT_API_KEY = process.env.SLACKBOT_API_KEY;
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

    const jsonBody = querystring.parse(event.body) as ISlackWebhook;
    const client = new WebClient(SLACKBOT_API_KEY);

    console.log(jsonBody);

    const participants = await axios
      .get<{ records: IAirtableParticipant[] }>(
        `https://api.airtable.com/v0/appqerg3j5MlRwEbk/Participants?api_key=${AIRTABLE_API_KEY}`
      )
      .then((resp) => resp.data.records);

    const record = participants.find(
      (p) => p.fields.Slack === jsonBody.user_id
    );

    if (!record) {
      callback(null, {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Participant is not in Airtable' }),
      });
      return;
    }

    const newMessage = jsonBody.text.replace('+', ' ');

    // Update status in Airtable
    try {
      await axios.patch(
        `https://api.airtable.com/v0/appqerg3j5MlRwEbk/Participants?api_key=${AIRTABLE_API_KEY}`,
        {
          records: [
            {
              id: record.id,
              fields: {
                Message: newMessage,
              },
            },
          ],
        }
      );

      // Post a status message in the channel
      await client.chat
        .postMessage({
          channel: jsonBody.channel_id,
          text: `✨ ${record.fields.Name}'s status has been updated to: "${newMessage}"`,
        })
        .catch((err) => {
          console.log(`Slack error occurred:`, err);
        });

      callback(null, {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'OK' }),
      });
    } catch (err) {
      callback(null, {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesage: err }),
      });
    }
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
