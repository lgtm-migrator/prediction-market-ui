import React from 'react';
import { Popover, Divider, Grid, autocompleteClasses, Button } from '@material-ui/core';
import styled from '@emotion/styled';
import { theme } from '../../../theme';
import { Identicon } from '../../atoms/Identicon';
import { Typography } from '../../atoms/Typography';
import { Address } from '../../atoms/Address/Address';
import { CustomButton } from '../../atoms/Button';

const StyledGrid = styled(Grid)`
  padding: ${theme.spacing(2)};

  .header-container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`;

export interface ProfilePopoverProps {
  address: string;
  network: string;
  stablecoin: string | number;
  stablecoinSymbol: string;
  isOpen: boolean;
  actionText: string;
  anchorEl?: HTMLElement | null;
  onClose: () => void | Promise<void>;
  handleAction: () => void | Promise<void>;
}

export const ProfilePopover: React.FC<ProfilePopoverProps> = React.memo(
  ({
    address,
    network,
    isOpen,
    stablecoin,
    stablecoinSymbol,
    anchorEl,
    onClose,
    handleAction,
    actionText,
  }) => {
    const id = isOpen ? 'profile-popover' : undefined;
    return (
      <Popover
        id={id}
        open={isOpen}
        onClose={onClose}
        anchorEl={anchorEl}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <StyledGrid container direction="column" spacing={2}>
          <Grid item className="header-container">
            <Identicon alt={address} seed={address} type="tzKtCat" iconSize="xl" />
            <Address address={address} trim trimSize="medium" customStyle={{ width: 'auto' }} />
          </Grid>
          <Grid item>
            <Typography component="div" size="subtitle2" color="textSecondary">
              BALANCE
            </Typography>
            <Typography component="div" size="subtitle2">
              {stablecoin} {stablecoinSymbol}
            </Typography>
          </Grid>
          <Divider sx={{ marginTop: theme.spacing(2) }} />
          <Grid item>
            <CustomButton
              label={actionText}
              variant="outlined"
              size="medium"
              onClick={handleAction}
            />
          </Grid>
        </StyledGrid>
      </Popover>
    );
  },
);

ProfilePopover.displayName = 'ProfilePopover';
