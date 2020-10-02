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

const StyledLink = styled('a')`
  border-bottom: 1px solid #fff;
  color: #fff;
`;

const Content = styled('div')`
  max-width: 500px;
  margin: ${(p) => p.theme.spacing(8)}px auto;
`;

const Shoutout = styled('div')`
  text-align: center;
  margin-bottom: ${(p) => p.theme.spacing(6)}px;

  a {
    display: flex;
    align-items: center;
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

  &:hover .participant-image:before {
    filter: grayscale(0) contrast(1) brightness(1.1);
    transition: filter 0.2s linear;
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

const Status = styled<'div', { status: 'online' | 'offline' }>('div')`
  display: inline-block;
  margin-left: ${(p) => p.theme.spacing(1.5)}px;
  height: 12px;
  width: 12px;
  background-color: ${(p) =>
    p.status === 'online' ? 'rgba(51, 217, 178, 1)' : '#DDD'};
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
  position: absolute;
  bottom: ${(p) => p.theme.spacing(4)}px;

  a {
    color: ${(p) => p.theme.palette.primary.main};
    font-weight: ${(p) => p.theme.typography.fontWeightBold};
  }
`;

const ParticipantStatusMessage = styled('p')`
  font-style: italic;
`;

const Img = styled<'div', { src: string }>('div')`
  height: 260px;
  max-width: 100%;
  background-color: #ddd;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-image: url(${(p) => p.src});
    filter: grayscale(100%) contrast(1.5) brightness(1.05);
    transition: filter 0.2s linear;
  }
`;

const ParticipantImage = ({ src }: { src: string }) => {
  return <Img className="participant-image" src={src} />;
};

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
  grid-template-columns: 2fr 2fr 1fr 1fr;
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
  grid-template-columns: 1fr 1fr 1fr 1fr;
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

type IResponse = {
  data: {
    projects: IAirtableProjectResponse;
    participants: IAirtableParticipantResponse;
  };
};

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
    Slack: string;
    Status: 'online' | 'offline';
    Message: string;
    Location: string;
    'Current Project': string[]; // ID of Project
  };
  createdTime: string;
};

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
  } | null>({ projects: [], participants: [{} as any, {}, {}, {}] });

  useEffect(() => {
    const fetchData = async () => {
      // Allow running site locally without access to locally running Netlify function
      const useFixture =
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost' &&
        !new URLSearchParams(window.location.search).get('live');

      const result: IResponse = await axios.get(
        useFixture ? '/fixture.json' : '/.netlify/functions/get-data'
      );
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
              Four people each build open startups every month for a year ✌️
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
        <Subheading>Current Status</Subheading>
        {data && (
          <>
            <Grid>
              {data.participants.map((p) => (
                <Participant key={p.fields?.Name}>
                  <ParticipantImage src={p.fields?.Image} />
                  <ParticipantInner>
                    {p.fields && (
                      <>
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
                                p.fields?.Name
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
                        {p.fields['Last Updated'] && (
                          <LastUpdated>
                            {capitalize(
                              formatDistance(
                                new Date(p.fields['Last Updated']),
                                new Date()
                              )
                            )}{' '}
                            ago
                          </LastUpdated>
                        )}
                      </>
                    )}
                  </ParticipantInner>
                </Participant>
              ))}
            </Grid>
            <Shoutout>
              <Typography variant="body1" component="p" paragraph>
                Plus our trusty advisor and resident lurker{' '}
                <ShoutoutImg src="/images/dom.jpeg" alt="Dominic Monn" />{' '}
                <StyledLink href="https://twitter.com/dqmonn" target="_blank">
                  Dominic Monn
                </StyledLink>
                .
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
                    {p.fields.Status === 'Making' ? '🛠 Making' : '🎉 Shipped'}
                  </MakingStatus>
                </ProjectGrid>
              ))}
            </ProjectWrapper>
            <Typography
              variant="body1"
              component="p"
              paragraph
              style={{ textAlign: 'center' }}
            >
              Have an idea for us? You can{' '}
              <StyledLink
                href="https://airtable.com/shrEHSP7akhszHnao"
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault();
                  const left = window.screen.width / 3;
                  const top = 100;
                  window.open(
                    'https://airtable.com/shrEHSP7akhszHnao',
                    'request-startup',
                    `width=400,height=700,top=${top},left=${left}`
                  );
                }}
                target="_blank"
              >
                request a startup
              </StyledLink>
              .
            </Typography>
          </>
        )}
        <Content>
          <Subheading>Latest Writeups</Subheading>
          <Typography variant="body1" component="p" paragraph>
            <StyledLink
              href="https://dpashutskii.com/year-of-making"
              target="_blank"
            >
              A Year of Making
            </StyledLink>
            <br />
            by Dmitrii Pashutskii (Sept 28)
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            <StyledLink
              href="https://www.dylanwilson.net/12x-startup-four-makers-building-open-startups-for-a-year/"
              target="_blank"
            >
              12x Startup - Four makers building open startups for a year
            </StyledLink>
            <br />
            by Dylan Wilson (Sept 20)
          </Typography>
	  <Typography variant="body1" component="p" paragraph>
            <StyledLink
              href="https://twitter.com/ToheebDotCom/status/1311747021305503746"
              target="_blank"
            >
              One Hell of a Ride
            </StyledLink>
            <br />
            by Toheeb Ogunbiyi (Oct 1)
          </Typography>
        </Content>
        <Content>
          <Subheading>What is this?</Subheading>
          <Typography variant="body1" component="p" paragraph>
            12x Startup is a cohort of 4 motivated makers, each building a new
            startup every month for the next year.
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            (In theory that makes 48 startups shipped by November 2021!)
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            The goal is to try lots of things, ship quickly, learn from our own
            projects (and each others') and to build in public.
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            And above all else, we want to find a few projects in the process
            worth focusing on long-term.
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            Like many others, we were inspired by Pieter Levels'{' '}
            <StyledLink
              href="https://levels.io/12-startups-12-months/"
              target="_blank"
              rel="noopener"
            >
              12 Startups in 12 Months
            </StyledLink>
            . After realizing that a few people planned to do it on their own,
            we banded together to form a serial maker Voltron!
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            The name is also a bit of a joke about 10x developers. Instead of
            being 12x better at building startups, we're each just going to
            build 12 of them until we're good at it.
          </Typography>
          <Typography variant="body1" component="p" paragraph>
            To follow along, you can find us on Twitter or join the mailing list
            to get notified about our first livestreamed demo:
          </Typography>
          <InnerForm />
          <br />
          <Typography variant="body1" component="p" paragraph>
            Wish us luck (and perseverance)!
          </Typography>
        </Content>
        <Content>
          <Subheading>Reach us</Subheading>
          <Typography
            variant="body1"
            component="p"
            paragraph
            style={{ textAlign: 'center' }}
          >
            Email us at{' '}
            <StyledLink href="mailto:hey@12xstartup.com">
              hey@12xstartup.com
            </StyledLink>
            .
          </Typography>
        </Content>
      </Layout>
    </div>
  );
}
