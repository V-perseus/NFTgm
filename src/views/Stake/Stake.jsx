import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { trim } from "../../helpers";
import { changeApproval, changeStake, changeForfeit, changeClaim} from "../../slices/StakeThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";
import WarmUp from "../../components/warm-up/warm-up";
import { TrainRounded } from "@material-ui/icons";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Stake() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const view1 = 0;
  const [quantity, setQuantity] = useState("");
  const [oldquantity, setOldQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const oldfiveDayRate = useSelector(state => {
    return state.app.old_fiveDayRate;
  });
  const hecBalance = useSelector(state => {
    return state.account.balances && state.account.balances.hec;
  });
  const shecBalance = useSelector(state => {
    return state.account.balances && state.account.balances.shec;
  });
  const oldshecBalance = useSelector(state => {
    return state.account.balances && state.account.balances.oldshec;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.hecStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.hecUnstake;
  });
  const oldunstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.oldhecUnstake;
  });
  const isNftHolder = useSelector(state => {
    return state.account.staking && state.account.staking.isHolder;
  });

  const isNftHolder_presale = useSelector(state => {
    return state.account.staking && state.account.staking.isNFTHolder;
  });

  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const oldstakingRebase = useSelector(state => {
    return state.app.old_stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const currentEpochNumber = useSelector(state => {
    return state.app.epochNumber;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const warmup = useSelector(state => {
    return state.app.warmupPeriod;
  })

  const boostAPY = useSelector(state => {
    return state.app.boostAPY;
  })

  const boostROI = useSelector(state => {
    return state.app.boostROI;
  })

  const fiveDayBoostRate = useSelector(state => {
    return state.app.fiveDayBoostRate;
  })

  const warmUpAmount = useSelector(state => {
    return state.account.warmup && state.account.warmup.warmUpAmount;
  });
  const depositAmount = useSelector(state => {
    return state.account.warmup && state.account.warmup.depositAmount;
  });
  const expiry = useSelector(state => {
    return state.account.warmup && state.account.warmup.expiryEpochNumber;
  });
  const warmupRebaseTime = expiry - currentEpochNumber;


  const setMax = () => {
    if (view === 0) {
      setQuantity(hecBalance);
    } else {
      setQuantity(shecBalance);
    }
  };
  const setOldMax = () => {
    setOldQuantity(oldshecBalance);
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async (action, isOld) => {
    // eslint-disable-next-line no-restricted-globals
    let value, unstakedVal;
    if (isOld) {
      value = oldquantity;
      unstakedVal = oldshecBalance;
    } else {
      value = quantity;
      unstakedVal = shecBalance;
    }
    if (isNaN(value) || value === 0 || value === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(value, "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(hecBalance, "gwei"))) {
      return dispatch(error("You cannot stake more than your NFTGM balance."));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(unstakedVal, "gwei"))) {
      return dispatch(error("You cannot unstake more than your sNFTGM balance."));
    }
    await dispatch(
      changeStake({
        address,
        action,
        value: value.toString(),
        provider,
        networkID: chainID,
        callback: () => (isOld ? setOldQuantity("") : setQuantity("")),
        isOld: isOld,
        warmupPeriod: warmup,
      }),
    );
  };

  const onFofeit = async() => {
    await dispatch(changeForfeit({ address, provider, networkID: chainID }));
  };

  const onClaim = async() => {
    await dispatch(changeClaim({ address, provider, networkID: chainID }));
  }

  const hasAllowance = useCallback(
    token => {
      if (token === "hec") return stakeAllowance > 0;
      if (token === "shec") return unstakeAllowance > 0;
      if (token === "oldshec") return oldunstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [shecBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const oldtrimmedBalance = Number(
    [oldshecBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );

  const trimmedWarmUpAmount = Number(
    [warmUpAmount]
      .filter(Boolean)
      .map(amount => Number(amount))
      .reduce((a, b) => a + b, 0),
  );

  // const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const trimmedStakingAPY = stakingAPY > 100000000 ? parseFloat(stakingAPY * 100 ) : trim(stakingAPY * 100, 3);
  const trimmedStakingBoostAPY = boostAPY > 100000000 ? parseFloat(boostAPY * 100 ) : trim(boostAPY * 100, 3);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const boostROIPercentage = trim(boostROI * 100, 4);
  const oldstakingRebasePercentage = trim(oldstakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);
  const nextRewardBoostValue = trim((boostROIPercentage / 100) * trimmedBalance, 4);
  const oldnextRewardValue = trim((oldstakingRebasePercentage / 100) * oldtrimmedBalance, 4);

  console.log('debug warm amount', trimmedWarmUpAmount)
  return (
    <>
    <div class="stake">
      {trimmedWarmUpAmount > 0 && (
          <WarmUp
            depositAmount={depositAmount}
            trimmedWarmUpAmount={trimmedWarmUpAmount}
            warmupRebaseTime={warmupRebaseTime}
            pendingTransactions={pendingTransactions}
            onClaim={onClaim}
            onFofeit={onFofeit}
          />
      )}
      <div id="stake-view" className="stakeView">
        <Zoom in={true} onEntered={() => setZoomed(true)}>
          <Paper className={`hec-card`}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <div className="card-header">
                  <Typography variant="h5">Single Stake v2(3, 3)</Typography>
                  <RebaseTimer />
                </div>
              </Grid>

              <Grid item>
                <div className="stake-top-metrics">
                  <Grid container spacing={2} alignItems="flex-end" className="squaresLine">
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <div className="stake-apy">
                        <Typography variant="h5" color="textSecondary">
                          APY
                        </Typography>
                        <Typography variant="h4" style={{"word-break":"break-all", "white-space":"break-spaces"}}>
                          
                           {! isNftHolder_presale  ? new Intl.NumberFormat("en-US").format("383025.8") : new Intl.NumberFormat("en-US").format("766051.6")}%
                          
                            {/* { isNftHolder_presale ? "766,051.6%" :"383,025.8%"  } */}
                        </Typography>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <div className="stake-tvl">
                        <Typography variant="h5" color="textSecondary">
                          Total Value Deposited
                        </Typography>
                        <Typography variant="h4">
                         -
                        </Typography>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <div className="stake-index">
                        <Typography variant="h5" color="textSecondary">
                          VIP Pass
                        </Typography>
                        <Typography variant="h4">
                          {isNftHolder_presale ? <img  style={{ width: 24, height: 24, marginBottom: -6, marginRight: 5 }} src="checked.png" /> : <img  style={{ width: 24, height: 24, marginBottom: -6, marginRight: 5 }} src="cross.png" />}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Grid>

              <div className="staking-area">
                {!address ? (
                  <div className="stake-wallet-notification">
                    <div className="wallet-menu" id="wallet-menu">
                      {modalButton}
                    </div>
                    <Typography variant="h6">Connect your wallet to stake NFTGM</Typography>
                  </div>
                ) : (
                  <>
                    <Box className="stake-action-area">
                      <Tabs
                        key={String(zoomed)}
                        centered
                        value={view}
                        textColor="primary"
                        indicatorColor="primary"
                        className="stake-tab-buttons"
                        onChange={changeView}
                        aria-label="stake tabs"
                      >
                        <Tab label="Stake" {...a11yProps(0)} />
                        <Tab label="Unstake" {...a11yProps(1)} />
                      </Tabs>

                      <Box className="stake-action-row " display="flex" alignItems="center">
                        {address && !isAllowanceDataLoading ? (
                          (!hasAllowance("hec") && view === 0) || (!hasAllowance("shec") && view === 1) ? (
                            <Box className="help-text">
                              <Typography variant="body1" className="stake-note" color="textSecondary">
                                {view === 0 ? (
                                  <>
                                    First time staking <b>NFTGM</b>?
                                    <br />
                                    Please approve NFTGM Dao to use your <b>NFTGM</b> for staking.
                                  </>
                                ) : (
                                  <>
                                    First time unstaking <b>sNFTGM</b>?
                                    <br />
                                    Please approve NFTGM Dao to use your <b>sNFTGM</b> for unstaking.
                                  </>
                                )}
                              </Typography>
                            </Box>
                          ) 
                          : (
                            <FormControl className="hec-input" variant="outlined" color="primary">
                              <InputLabel htmlFor="amount-input"></InputLabel>
                              <OutlinedInput
                                id="amount-input"
                                type="number"
                                placeholder="Enter an amount"
                                className="stake-input"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                labelWidth={0}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Button variant="text" onClick={setMax} color="inherit">
                                      Max
                                    </Button>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                          )
                          
                        ) : (
                          <Skeleton width="150px" />
                        )}

                        <TabPanel value={view} index={0} className="stake-tab-panel">
                          {isAllowanceDataLoading ? (
                            <Skeleton />
                          ) : address && hasAllowance("hec") ? (
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              // disabled={isPendingTxn(pendingTransactions, "staking")}
                              disabled={true}
                              onClick={() => {
                                onChangeStake("stake", false);
                              }}
                            >
                              {txnButtonText(pendingTransactions, "Coming Soon", "Coming Soon")}
                            </Button>
                          ) : (
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                              onClick={() => {
                                onSeekApproval("hec");
                              }}
                            >
                              {txnButtonText(pendingTransactions, "approve_staking", "Approve")}
                            </Button>
                          )}
                        </TabPanel>
                        <TabPanel value={view} index={1} className="stake-tab-panel">
                          {isAllowanceDataLoading ? (
                            <Skeleton />
                          ) : address && hasAllowance("shec") ? (
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "unstaking")}
                              onClick={() => {
                                onChangeStake("unstake", false);
                              }}
                            >
                              {txnButtonText(pendingTransactions, "unstaking", "Unstake NFTGM")}
                            </Button>
                          ) : (
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              // disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                              disabled={TrainRounded}
                              onClick={() => {
                                onSeekApproval("shec");
                              }}
                            >
                              {txnButtonText(pendingTransactions, "approve_unstaking", "Coming Soon")}
                            </Button>
                          )}
                        </TabPanel>
                      </Box>
                    </Box>

                    <div className={`stake-user-data`}>
                      <div className="data-row">
                        <Typography variant="body1">Your Balance</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{trim(hecBalance, 4)} NFTGM</>}
                        </Typography>
                      </div>

                      <div className="data-row">
                        <Typography variant="body1">Your Staked Balance</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{trimmedBalance} sNFTGM</>}
                        </Typography>
                      </div>

                      <div className="data-row">
                        <Typography variant="body1">Next Reward Amount</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{ !isNftHolder ? nextRewardValue : nextRewardBoostValue} sNFTGM</>}
                        </Typography>
                      </div>

                      <div className="data-row">
                        <Typography variant="body1">Next Reward Yield</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{ !isNftHolder ? stakingRebasePercentage : boostROIPercentage}%</>}
                        </Typography>
                      </div>
                      
                      <div className="data-row">
                        <Typography variant="body1">ROI (5-Day Rate)</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{ !isNftHolder ? trim(fiveDayRate * 100, 4) : trim(fiveDayBoostRate * 100, 4) }%</>}
                        </Typography>
                      </div>

                      <div className="data-row">
                        <Typography variant="body1">VIP Pass Holder</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{ isNftHolder_presale ? "Yes" : "No" }</>}
                        </Typography>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Grid>
          </Paper>
        </Zoom>
      </div>
      {address && oldshecBalance > 0.0001 && (
        <div id="stake-view">
          <Zoom in={true} onEntered={() => setZoomed(true)}>
            <Paper className={`hec-card`}>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <div className="card-header">
                    <Typography variant="h5">Single Stake v1 (3, 3)</Typography>
                  </div>
                </Grid>

                <div className="staking-area">
                  {!address ? (
                    <div className="stake-wallet-notification">
                      <div className="wallet-menu" id="wallet-menu">
                        {modalButton}
                      </div>
                      <Typography variant="h6">Connect your wallet to stake NFTGM</Typography>
                    </div>
                  ) : (
                    <>
                      <Box className="stake-action-area">
                        <Typography variant="body1" className="stake-note" color="textSecondary">
                          Staking has been upgraded, please unstake from the old staking contract and stake to the new
                          staking contract for a better ROI
                        </Typography>
                        <Box className="stake-action-row " display="flex" alignItems="center">
                          {address && !isAllowanceDataLoading ? (
                            !hasAllowance("oldshec") ? (
                              <Box className="help-text">
                                <Typography variant="body1" className="stake-note" color="textSecondary">
                                  <>
                                    First time unstaking <b>sNFTGM</b>?
                                    <br />
                                    Please approve NFTGM Dao to use your <b>sNFTGM</b> for unstaking.
                                  </>
                                </Typography>
                              </Box>
                            ) : (
                              <FormControl className="hec-input" variant="outlined" color="primary">
                                <InputLabel htmlFor="amount-input"></InputLabel>
                                <OutlinedInput
                                  id="amount-old-input"
                                  type="number"
                                  placeholder="Enter an amount"
                                  className="stake-input"
                                  value={oldquantity}
                                  onChange={e => setOldQuantity(e.target.value)}
                                  labelWidth={0}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <Button variant="text" onClick={setOldMax} color="inherit">
                                        Max
                                      </Button>
                                    </InputAdornment>
                                  }
                                />
                              </FormControl>
                            )
                          ) : (
                            <Skeleton width="150px" />
                          )}

                          <TabPanel value={view1} index={0} className="stake-tab-panel">
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && hasAllowance("oldshec") ? (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "unstaking")}
                                onClick={() => {
                                  onChangeStake("unstake", true);
                                }}
                              >
                                {txnButtonText(pendingTransactions, "unstaking", "Unstake NFTGM")}
                              </Button>
                            ) : (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                                onClick={() => {
                                  onSeekApproval("oldshec");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                              </Button>
                            )}
                          </TabPanel>
                        </Box>
                      </Box>

                      <div className={`stake-user-data`}>
                        <div className="data-row">
                          <Typography variant="body1">Your Staked Balance</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{oldtrimmedBalance} sNFTGM</>}
                          </Typography>
                        </div>

                        <div className="data-row">
                          <Typography variant="body1">Next Reward Amount</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{oldnextRewardValue} sNFTGM</>}
                          </Typography>
                        </div>

                        <div className="data-row">
                          <Typography variant="body1">Next Reward Yield</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{oldstakingRebasePercentage}%</>}
                          </Typography>
                        </div>

                        <div className="data-row">
                          <Typography variant="body1">ROI (5-Day Rate)</Typography>
                          <Typography variant="body1">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{trim(oldfiveDayRate * 100, 4)}%</>}
                          </Typography>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Grid>
            </Paper>
          </Zoom>
        </div>
      )}
    </div>
    </>
  );
}

export default Stake;