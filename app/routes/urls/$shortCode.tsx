import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { mongodb } from "~/utils/db.server";

export async function loader({ params }: LoaderArgs) {
  const shortCode = params.shortCode;

  const db = await mongodb.db("urlShortener");
  const collection = await db.collection("urls");

  const urlEntry = await collection.findOne({ shortCode });

  if (!urlEntry) {
    throw new Response("Not Found", { status: 404 });
  }

  return redirect(urlEntry.originalUrl);
}

export default function UrlRedirect() {
  const urlEntry = useLoaderData();
  return (
    <div>
      <h1>Redirecting to {urlEntry.originalUrl}</h1>
    </div>
  );
}