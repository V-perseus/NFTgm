export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/wkich/hector-subgraph";
export const EPOCH_INTERVAL = 14400;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 1;

export const TOKEN_DECIMALS = 9;

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  43114: {
    MIM_ADDRESS: "0x130966628846bfd36ff31a822705796e8cb8c18d", // duplicate
    // USDC_ADDRESS: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    NFTGM_ADDRESS: "0x7bBEc6c4A36A5c5835c5D93428EAaD9c7259DE9f",
    STAKING_ADDRESS: "0x6398D155DF7C1c58edc63aC70CCbFc8F3df3B15F", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xd512E6E5205834404A2c3bC9456d4bc059665e3B", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "0xde698Aa043F4A9548AAc041434473E9e53991430",
    OLD_STAKING_HELPER_ADDRESS: "0xeF70DA041AecbA26187191630275ba7519F4Cc5e",
    OLD_SHEC_ADDRESS: "0x5Ee5fDd4077CaC9138BB854FAED2A40B2482cFd9",
    SNFTGM_ADDRESS: "0x35AcE2fbDE016EB1b87FaC8b8111b6f5A0923Ff2",   // NFTGM
    DISTRIBUTOR_ADDRESS: "0x41400d445359f5aD51650C76746C98D79174b2e3",
    BONDINGCALC_ADDRESS: "0x7e2bB8936D28F2d0f74188dc034237Df507e6DD2",
    BONDINGCALC_ADDRESS1: "0xA55A711Cf7adE1552f77A7127135C5156f75c83C",
    TREASURY_ADDRESS: "0xD037BeFDa33d1832BF3232182a97C0f459C589F6",
    REDEEM_HELPER_ADDRESS: "0xD4ec9b6E1325feb5d2E9dd4AFDF9187C9B717bC7",
    USDT_ADDRESS: "0xc7198437980c041c805a1edcba50c1ce5db95118",
    NFT_ADDRESS: "0x2c0f21c5Bf83505D0d4F3050017BAa25D1cA3Be3",
  },
};

export const messages = {
  please_connect: "Please connect your wallet to the Avalanche network to use Wonderland.",
  please_connect_wallet: "Please connect your wallet.",
  try_mint_more: (value: string) => `You're trying to mint more than the maximum payout available! The maximum mint payout is ${value} PAPA.`,
  before_minting: "Before minting, enter a value.",
  existing_mint:
      "You have an existing mint. Minting will reset your vesting period and forfeit any pending claimable rewards. We recommend claiming rewards first or using a fresh wallet. Do you still wish to proceed?",
  before_stake: "Before staking, enter a value.",
  before_unstake: "Before un staking, enter a value.",
  tx_successfully_send: "Your transaction was successful",
  balance_updated: "Your balance was successfully updated",
  nothing_to_claim: "You have nothing to claim",
  something_wrong: "Something went wrong",
  switch_to_fantom: "Switch to the Avalanche network?",
  slippage_too_small: "Slippage too small",
  slippage_too_big: "Slippage too big",
  balance_update_soon: "Your balance will be updated soon",
};
