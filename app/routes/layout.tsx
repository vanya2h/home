import { Outlet, useLocation, useNavigate } from "react-router";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Tabs value={location.pathname} onValueChange={navigate}>
      <TabsList className="fixed bottom-8 right-8 z-10">
        <TabsTrigger className="cursor-pointer" value="/">
          Home
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="/cv">
          CV
        </TabsTrigger>
      </TabsList>
      <Outlet />
    </Tabs>
  );
}
