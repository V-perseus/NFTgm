import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as GlobeIcon } from "../../assets/icons/globe.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import { ReactComponent as NFTGM } from "../../assets/icons/nftgm-nav-header.svg";
import { trim, shorten } from "../../helpers";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { Paper, Link, Box, Typography, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";

import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { AccountBalanceOutlined, MonetizationOnOutlined } from "@material-ui/icons";
import { ReactComponent as SpiritSwapIcon } from "../../assets/icons/spiritswap.svg";

//import NFTGM from "src/assets/icons/logo_main.png";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { bonds } = useBonds();
  const { chainID } = useWeb3Context();

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    if ((currentPath.indexOf("calculator") >= 0 && page === "calculator")) {
      return true;
    }
    if ((currentPath.indexOf("vip") >= 0 && page === "vip")) {
      return true;
    }
    if ((currentPath.indexOf("public") >= 0 && page === "public")) {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://testing2.jbms-tech.com/" target="_blank">
              <div className="wallet-link f-32">NFTGM DAO</div>
            </Link>
            {address && (
              <div className="wallet-link">
                <Link href={`https://snowtrace.io/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Link
                component={NavLink}
                id="dash-nav"
                to="/dashboard"
                isActive={(match, location) => {
                  return checkPage(match, location, "dashboard");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={DashboardIcon} />
                  Dashboard
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="stake-nav"
                to="/"
                isActive={(match, location) => {
                  return checkPage(match, location, "stake");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={StakeIcon} />
                  Stake
                </Typography>
              </Link>

              <Link
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isActive={(match, location) => {
                  return checkPage(match, location, "bonds");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={BondIcon} />
                  Bond ( Coming soon )
                </Typography>
              </Link>
              <Link
                component={NavLink}
                id="bond-nav"
                to="/calculator"
                isActive={(match, location) => {
                  return checkPage(match, location, "calculator");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={GlobeIcon} />
                  Calculator
                </Typography>
              </Link>
              <p></p>
              <p></p>
              <Link
                component={NavLink}
                id="vip-nav"
                to="/vipCheck"
                isActive={(match, location) => {
                  return checkPage(match, location, "vip");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={BondIcon} />
                  Presale - VIP
                </Typography>
              </Link>
              <Link
                component={NavLink}
                id="public-nav"
                to="/public"
                isActive={(match, location) => {
                  return checkPage(match, location, "public");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <SvgIcon color="primary" component={BondIcon} />
                  Presale - Public
                </Typography>
              </Link>

              <p></p>

            </div>
          </div>
        </div>

        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">

            <Link target="_blank" component={"span"}>
              <Typography variant="h6"><SvgIcon viewBox="0 0 155 172" color="primary" component={SpiritSwapIcon} /></Typography>
              <Typography variant="h6">P2E Node</Typography>
              <Typography variant="caption" style={{ marginLeft: "8px" }}>
                (Coming soon)
              </Typography>
            </Link>

            <Link target="_blank" component={"span"}>
              <Typography variant="h6"><MonetizationOnOutlined viewBox="0 0 20 24" /></Typography>
              <Typography variant="h6">Clusters</Typography>
              <Typography variant="caption" style={{ marginLeft: "8px" }}>
                (Coming soon)
              </Typography>
            </Link>
            <Link target="_blank" component={"span"}>
              <Typography variant="h6">  <SvgIcon color="primary" component={GovIcon} /></Typography>
              <Typography variant="h6">Governance</Typography>
              <Typography variant="caption" style={{ marginLeft: "8px" }}>
                (Coming soon)
              </Typography>
            </Link>
            <p></p>
            <Link target="_blank" href="https://discord.gg/nft-gaming-dao" component={"a"}>
              <Typography variant="h6"> <MonetizationOnOutlined viewBox="0 0 20 24" /></Typography>
              <Typography variant="h6">Forum</Typography>
            </Link>
            <Link target="_blank" href="https://docs.nftgamingdao.com/" component={"a"}>
              <Typography variant="h6"><SvgIcon color="primary" component={DocsIcon} /></Typography>
              <Typography variant="h6">Docs</Typography>
            </Link>

          
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
