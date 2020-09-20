import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { capitalize } from 'lodash';
import { Tooltip, Paper, Typography } from '@material-ui/core';
import { formatDistance } from 'date-fns';
import { graphql, useStaticQuery } from 'gatsby';
import { SiteMetadata } from '../types/SiteMetadata';
import { MapPin, Twitter, ExternalLink } from 'react-feather';
import styled from '../styled';
import Layout, { Wrapper } from '../layouts/Layout';
import { SEO } from '../components/SEO';
import { InnerForm } from '../components/SubscriptionForm';

type Data = {
  site: {
    siteMetadata: SiteMetadata;
  };
};

const Shoutout = styled('div')`
  text-align: center;
  margin-bottom: ${(p) => p.theme.spacing(6)}px;

  a {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #fff;
    display: inline-block;
  }

  img {
    filter: grayscale(100%) contrast(1.5) brightness(1.05);
    transition: filter 0.2s linear;
  }

  &:hover {
    img {
      filter: grayscale(0) contrast(1) brightness(1.1);
      transition: filter 0.2s linear;
    }
  }
`;

const ShoutoutImg = styled('img')`
  width: 24px;
  height: 24px;
  border: 1px solid #fff;
  position: relative;
  top: 6px;
  display: inline-block;
  margin-left: ${(p) => p.theme.spacing(0.5)}px;
  border-radius: 100%;
`;

const Title = styled('h1')`
  font-family: 'Pattaya', sans-serif;
  display: block;
  text-align: center;
  color: #fff;
  letter-spacing: 3px;
  font-size: 96px;
  line-height: 120px;
  margin-bottom: ${(p) => p.theme.spacing(3)}px;

  @media (max-width: 500px) {
    font-size: 48px;
    line-height: 56px;
  }
`;

const FormWrapper = styled('div')`
  margin: ${(p) => p.theme.spacing(6)}px auto;
  max-width: 500px;
`;

const Subheading = styled('h2')`
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1px;
  font-size: 16px;
`;

const Participant = styled(Paper)`
  margin-bottom: ${(p) => p.theme.spacing(1)}px;
  overflow: hidden;

  img {
    filter: grayscale(100%) contrast(1.5) brightness(1.05);
    transition: filter 0.2s linear;
  }

  &:hover {
    img {
      filter: grayscale(0) contrast(1) brightness(1.1);
      transition: filter 0.2s linear;
    }
  }
`;

const Status = styled<'div', { status: 'online' | 'offline' }>('div')`
  display: inline-block;
  margin-left: ${(p) => p.theme.spacing(1.5)}px;
  height: 12px;
  width: 12px;
  background-color: ${(p) =>
    p.status === 'online' ? 'rgba(51, 217, 178, 1)' : '#8c8c8c'};
  border-radius: 100%;
  ${(p) =>
    p.status === 'online' &&
    `
		background: rgba(51, 217, 178, 1);
    box-shadow: 0 0 0 0 rgba(51, 217, 178, 1);
    transform: scale(1);
    animation: pulse 2s infinite;
  `}
`;

const ParticipantLocation = styled('p')`
  color: ${(p) => p.theme.palette.grey.A200};
  margin-top: ${(p) => p.theme.spacing(1)}px;
  margin-bottom: ${(p) => p.theme.spacing(3)}px;
`;

const ParticipantInner = styled('div')`
  position: relative;
  height: 240px;
  padding: ${(p) => p.theme.spacing(1)}px ${(p) => p.theme.spacing(3)}px;
  max-width: 100%;

  @media (max-width: 700px) {
    padding: ${(p) => p.theme.spacing(2)}px;
  }
`;

const ParticipantCurrentProject = styled('p')`
  a {
    color: ${(p) => p.theme.palette.primary.main};
    font-weight: ${(p) => p.theme.typography.fontWeightBold};
  }
`;

const ParticipantStatusMessage = styled('p')`
  font-style: italic;
`;

const ParticipantImage = styled('img')`
  max-width: 100%;
`;

const ParticipantName = styled('p')`
  position: relative;
  display: flex;
  align-items: center;
  font-weight: ${(p) => p.theme.typography.fontWeightBold};
  margin-bottom: 0;
`;

const TwitterWrapper = styled('a')`
  display: inline-block;
  padding-top: ${(p) => p.theme.spacing(2.3)}px;
  color: #91d5ff;
`;

const ParticipantNameWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LastUpdated = styled('p')`
  position: absolute;
  bottom: ${(p) => p.theme.spacing(1)}px;
  color: ${(p) => p.theme.palette.grey.A200};
  font-weight: ${(p) => p.theme.typography.fontWeightBold};
  font-size: 12px;
`;

const ProjectGrid = styled('div')`
  display: grid;
  grid-template-areas: 'project-link project-description project-participant project-status';
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  grid-column-gap: ${(p) => p.theme.spacing(1)}px;
  grid-row-gap: ${(p) => p.theme.spacing(2)}px;
  padding: ${(p) => p.theme.spacing(1)}px ${(p) => p.theme.spacing(3)}px;

  @media (max-width: 600px) {
    grid-row-gap: ${(p) => p.theme.spacing(1)}px;
    padding: ${(p) => p.theme.spacing(1)}px;
    grid-template-areas:
      'project-link project-participant'
      'project-description project-description'
      'project-status project-status';
    grid-template-columns: 2fr 1fr;
  }
`;

const ProjectWrapper = styled(Paper)`
  max-width: 900px;
  padding: ${(p) => p.theme.spacing(1)}px;
  margin: ${(p) => p.theme.spacing(4)}px auto;

  @media (max-width: 900px) {
    margin: ${(p) => p.theme.spacing(4)}px ${(p) => p.theme.spacing(1)}px;
  }
`;

const Grid = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: ${(p) => p.theme.spacing(1)}px;
  grid-row-gap: ${(p) => p.theme.spacing(1)}px;
  margin: ${(p) => p.theme.spacing(4)}px auto;
  padding: ${(p) => p.theme.spacing(1)}px;
  max-width: 1200px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

type IAirtableProjectResponse = {
  records: IAirtableProject[];
};

type IAirtableProject = {
  id: string;
  fields: {
    Name: string;
    Participants: string[]; // ID of participant
    Color: string;
    Description: string;
    Status: 'Making' | 'Finished';
    URL: string;
  };
  createdTime: string;
};

type IAirtableParticipantResponse = {
  records: IAirtableParticipant[];
};

type IAirtableParticipant = {
  id: string;
  fields: {
    'Last Updated': string;
    Name: string;
    Image: string;
    Twitter: string;
    Status: 'online' | 'offline';
    Message: string;
    Location: string;
    'Current Project': string[]; // ID of Project
  };
  createdTime: string;
};

type IParticipant = {
  name: string;
  img: string;
  lastUpdated: Date;
  twitter: string;
  status: 'online' | 'offline';
  location: string;
  statusMessage: string;
  currentProjectName: string;
  currentProjectUrl: string;
};

type IParticipantHash = {
  [name: string]: IParticipant;
};

const PARTICIPANT_PEOPLE: IParticipantHash = {
  monica: {
    name: 'Monica Lent',
    lastUpdated: new Date(),
    img: '/images/monica.jpg',
    twitter: 'monicalent',
    status: 'offline',
    location: 'Berlin, Germany',
    statusMessage: 'Creating the 12xstartup.com homepage',
    currentProjectName: '12xStartup',
    currentProjectUrl: 'https://12xstartup.com'
  },
  swyx: {
    name: 'Swyx',
    lastUpdated: new Date(),
    img: '/images/swyx.jpeg',
    twitter: 'swyx',
    status: 'online',
    location: 'Singapore',
    statusMessage: 'Putting his ideas into a google doc',
    currentProjectName: 'Unknown',
    currentProjectUrl: '#'
  },
  toheeb: {
    name: 'Toheeb Ogunbiyi',
    lastUpdated: new Date(),
    img: '/images/toheeb.jpg',
    twitter: 'toheebdotcom',
    status: 'online',
    location: 'Abuja, Nigeria',
    statusMessage: 'Putting his ideas into a google doc',
    currentProjectName: 'Unknown',
    currentProjectUrl: '#'
  },
  dylan: {
    name: 'Dylan Wilson',
    lastUpdated: new Date(),
    img: '/images/dylan.jpeg',
    twitter: 'dylanwilson80',
    status: 'online',
    location: 'Brisbane, Australia',
    statusMessage: 'Putting his ideas into a google doc',
    currentProjectName: 'Unknown',
    currentProjectUrl: '#'
  },
  dmitrii: {
    name: 'Dmitrii Pashutskii',
    lastUpdated: new Date(),
    img: '/images/dmitrii.jpeg',
    twitter: 'guar47',
    status: 'online',
    location: 'Bali, Indonesia',
    statusMessage: 'Putting his ideas into a google doc',
    currentProjectName: 'Unknown',
    currentProjectUrl: '#'
  }
};

