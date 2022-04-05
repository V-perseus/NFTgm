import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
  Slide
} from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import { BondDataCard, BondTableData } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatCurrency } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import ClaimBonds from "./ClaimBonds";
import _ from "lodash";
import { allBondsMap } from "src/helpers/AllBonds";



function ChooseBond() {
  const { bonds } = useBonds();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading = useSelector(state => state.app.loading);
  const isAccountLoading = useSelector(state => state.account.loading);

  const accountBonds = useSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  // const marketPrice = useSelector(state => {
  //   return state.app.marketPrice;
  // });

  const [marketPrice, setAvaxPrice] = useState(0);
  async function getAvaxPrice() {
    try {
      let resp = await fetch('https://openapi.debank.com/v1/token?chain_id=avax&id=avax');
      let balance = await resp.json();

      setAvaxPrice(balance.price/6);
    } catch (err) {
      return 0
    }
  }
  useEffect(() => {
    getAvaxPrice();
  }, [])

  const treasuryBalance = useSelector(state => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances;
    }
  });

  return (
    <>
      <div id="choose-bond-view" className="bondView">
        {!isAccountLoading && !_.isEmpty(accountBonds) && <ClaimBonds activeBonds={accountBonds} />}

        <Zoom in={true}>
          <Paper className="hec-card">
            <Box className="card-header">
              <Typography variant="h5">Bond (1,1)</Typography>
            </Box>

            <Grid container item xs={12} style={{ margin: "10px 0px 20px" }} className="bond-hero squaresLine">
              <Grid item xs={6}>
                <Box textAlign='center'>
                  <Typography variant="h5" color="textSecondary">
                    Treasury Balance
                  </Typography>
                  <Typography variant="h4">
                    -
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} className={`hec-price`}>
                <Box textAlign='center'>
                  <Typography variant="h5" color="textSecondary">
                    NFTGM Price
                  </Typography>
                  <Typography variant="h4">
                    {isAppLoading ? <Skeleton width="100px" /> : formatCurrency(marketPrice, 2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {!isSmallScreen && (
              <Grid container item className="tableZone">
                <TableContainer>
                  <Table aria-label="Available bonds">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Bond</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">ROI (5 days)</TableCell>
                        <TableCell align="center">Purchased</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align="left"> <img style={{ width: 42, height: 42, marginBottom: -16, marginRight: 25, marginLeft: 15 }} src="MIM.png" />MIM</TableCell>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left"> <img style={{ width: 42, height: 42, marginBottom: -16, marginRight: 25, marginLeft: 15 }} src="avax.png" />AVAX</TableCell>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left"> <img style={{ width: 42, height: 42, marginBottom: -16, marginRight: -5 }} src="NFTGM.png" /><img style={{ width: 42, height: 42, marginBottom: -16, marginRight: 5 }} src="MIM.png" />NFTGM - MIM</TableCell>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left"> <img style={{ width: 42, height: 42, marginBottom: -16, marginRight: -5 }} src="NFTGM.png" /><img style={{ width: 42, height: 42, marginBottom: -16, marginRight: 5 }} src="avax.png" />NFTGM - AVAX</TableCell>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>
                      </TableRow>


                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Paper>
        </Zoom>

        {isSmallScreen && (
          <Box className="hec-card-container">
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <Slide direction="up" in={true}>
                  <Paper className="bond-data-card hec-card">
                    <div className="bond-pair">
                      <img style={{ width: 42, height: 42, marginBottom: -2, marginRight: 25 }} src="MIM.png" />
                      <div className="bond-name">
                        <Typography>MIM</Typography>
                      </div>
                    </div>
                    <div className="data-row">
                      <Typography>Price</Typography>
                      <Typography className="bond-price">
                        -
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography>ROI</Typography>
                      <Typography>
                        -
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography>Purchased</Typography>
                      <Typography>
                        -
                      </Typography>
                    </div>
                  </Paper>
                </Slide>
              </Grid>

              <Grid item xs={12}>
                <Slide direction="up" in={true}>
                  <Paper className="bond-data-card hec-card">
                    <div className="bond-pair">
                      <img style={{ width: 42, height: 42, marginBottom: -2, marginRight: 25 }} src="avax.png" />
                      <div className="bond-name">
                        <Typography>Avax</Typography>
                      </div>
                    </div>
                    <div className="data-row">
                      <Typography>Price</Typography>
                      <Typography className="bond-price">
                        -
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography>ROI</Typography>
                      <Typography>
                        -
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography>Purchased</Typography>
                      <Typography>
                        -
                      </Typography>
                    </div>
                  </Paper>
                </Slide>
              </Grid>
              <Grid item xs={12}>
                <Slide direction="up" in={true}>
                  <Paper className="bond-data-card hec-card">
                    <div className="bond-pair">
                      <img style={{ width: 42, height: 42, marginBottom: -2, marginRight: -5 }} src="NFTGM.png" />
                      <img style={{ width: 42, height: 42, marginBottom: -2, marginRight: 5 }} src="MIM.png" />
                      <div className="bond-name">
                        <Typography>NFTGM - MIM</Typography>
                      </div>
                    </div>
                    <div className="data-row">
                      <Typography>Price</Typography>
                      <Typography className="bond-price">
                        -
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography>ROI</Typography>
                      <Typography>
                        -
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography>Purchased</Typography>
                      <Typography>
                        -
                      </Typography>
                    </div>
                  </Paper>
                </Slide>
              </Grid>
              <Grid item xs={12}>
                <Slide direction="up" in={true}>
                  <Paper className="bond-data-card hec-card">
                    <div className="bond-pair">
                      <img style={{ width: 42, height: 42, marginBottom: -2, marginRight: -5 }} src="NFTGM.png" />
                      <img style={{ width: 42, height: 42, marginBottom: -2, marginRight: 5 }} src="avax.png" />
                      <div className="bond-name">
                        <Typography>NFTGM - Avax</Typography>
                      </div>
                    </div>
                    <div className="data-row">
                      <Typography>Price</Typography>
                      <Typography className="bond-price">
                        -
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography>ROI</Typography>
                      <Typography>
                        -
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography>Purchased</Typography>
                      <Typography>
                        -
                      </Typography>
                    </div>
                  </Paper>
                </Slide>
              </Grid>
            </Grid>
          </Box>
        )}
      </div>
    </>
  );
}

export default ChooseBond;
