import React, { useState } from 'react';
import { Typography, Paper, Button, TextField } from '@material-ui/core';
import styled from '../styled';
import { SuccessMessage, ErrorMessage } from './Alerts';
import { SUBSCRIBER_COUNT } from '../constants';

let gtag: any;

if (typeof window !== 'undefined') {
  gtag = (window as any).gtag;
} else {
  gtag = () => {};
}

// TODO: Replace with dedicated form!

const YOUR_FORM_ID = '1377786';
const YOUR_FORM_URL = `https://app.convertkit.com/forms/${YOUR_FORM_ID}/subscriptions`;

const FormWrapper = styled(Paper)`
  padding: ${(p) => p.theme.spacing(3)}px ${(p) => p.theme.spacing(6)}px
    ${(p) => p.theme.spacing(6)}px;
`;

const Content = styled('p')`
  text-align: left;
  font-size: 1.4rem;
  margin: 2rem auto;

  a {
    border-bottom: 2px solid white;
  }

  a:focus {
    outline: blue;
  }
`;

const InnerFormWrapper = styled('form')`
  display: grid;
  grid-template-columns: 4fr 2fr;
  grid-row-gap: ${(p) => p.theme.spacing(1)}px;
  grid-column-gap: ${(p) => p.theme.spacing(1)}px;
  background-color: #635786;
  padding: ${(p) => p.theme.spacing(1)}px;
  border-radius: ${(p) => p.theme.custom.borderRadius.unit * 3}px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const InnerForm = () => {
  const [status, setStatus] = useState<string | null>(null);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData(e.target);

    try {
      data.append('fields[source]', document.referrer);
      const response = await fetch(YOUR_FORM_URL, {
        method: 'post',
        body: data,
        headers: {
          accept: 'application/json'
        }
      });

      const json = await response.json();

      if (json.status === 'success') {
        setStatus('SUCCESS');
        try {
          gtag('event', 'Subscribe', {
            event_category: 'Newsletter',
            event_label: 'Email Course'
          });
        } catch (err) {}
        return;
      }

      setStatus('ERROR');
    } catch (err) {
      setStatus('ERROR');
    }
  };

  return (
    <div>
      <InnerFormWrapper
        action={YOUR_FORM_URL}
        method="post"
        onSubmit={handleSubmit}
      >
        {status !== 'SUCCESS' && (
          <>
            <TextField
              label="Your email"
              name="email_address"
              placeholder="Your email address"
              variant="filled"
              InputProps={{
                disableUnderline: true,
                style: {
                  backgroundColor: 'white',
                  borderRadius: '8px'
                }
              }}
              required
              fullWidth
              type="email"
            />
            <Button
              size="large"
              style={{
                padding: '12px 24px',
                fontSize: '16px'
              }}
              color="primary"
              variant="contained"
              type="submit"
            >
              Get an invite
            </Button>
          </>
        )}
      </InnerFormWrapper>
      {status === 'SUCCESS' && (
        <SuccessMessage>
          Please check your inbox to confirm your subscription!
        </SuccessMessage>
      )}
      {status === 'ERROR' && (
        <ErrorMessage>
          There was an error trying to sign you up! Is your privacy browser
          extension possibly blocking the request to my newsletter provider? Try
          disabling it or signing up at{' '}
          <a href="https://bloggingfordevs.ck.page/signup" target="_blank">
            https://bloggingfordevs.ck.page/signup
          </a>
        </ErrorMessage>
      )}
    </div>
  );
};

export const SubscriptionForm = ({
  title,
  description
}: {
  title?: string;
  description?: React.ReactNode;
}) => {
  return (
    <FormWrapper>
      <Typography
        variant="h4"
        component="p"
        style={{ fontWeight: 700, marginTop: '12px' }}
      >
        {title || 'Get the "Blogging for Devs" free email course'}
      </Typography>
      <Content>
        {description || (
          <span>
            Whether you're just starting out, trying to revive an existing blog,
            or want to get past a plateau, this course and newsletter is for
            you.
            <br />
            <br />
            Join over {SUBSCRIBER_COUNT} developers growing their blogs now:
          </span>
        )}
      </Content>
      <InnerForm />
    </FormWrapper>
  );
};
