import { ReactComponent as ForumIcon } from "../../assets/icons/forum.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as TraderJoeIcon } from "../../assets/icons/traderjoe.svg";
import { ReactComponent as SpiritSwapIcon } from "../../assets/icons/spiritswap.svg";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/feedback.svg";
import { SvgIcon } from "@material-ui/core";
import { AccountBalanceOutlined, MonetizationOnOutlined } from "@material-ui/icons";

const externalUrls = [
  {
     title: "P2E Node",
     url: "",
     icon: <SvgIcon viewBox="0 0 155 172" color="primary" component={SpiritSwapIcon} />
  },
  {
     title: "Clusters",
     label: "(Coming soon)",
     icon: <MonetizationOnOutlined viewBox="0 0 20 24" />
  },
  {
    title: "Forum",
    label: "",
    url: "",
    icon: <MonetizationOnOutlined viewBox="0 0 20 24" />
  },
  {
    title: "Docs",
    url: "",
    icon: <SvgIcon color="primary" component={DocsIcon} />
  },
  {
    title: "Governance",
    url: "",
    label: "(Coming soon)",
    icon: <SvgIcon color="primary" component={GovIcon} />
  }
];

export default externalUrls;
