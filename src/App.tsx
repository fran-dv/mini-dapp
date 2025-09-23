import { AppLayout } from "@components/AppLayout";
import "@rainbow-me/rainbowkit/styles.css";
import Web3Providers from "./providers/Web3Providers";
import { Home } from "@pages/Home";
import { Events } from "@pages/Events";
import { Paths } from "@routing/paths";
import { RoutesWithNotFound } from "@routing/RoutesWithNotFound";
import { Route, Navigate } from "react-router-dom";
import * as Toast from "@radix-ui/react-toast";

function App() {
  return (
    <div>
      <Web3Providers>
        <Toast.Provider swipeDirection="left">
          <AppLayout>
            <RoutesWithNotFound>
              <Route path="/" element={<Navigate to={Paths.Home} />} />
              <Route path={Paths.Home} element={<Home />} />
              <Route path={Paths.Events} element={<Events />} />
            </RoutesWithNotFound>
          </AppLayout>
        </Toast.Provider>
      </Web3Providers>
    </div>
  );
}

export default App;