const PARTICIPANTS: IParticipant[] = Object.values(PARTICIPANT_PEOPLE);

type IProjects = {
  icon: string;
  iconColor: string;
  projectName: string;
  projectUrl: string;
  projectDescription: string;
  participant: IParticipant;
  status: 'making' | 'finished';
};

const PROJECTS: IProjects[] = [
  {
    icon: '',
    iconColor: '#FF4D4F',
    projectName: 'Loopybit',
    projectUrl: '#',
    projectDescription: 'This is my project',
    participant: PARTICIPANT_PEOPLE.monica,
    status: 'making'
  },
  {
    icon: '',
    iconColor: '#faad14',
    projectName: 'Funkytown',
    projectUrl: '#',
    projectDescription: 'This is my project',
    participant: PARTICIPANT_PEOPLE.dylan,
    status: 'making'
  },
  {
    icon: '',
    iconColor: '#722ed1',
    projectName: 'Happyfeet',
    projectUrl: '#',
    projectDescription: 'This is my project',
    participant: PARTICIPANT_PEOPLE.toheeb,
    status: 'making'
  },
  {
    icon: '',
    iconColor: '#fa541c',
    projectName: 'Jollybear',
    projectUrl: '#',
    projectDescription: 'This is my project',
    participant: PARTICIPANT_PEOPLE.dmitrii,
    status: 'making'
  },
  {
    icon: '',
    iconColor: '#52c41a',
    projectName: 'Sillypants',
    projectUrl: '#',
    projectDescription: 'This is my project',
    participant: PARTICIPANT_PEOPLE.swyx,
    status: 'making'
  }
];

const ProjectLink = styled('a')`
  grid-area: project-link;
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.palette.primary.main};
  font-weight: ${(p) => p.theme.typography.fontWeightBold};
  width: 60%;
`;

const ProjectDescription = styled('div')`
  grid-area: project-description;
`;

const ProjectParticipantName = styled('div')`
  grid-area: project-participant;
`;

const ProjectIcon = styled<'div', { iconColor: string; icon: string }>('div')`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  margin-right: ${(p) => p.theme.spacing(1)}px;
  display: inline-block;
  background: url(${(p) => p.icon});
  background-color: ${(p) => p.iconColor};
`;

const MakingStatus = styled<'div', { status: 'Making' | 'Finished' }>('div')`
  grid-area: project-status;
  display: inline-block;
  background-color: ${(p) => (p.status === 'Making' ? '#ffe58f' : '#eaff8f')};
  text-align: center;
  color: ${(p) => (p.status === 'Making' ? '#ad6800' : '#5b8c00')};
  padding: ${(p) => p.theme.spacing(1)}px ${(p) => p.theme.spacing(3)}px;
  font-weight: ${(p) => p.theme.typography.fontWeightBold};
  border-radius: ${(p) => p.theme.custom.borderRadius.unit * 2}px;
`;

const toFirstName = (name: string | undefined) =>
  name ? name.split(' ')[0] : null;

const ForProject = ({
  currentProjectId,
  allProjects
}: {
  currentProjectId: string;
  allProjects: IAirtableProject[];
}) => {
  const currentProject = allProjects.find((p) => p.id === currentProjectId);
  if (!currentProject) {
    return null;
  }
  return (
    <ParticipantCurrentProject>
      for{' '}
      <a href={currentProject.fields.URL} target="_blank" rel="noopener">
        {currentProject.fields.Name}
      </a>
    </ParticipantCurrentProject>
  );
};

