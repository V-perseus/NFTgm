import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Box, Fade, Grid, Paper, Typography, Button, SvgIcon, Popper, Divider, Link, Slide } from "@material-ui/core";
import VipHeader from "./VipHeader";
import "./vipCheck.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as CaretDownIcon } from "../../assets/icons/caret-down.svg";
function VipCheck({ theme }) {

  const dispatch = useDispatch();
  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const isNftHolder_presale = useSelector(state => {
    return state.account.staking && state.account.staking.isNFTHolder;
  });

  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const goVip = () => {
    window.open('/vip', "_self")
  }
  const goMint = () => {
    window.open('https://vip.nftgamingdao.com/')
  }
  if (isConnected && isNftHolder_presale) {
    buttonText = "Access Granted";
    clickFunc = goVip;
  }
  if (isConnected && !isNftHolder_presale) {
    buttonText = "NO VIP Pass";
    clickFunc = goMint;
  }
  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = "In progress";
    clickFunc = handleClick;
  }

  const open = Boolean(anchorEl);
  const id = open ? "hec-popper-pending" : undefined;

  const primaryColor = theme === "light" ? "#49A1F2" : "#F8CC82";
  const buttonStyles =
    "pending-txn-container" + (isHovering && pendingTransactions.length > 0 ? " hovered-button" : "");

  const getEtherscanUrl = txnHash => {
    return chainID === 4 ? "https://rinkeby.etherscan.io/tx/" + txnHash : "https://snowtrace.io/tx/" + txnHash;
  };

  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(null);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container id="vipCheckView-view" className="vipCheckView popupS">
        <Backdrop open={true}>
          <Fade in={true}>
            <Paper className="hec-card hec-modal">
              <VipHeader />
              <Box direction="row" className="bond-price-data-row squaresLine">
                <div className="bond-price-data">
                  <h1>
                    <span class="ava-col"> Restricted to VIP Pass Holders</span>
                  </h1>
                  <div class="card-img">
                    <img class="card_moving" src="images/card_test.png" />
                  </div>
                  <div class="left">
                    <h2 class="f-t">NFT VIP Pass</h2>
                    <p class="f-p">◦ Exclusive access to VIP token presale</p>
                    <p class="f-p">◦ 2x Standard APY - Massive 766,051.6% APY</p>
                    <p class="f-p">◦ Priority access to P2E Node Sale and all future protocol releases</p>
                    <p class="f-p">◦ Access to Node Cluster Management Program</p>
                    <p class="f-p">◦ Voting power in the governance system </p>
                  </div>
                </div>

              </Box>

              <div class="vip-button-area">
                <Button
                  className="vip-button"
                  variant="contained"
                  color="secondary"
                  size="large"
                  style={pendingTransactions.length > 0 ? { color: primaryColor } : {}}
                  onClick={clickFunc}
                  onMouseOver={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  key={1}
                >
                  {buttonText}
                  {pendingTransactions.length > 0 && (
                    <Slide direction="left" in={isHovering} {...{ timeout: 333 }}>
                      <SvgIcon className="caret-down" component={CaretDownIcon} htmlColor={primaryColor} />
                    </Slide>
                  )}
                </Button>
                <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end" transition>
                  {({ TransitionProps }) => {
                    return (
                      <Fade {...TransitionProps} timeout={100}>
                        <Paper className="hec-menu" elevation={1}>
                          {pendingTransactions.map((x, i) => (
                            <Box key={i} fullWidth>
                              <Link key={x.txnHash} href={getEtherscanUrl(x.txnHash)} target="_blank" rel="noreferrer">
                                <Button size="large" variant="contained" color="secondary" fullWidth>
                                  <Typography align="left">
                                    {x.text} <SvgIcon component={ArrowUpIcon} />
                                  </Typography>
                                </Button>
                              </Link>
                            </Box>
                          ))}
                          <Box className="add-tokens">
                            <Divider color="secondary" />
                            <Button
                              size="large"
                              variant="contained"
                              color="secondary"
                              onClick={disconnect}
                              style={{ marginBottom: "0px" }}
                              fullWidth
                            >
                              <Typography>Disconnect</Typography>
                            </Button>
                          </Box>
                        </Paper>
                      </Fade>
                    );
                  }}
                </Popper>
              </div>
            </Paper>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
}

export default VipCheck;
