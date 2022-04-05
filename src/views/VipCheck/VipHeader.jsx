import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Typography, IconButton, SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import useEscape from "../../hooks/useEscape";

function VipHeader() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let history = useHistory();

  useEscape(() => {
    if (open) handleClose();
    else history.push("/public");
  });
  return (
    <div className="bond-header mt-200">
      <Link component={NavLink} to="/public" className="cancel-bond">
        <SvgIcon color="primary" style={{color : "#ffffff"}} component={XIcon} />
      </Link>
    </div>
  );
}

export default VipHeader;
