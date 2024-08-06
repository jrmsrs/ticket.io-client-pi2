import { useContext } from "react";
import { AuthGoogleContext } from "../../contexts/authGoogle";
import BackgroundLogin from "./bgLogin.svg";
import BackgroundSigned from "./bgSigned.svg";
export default function BgContainer({ children }) {
  const { signed } = useContext(AuthGoogleContext);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: signed
          ? `url(${BackgroundLogin}) no-repeat fixed`
          : `url(${BackgroundSigned}) no-repeat fixed`
      }}
    >
      {children}
    </div>
  );
}
