import { Page } from "@/components/Page";
import { HomeHero } from "@/components/home/HomeHero";
import { Marquee } from "@/components/home/Marquee";
import { HeresMe } from "@/components/home/HeresMe";
import { NowProjects } from "@/components/home/NowProjects";
import { GithubGraph } from "@/components/home/GithubGraph";
import { Bento } from "@/components/home/Bento";

export default function Home() {
  return (
    <Page testId="home-page">
      <HomeHero />
      <Marquee />
      <HeresMe />
      <NowProjects />
      <GithubGraph />
      <Bento />
    </Page>
  );
}
