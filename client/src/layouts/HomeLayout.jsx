import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import "./HomeLayout.css";

export default function HomeLayout() {
  return (
    <div className="home-layout-container flex flex-col w-full h-screen">
      {/* Top Header */}
      <Header />

      {/* Main Content */}
      <main className="home-layout-main flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}
