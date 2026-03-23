import { Outlet } from "react-router";

export default function Layout() {
  return <Outlet />;

  // Menu
  //   const navigate = useNavigate();
  //   const location = useLocation();

  //   return (
  //     <Tabs value={location.pathname} onValueChange={navigate}>
  //       <TabsList className="fixed bottom-8 right-8 z-10">
  //         <TabsTrigger className="cursor-pointer" value="/">
  //           Home
  //         </TabsTrigger>
  //       </TabsList>
  //       <Outlet />
  //     </Tabs>
  //   );
}
