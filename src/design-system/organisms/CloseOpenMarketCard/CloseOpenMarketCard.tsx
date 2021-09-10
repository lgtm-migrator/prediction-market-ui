import * as React from 'react';
import { Card, CardContent, useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useWallet } from '@tezos-contrib/react-wallet-provider';
import styled from '@emotion/styled';
import { useToasts } from 'react-toast-notifications';
import { MarketStateType } from '../../../interfaces';
import { closeAuction, resolveMarket } from '../../../contracts/Market';
import { logError } from '../../../logger/logger';
import Button from '../../atoms/Button';
import { Typography } from '../../atoms/Typography';
import { ResolveMarketModal } from '../ResolveMarketModal';
import { getMarketLocalStorage } from '../../../utils/misc';

export interface CloseOpenMarketProps {
  marketId: string;
  marketPhase: MarketStateType;
  adjudicator?: string;
  winningPrediction?: string;
  isParticipant?: boolean;
}

const StyledCard = styled(Card)`
  margin-bottom: 1.5rem;
  padding: 1rem;
  padding-bottom: 0.5rem;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
export const CloseOpenMarketCard: React.FC<CloseOpenMarketProps> = ({
  adjudicator,
  winningPrediction,
  marketPhase,
  marketId,
  isParticipant = false,
}) => {
  const { addToast } = useToasts();
  const [closeMarketId, setCloseMarketId] = React.useState('');
  const theme = useTheme();
  const handleClose = () => setCloseMarketId('');
  const { activeAccount } = useWallet();
  const { t } = useTranslation('common');

  const handleCloseAuction = React.useCallback(
    async (id: string) => {
      if (activeAccount?.address && id) {
        try {
          await closeAuction(id, isParticipant);
          getMarketLocalStorage(true, marketId, marketPhase, 'true');
          addToast(t('txSubmitted'), {
            appearance: 'success',
            autoDismiss: true,
          });
        } catch (error) {
          logError(error);
          const errorText = error?.data?.[1]?.with?.string || error?.description || t('txFailed');
          addToast(errorText, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }
    },
    [activeAccount?.address, addToast, marketId, marketPhase, t],
  );
  const handleResolveMarket = React.useCallback(
    async (values: any) => {
      if (activeAccount?.address && closeMarketId) {
        try {
          await resolveMarket(closeMarketId, values.outcome);
          setCloseMarketId('');
          getMarketLocalStorage(true, marketId, marketPhase, 'true');
          addToast(t('txSubmitted'), {
            appearance: 'success',
            autoDismiss: true,
          });
        } catch (error) {
          logError(error);
          const errorText = error?.data?.[1]?.with?.string || error?.description || t('txFailed');
          addToast(errorText, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }
    },
    [activeAccount?.address, addToast, closeMarketId, marketId, marketPhase, t],
  );

  return marketPhase === MarketStateType.marketBootstrapped &&
    adjudicator !== activeAccount?.address &&
    !winningPrediction ? (
    <></>
  ) : (
    <StyledCard>
      <ResolveMarketModal
        open={!!closeMarketId}
        handleClose={handleClose}
        handleSubmit={handleResolveMarket}
      />
      <CardContent>
        {marketPhase === 'auction' && (
          <Typography marginBottom="1.5rem" size="14px">
            {t('closeAuction')}
          </Typography>
        )}
        {winningPrediction && (
          <StyledDiv>
            <Typography>{t('resolution')}</Typography>
            <Typography
              color={
                winningPrediction === 'yes' ? theme.palette.success.main : theme.palette.error.main
              }
            >
              {winningPrediction.charAt(0).toUpperCase() + winningPrediction.slice(1)}
            </Typography>
          </StyledDiv>
        )}
        {!winningPrediction && marketPhase === 'auction' && (
          <Button
            fullWidth
            label={t('openMarketToTrade')}
            onClick={() => handleCloseAuction(marketId)}
          />
        )}
        {!winningPrediction &&
          adjudicator === activeAccount?.address &&
          marketPhase === 'market' && (
            <Button fullWidth label={t('closeMarket')} onClick={() => setCloseMarketId(marketId)} />
          )}
      </CardContent>
    </StyledCard>
  );
};