export default function () {
  const siteData: Data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          siteUrl
          description
        }
      }
    }
  `);

  const siteMetadata = siteData.site.siteMetadata;

  const [data, setData] = useState<{
    projects: IAirtableProject[];
    participants: IAirtableParticipant[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/.netlify/functions/get-data');
      const r = {
        projects: result.data.projects.records,
        participants: result.data.participants.records
      };
      setData(r);
      console.log(r);
    };

    fetchData();
  }, []);

  return (
    <div>
      <SEO
        seoTitle={siteMetadata.title}
        seoDescription={siteMetadata.description}
        title={siteMetadata.title}
        description={siteMetadata.description}
        siteUrl={siteMetadata.siteUrl}
      />
      <Layout>
        <Wrapper style={{ marginBottom: 0 }}>
          <Title>12x Startup</Title>
          <div style={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              component="p"
              paragraph
              style={{ fontWeight: 700 }}
            >
              Five people build open startups every month for a year ✌️
            </Typography>
            <FormWrapper>
              <Typography variant="body1" component="p" paragraph>
                Join our <strong>monthly livestreamed demo days</strong>,<br />
                sign up for an invite! No spam.
              </Typography>
              <InnerForm />
            </FormWrapper>
          </div>
        </Wrapper>
        <Subheading>Meet the crew</Subheading>
        {data && (
          <>
            <Grid>
              {data.participants.map((p) => (
                <Participant key={p.fields.Name}>
                  <ParticipantImage src={p.fields.Image} alt={p.fields.Name} />
                  <ParticipantInner key={p.fields.Name}>
                    <ParticipantNameWrapper>
                      <ParticipantName>
                        {p.fields.Name}{' '}
                        <Tooltip
                          placement="top"
                          title={
                            p.fields.Status == 'online'
                              ? `${toFirstName(
                                  p.fields.Name
                                )} is working right now!`
                              : `${toFirstName(
                                  p.fields.Name
                                )} is doing other things`
                          }
                        >
                          <Status status={p.fields.Status} />
                        </Tooltip>
                      </ParticipantName>
                      <Tooltip
                        placement="top"
                        title={`See what ${toFirstName(
                          p.fields.Name
                        )} is making on Twitter`}
                      >
                        <TwitterWrapper
                          href={`https://twitter.com/${p.fields.Twitter}`}
                          target="_blank"
                          title={`See what ${toFirstName(
                            p.fields.Name
                          )} is making on Twitter`}
                        >
                          <Twitter size={18} />
                        </TwitterWrapper>
                      </Tooltip>
                    </ParticipantNameWrapper>
                    <ParticipantLocation>
                      <MapPin size={12} /> {p.fields.Location}
                    </ParticipantLocation>
                    <ParticipantStatusMessage>
                      "{p.fields.Message}"
                    </ParticipantStatusMessage>
                    {p.fields['Current Project'] && (
                      <ForProject
                        currentProjectId={p.fields['Current Project'][0]}
                        allProjects={data.projects}
                      />
                    )}
                    <LastUpdated>
                      {capitalize(
                        formatDistance(
                          new Date(p.fields['Last Updated']),
                          new Date()
                        )
                      )}{' '}
                      ago
                    </LastUpdated>
                  </ParticipantInner>
                </Participant>
              ))}
            </Grid>
            <Shoutout>
              <Typography variant="body1" component="p" paragraph>
                Plus our trusty advisor and resident lurker{' '}
                <ShoutoutImg src="/images/dom.jpeg" alt="Dominic Monn" />{' '}
                <a href="https://twitter.com/dqmonn">Dominic Monn</a>.
              </Typography>
            </Shoutout>
            <Subheading>What we're building now</Subheading>
            <ProjectWrapper>
              {data.projects.map((p) => (
                <ProjectGrid key={p.fields.Name}>
                  <ProjectLink
                    href={p.fields.URL}
                    target="_blank"
                    rel="noopener"
                  >
                    <ProjectIcon
                      iconColor={p.fields.Color}
                      icon={p.fields.URL}
                    />{' '}
                    {p.fields.Name}&nbsp;
                    <ExternalLink size={16} style={{ opacity: 0.5 }} />
                  </ProjectLink>
                  <ProjectDescription>
                    {p.fields.Description}
                  </ProjectDescription>
                  <ProjectParticipantName>
                    {toFirstName(
                      data.participants.find((participant) =>
                        p.fields.Participants.includes(participant.id)
                      )?.fields.Name
                    )}
                  </ProjectParticipantName>
                  <MakingStatus status={p.fields.Status}>
                    {p.fields.Status}
                  </MakingStatus>
                </ProjectGrid>
              ))}
            </ProjectWrapper>
          </>
        )}
        <Subheading>What is this?</Subheading>
        <Subheading>Reach us</Subheading>
      </Layout>
    </div>
  );
}
