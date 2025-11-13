import React, { useEffect, useState } from "react";
import useEcomStore from "../store/ecom-store";
import { currentSuperAdmin } from "../api/auth";
import LoadingToRedirect from "./LoadingToRedirect";

const ProtectRouteSuperAdmin = ({ element }) => {
  const [ok, setOk] = useState(false);
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);

  useEffect(() => {
    if (user && token) {
      currentSuperAdmin(token)
        .then(() => setOk(true))
        .catch(() => setOk(false));
    }
  }, []);

  return ok ? element : <LoadingToRedirect />;
};

export default ProtectRouteSuperAdmin;
