import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../assets/icons/github.svg";
import { ReactComponent as Medium } from "../../assets/icons/medium.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";
import { ReactComponent as Envelope } from "../../assets/icons/envelope.svg";

export default function Social() {
  return (
    <div className="social-row">
      {/* <Link href="https://github.com/Hector-DAO" target="_blank">
        <SvgIcon color="primary" component={GitHub} />
      </Link> */}

      {/* <Link href="" target="_blank">
        <SvgIcon color="primary" component={Telegram} />
      </Link> 
      
      <Link href="" target="_blank">
        <SvgIcon color="primary" component={Envelope} />
      </Link>
      */}

      <Link href="https://twitter.com/NFT_Gaming_DAO" target="_blank">
        <SvgIcon color="primary" component={Twitter} />
      </Link>

      <Link href="https://discord.gg/nft-gaming-dao" target="_blank">
        <SvgIcon color="primary" component={Discord} />
      </Link>
    </div>
  );
}
