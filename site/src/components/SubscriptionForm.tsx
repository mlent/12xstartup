import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import styled from '../styled';
import { SuccessMessage, ErrorMessage } from './Alerts';

let gtag: any;

if (typeof window !== 'undefined') {
  gtag = (window as any).gtag;
} else {
  gtag = () => {};
}

const YOUR_FORM_ID = '1683915';
const YOUR_FORM_URL = `https://app.convertkit.com/forms/${YOUR_FORM_ID}/subscriptions`;

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
            event_category: 'Mailing List'
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
      {status !== 'SUCCESS' && (
        <InnerFormWrapper
          action={YOUR_FORM_URL}
          method="post"
          onSubmit={handleSubmit}
        >
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
        </InnerFormWrapper>
      )}
      {status === 'SUCCESS' && (
        <SuccessMessage>
          <strong>Almost there!</strong> Please check your inbox to confirm your
          email address.
        </SuccessMessage>
      )}
      {status === 'ERROR' && (
        <ErrorMessage>
          There was an error trying to sign you up! Is your privacy browser
          extension possibly blocking the request to my newsletter provider? Try
          disabling it just this once.
        </ErrorMessage>
      )}
    </div>
  );
};
