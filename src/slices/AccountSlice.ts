import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sHECv2 } from "../abi/sHecv2.json";
import { abi as HectorStaking } from "../abi/HectorStakingv2.json";
import { abi as NFT_contract } from "../abi/NFT_contract.json";
import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const hecContract = new ethers.Contract(addresses[networkID].NFTGM_ADDRESS as string, ierc20Abi, provider);
    const hecBalance = await hecContract.balanceOf(address);
    const shecContract = new ethers.Contract(addresses[networkID].SNFTGM_ADDRESS as string, ierc20Abi, provider);
    const shecBalance = await shecContract.balanceOf(address);

    return {
      balances: {
        hec: ethers.utils.formatUnits(hecBalance, "gwei"),
        shec: ethers.utils.formatUnits(shecBalance, "gwei"),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let hecBalance = 0;
    let shecBalance = 0;
    let oldshecBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let oldunstakeAllowance = 0;
    let daiBondAllowance = 0;
    let isHolder;
    let depositAmount = 0;
    let warmUpAmount = 0;
    let expiry = 0;
    let isNFTHolder;
    let avaxBalance;


    const daiContract = new ethers.Contract(addresses[networkID].MIM_ADDRESS as string, ierc20Abi, provider);
    const daiBalance = await daiContract.balanceOf(address);

    const hecContract = new ethers.Contract(addresses[networkID].NFTGM_ADDRESS as string, ierc20Abi, provider);
    hecBalance = await hecContract.balanceOf(address);
    stakeAllowance = await hecContract.allowance(address, addresses[networkID].STAKING_ADDRESS);

    const shecContract = new ethers.Contract(addresses[networkID].SNFTGM_ADDRESS as string, sHECv2, provider);
    shecBalance = await shecContract.balanceOf(address);
    unstakeAllowance = await shecContract.allowance(address, addresses[networkID].STAKING_ADDRESS);

    const oldshecContract = new ethers.Contract(addresses[networkID].OLD_SHEC_ADDRESS as string, sHECv2, provider);
    oldshecBalance = await oldshecContract.balanceOf(address);
    oldunstakeAllowance = await oldshecContract.allowance(address, addresses[networkID].OLD_STAKING_ADDRESS);

    const stakeContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS as string, HectorStaking, provider);
    isHolder = await stakeContract.isNftHolder(address);
    console.log('debug isHolder', isHolder)


    const NFTContract = new ethers.Contract(addresses[networkID].NFT_ADDRESS as string, NFT_contract, provider);
    isNFTHolder = await NFTContract.balanceOf(address);
    isNFTHolder = isNFTHolder.toNumber();
    console.log('debug isNFTHolder', isNFTHolder)

    const warmupInfo = (await stakeContract.warmupInfo(address));
    depositAmount = warmupInfo.deposit;
    warmUpAmount = +ethers.utils.formatUnits((await shecContract.balanceForGons(warmupInfo.gons)), "gwei");
    expiry = warmupInfo.expiry;

    const getAvaxBalance = await provider.getBalance(address);
    avaxBalance = ethers.utils.formatEther(getAvaxBalance);
    console.log("aaaavax bal", avaxBalance)
    return {
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        hec: ethers.utils.formatUnits(hecBalance, "gwei"),
        shec: ethers.utils.formatUnits(shecBalance, "gwei"),
        oldshec: ethers.utils.formatUnits(oldshecBalance, "gwei"),
      },
      staking: {
        hecStake: +stakeAllowance,
        hecUnstake: +unstakeAllowance,
        oldhecUnstake: +oldunstakeAllowance,
        isHolder: isHolder,
        isNFTHolder : isNFTHolder,
        avaxBalance: avaxBalance
      },
      warmup: {
        depositAmount: ethers.utils.formatUnits(depositAmount, "gwei"),
        warmUpAmount,
        expiryEpochNumber: expiry,
      },
      bonding: {
        daiAllowance: daiBondAllowance,
      },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        isFour: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastTime;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = 0;
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    // let balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    let deciamls = 18;
    let balanceVal;
    if (bond.isLP) {
      deciamls = 18;
    }
    balanceVal = ethers.utils.formatEther(balance);
    if (bond.decimals) {
      balanceVal = ethers.utils.formatUnits(balance, "mwei");
    }
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      isFour: bond.isFour,
      allowance: Number(allowance),
      balance: balanceVal.toString(),
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    hec: string;
    shec: string;
    dai: string;
    oldshec: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { hec: "", shec: "", dai: "", oldshec: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
