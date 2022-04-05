import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import "./public.scss";
import { useWeb3Context } from "../../hooks";
import store from "src/store";
import { Grid, InputAdornment, OutlinedInput, Zoom, Slider, Paper, Box, Typography, Button } from "@material-ui/core";
import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";

function Public() {

    const rate = 8;
    const [depositeVal, setdepositeVal] = useState();
    const [avaxBalances, setAvaxBalance] = useState(0);
    const [nftgmamount, setnftgmAmount] = useState(0);
    const [avaxPrice, setAvaxPrice]= useState(0);

    const avaxBalance = useSelector(state => {
        return state.account.staking && state.account.staking.avaxBalance;
    });

    async function getAvaxPrice() {
        try {
          let resp = await fetch('https://openapi.debank.com/v1/token?chain_id=avax&id=avax');
          let balance = await resp.json();
          
          setAvaxPrice(balance.price);
        } catch (err) {
          return 0
        }
      }


    const changeDepositeVal = (e) => {
        setdepositeVal(e.target.value);
        console.log(depositeVal);
    }
    const setMax = () => {
        setdepositeVal(trim(avaxBalance, 2));
    }
    useEffect(() => {
        setAvaxBalance(trim(avaxBalance, 2));
    }, [avaxBalance])

    useEffect(()=>{
        getAvaxPrice();
    },[])
    useEffect(() => {
        if (depositeVal >= 0 && (depositeVal * rate) <= 1000) {
            setnftgmAmount(depositeVal * rate);
        }
        else if(depositeVal < 0) {
            setnftgmAmount(0);
            setdepositeVal(0)
        } else if(depositeVal >= 0 && (depositeVal * rate) > 1000){
            setnftgmAmount(1000);
            setdepositeVal(trim(1000 / rate, 2))
        }
    }, [depositeVal])

    return (
        <div className="public-view">
            <Zoom in={true}>
                <Paper className="hec-card public-card cus-bg-img">
                    <Grid className="public-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <Box className="public-card-header">
                                <Typography variant="h5">Public Presale</Typography>
                            </Box>
                        </Grid>

                        <Grid item>
                            <Box className="public-card-metrics">
                                <Grid container spacing={2} className="squaresLine">
                                    <Grid item xs={12} sm={12} md={12} lg={6}>
                                        <Box className="public-card-apy">
                                            <Typography variant="h4">Public Price</Typography>
                                            <Typography variant="h6">{trim(avaxPrice/rate,2)} USD</Typography>
                                            <Typography variant="h4">1 Avax &nbsp; <span className="token-icon" ><img  style={{ width: 24, height: 24, marginBottom: -6, marginRight: 5 }} src="avax.png" /></span> = {rate} NFTGM  &nbsp;<span className="token-icon" ><img style={{ width: 28, height: 28, marginBottom: -6, marginRight: 5 }} src="NFTGM.png" /></span></Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={6}>
                                        <Box className="public-card-apy">
                                            <Typography variant="h4">Market Price</Typography>
                                            <Typography variant="h6">{trim(avaxPrice/6,2)} USD</Typography>
                                            <Typography variant="h4">1 Avax &nbsp;<span className="token-icon" ><img style={{ width: 24, height: 24, marginBottom: -6, marginRight: 5 }} src="avax.png" /></span> = 6 NFTGM  &nbsp;<span className="token-icon"><img style={{ width: 28, height: 28, marginBottom: -6, marginRight: 5 }} src="NFTGM.png" /></span></Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Box className="public-card-area">
                            <Box>
                                <Box className="public-card-action-area inputZone">
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={12}>
                                            <Box className="public-card-action-area-inp-wrap">
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="public-card-action-input"
                                                    value={depositeVal}
                                                    labelWidth={0}
                                                    onChange={changeDepositeVal}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={setMax} className="stake-card-action-input-btn">
                                                                <Typography>Max</Typography>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            id="public-approve-btn"
                            className="public-transaction-button"
                        // disabled={isPendingTxn(pendingTransactions, "approve_" + bond.name)}
                        // onClick={}
                        >
                            {/* {txnButtonText(pendingTransactions, "approve_" + bond.name, "Approve")} */}
                            Buy NFTGM
                        </Button>
                      
                        <Box className="calculator-user-data rowsZone">
                                    <Box className="data-row">
                                        <Typography>Your Avax Balance</Typography>
                                        <Typography>{avaxBalances}</Typography>
                                    </Box>
                                    <Box className="data-row">
                                        <Typography>You will get</Typography>
                                        <Typography>{nftgmamount} NFTGM</Typography>
                                    </Box>
                                    <Box className="data-row">
                                        <Typography>Max you can buy</Typography>
                                        <Typography>1000 NFTGM</Typography>
                                    </Box>
                                    <Box className="data-row">
                                        <Typography>Your NFTGM Balance</Typography>
                                        <Typography>0 NFTGM</Typography>
                                    </Box>
                                </Box>
                    </Grid>
                </Paper>
            </Zoom>
        </div>
    );
}

export default Public;

