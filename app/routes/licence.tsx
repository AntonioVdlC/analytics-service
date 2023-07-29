import { getUserId } from "~/utils/session.server";
import { readLicence } from "~/utils/licence.server";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type LoaderData = {
  isUserLoggedIn: boolean;
  licence: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  const licence = await readLicence();

  return {
    isUserLoggedIn: Boolean(userId),
    licence,
  };
};

export default function LicenceScreen() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="relative bg-slate-50">
      <Header isUserLoggedIn={data.isUserLoggedIn} />

      <main className="mx-auto max-w-7xl px-8">
        <div
          className="prose prose-slate max-w-none md:prose-lg lg:prose-xl"
          dangerouslySetInnerHTML={{ __html: data.licence }}
        ></div>
      </main>

      <Footer />
    </div>
  );
}
