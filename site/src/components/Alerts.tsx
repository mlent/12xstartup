import styled from '../styled';

export const SuccessMessage = styled('div')`
  border-radius: 8px;
  background-color: #eaff8f;
  padding: 12px 24px;
  color: #254000;
  font-size: 16px;

  code {
    display: inline;
    background-color: #bae637;
    color: #254000;
    padding: 2px 4px;
    border-radius: 8px;
  }
`;

export const ErrorMessage = styled('div')`
  border-radius: 8px;
  background-color: #ffe58f;
  color: #613400;
  font-size: 16px;
  padding: 12px 24px;
`;
