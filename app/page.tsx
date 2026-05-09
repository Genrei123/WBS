import {draftMode} from "next/headers";

import {PageBuilder} from "@/components/page-builder/page-builder";
import Reveal from "@/components/ui/reveal";
import {sanityFetch} from "@/sanity/lib/live";
import {pageBySlugQuery} from "@/sanity/lib/queries";

async function getHomePage() {
  const {data} = await sanityFetch({query: pageBySlugQuery, params: {slug: "home"}});
  return data;
}

export default async function Home() {
  const homePage = await getHomePage();
  const {isEnabled} = await draftMode();

  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <Reveal>
        <PageBuilder
          sections={homePage?.sections}
          documentId={homePage?._id}
          documentType={homePage?._type}
          isDraftMode={isEnabled}
        />
      </Reveal>
    </main>
  );
}
