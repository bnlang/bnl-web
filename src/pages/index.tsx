import HeadComponent from "@/components/head-component";
import { HomeComponent } from "@/components/home-component";

export default function HomePage() {
  return (
    <>
      <HeadComponent locale="en" />
      <HomeComponent locale="en" />
    </>
  );
}
