import { AppLayout } from "@components/AppLayout";
import "@rainbow-me/rainbowkit/styles.css";
import Web3Providers from "./providers/Web3Providers";
import { Home } from "@pages/Home";
import { Paths } from "@routing/paths";
import { RoutesWithNotFound } from "@routing/RoutesWithNotFound";
import { Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div>
      <Web3Providers>
        <AppLayout>
          <RoutesWithNotFound>
            <Route path="/" element={<Navigate to={Paths.Home} />} />
            <Route path={Paths.Home} element={<Home />} />
          </RoutesWithNotFound>
        </AppLayout>
      </Web3Providers>
    </div>
  );
}

export default App;
