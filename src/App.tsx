import { Route, Navigate } from "react-router-dom";
import { Home } from "@pages/Home";
import { AppLayout } from "@components/AppLayout";
import { Paths } from "@routing/paths";
import { RoutesWithNotFound } from "@routing/RoutesWithNotFound";

function App() {
  return (
    <div>
      <AppLayout>
        <RoutesWithNotFound>
          <Route path="/" element={<Navigate to={Paths.Home} />} />
          <Route path={Paths.Home} element={<Home />} />
        </RoutesWithNotFound>
      </AppLayout>
    </div>
  );
}

export default App;
