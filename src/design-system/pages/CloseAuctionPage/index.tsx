import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Grid, Button, Paper, Box } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { CreateQuestion } from '../../../interfaces';
import { closeAuction } from '../../../contracts/Market';
import { MainPage } from '../MainPage';
import { Typography } from '../../atoms/Typography';
import { useWallet } from '../../../wallet/hooks';

type CloseAuctionPageProps = WithTranslation;

const OuterDivStyled = styled.div`
  flex-grow: 1;
`;

const PaperStyled = styled(Paper)`
  padding: 2em;
`;
interface PagePathParams {
  questionHash: string;
}

const CloseAuctionPageComponent: React.FC<CloseAuctionPageProps> = ({ t }) => {
  const [result, setResult] = useState('');
  const { wallet } = useWallet();
  const { questionHash } = useParams<PagePathParams>();
  const {
    state: { question },
  } = useLocation<CreateQuestion>();

  const onSubmit = async () => {
    const response = await closeAuction(questionHash);
    setResult(response);
  };

  return (
    <MainPage title={t('closeAuctionPage')}>
      <OuterDivStyled>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PaperStyled>
              <Typography size="caption">{t('question')}</Typography>
              <Typography size="h6">{question}</Typography>
            </PaperStyled>
          </Grid>
          <Grid container direction="row-reverse">
            <Grid item xs={6} sm={3}>
              <Button
                type="submit"
                variant="outlined"
                size="large"
                onClick={onSubmit}
                disabled={!wallet.pkh}
              >
                {t(!wallet.pkh ? 'connectWalletContinue' : 'submit')}
              </Button>
            </Grid>
            {result && (
              <Grid item xs={6} sm={3}>
                <Box>
                  <Button
                    href={`https://better-call.dev/carthagenet/opg/${result}/content`}
                    target="_blank"
                    variant="outlined"
                    size="large"
                  >
                    {t('result')}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      </OuterDivStyled>
    </MainPage>
  );
};

export const CloseAuctionPage = withTranslation(['common'])(CloseAuctionPageComponent);
