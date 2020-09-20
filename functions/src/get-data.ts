import { APIGatewayProxyEvent, APIGatewayProxyCallback } from 'aws-lambda';
import axios from 'axios';

const isOnline = (slackId: string, apiKey: string | undefined) => {
  return axios
    .get(
      `https://slack.com/api/users.getPresence?token=${apiKey}&user=${slackId}`
    )
    .then((resp) => {
      return resp.data.presence === 'active' ? 'online' : 'offline';
    });
};

export const handler = async function (
  event: APIGatewayProxyEvent,
  _context: any,
  callback: APIGatewayProxyCallback
) {
  if (event.httpMethod === 'GET') {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const SLACKBOT_API_KEY = process.env.SLACKBOT_API_KEY;

    const participantRequest = axios
      .get(
        `https://api.airtable.com/v0/appqerg3j5MlRwEbk/Participants?api_key=${AIRTABLE_API_KEY}`
      )
      .then((resp) => resp.data);

    const projectRequest = await axios
      .get(
        `https://api.airtable.com/v0/appqerg3j5MlRwEbk/Projects?api_key=${AIRTABLE_API_KEY}`
      )
      .then((resp) => resp.data);

    const [participants, projects] = await Promise.all([
      participantRequest,
      projectRequest,
    ]);

    const newParticipants = await Promise.all(
      participants.records.map(async (p: any) => ({
        ...p,
        fields: {
          ...p.fields,
          Status: await isOnline(p.fields.Slack, SLACKBOT_API_KEY),
        },
      }))
    );

    callback(null, {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projects, participants: newParticipants }),
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
