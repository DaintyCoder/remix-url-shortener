import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { mongodb } from "~/utils/db.server";
import { useState } from "react";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const originalUrl = formData.get("url");

  const db = await mongodb.db("urlShortener");
  const collection = await db.collection("urls");

  // Generate a random short code
  const shortCode = Math.random().toString(36).substring(2, 8);

  await collection.insertOne({ originalUrl, shortCode });

  // Return the short code and original URL
  return json({ originalUrl, shortCode });
}

export default function AddUrl() {
  const actionData = useActionData();
  const [urls, setUrls] = useState<{ originalUrl: string; shortCode: string }[]>([]);

  // Update the state when new data is returned from the action
  if (actionData && !urls.some(url => url.shortCode === actionData.shortCode)) {
    setUrls([...urls, actionData]);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add a URL</h2>
      <Form method="POST" action="/urls/add" className="mb-6">
        <input type="url" name="url" placeholder="Enter URL" required className="border p-2 mr-2" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Shorten</button>
      </Form>

      {actionData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Shortened URL</h3>
          <p>
            <a href={`/urls/${actionData.shortCode}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {window.location.origin}/urls/{actionData.shortCode}
            </a>
          </p>
        </div>
      )}

      {urls.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">All URLs</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 text-left">Original URL</th>
                <th className="border-b p-2 text-left">Shortened URL</th>
              </tr>
            </thead>
            <tbody>
              {urls.map(({ originalUrl, shortCode }) => (
                <tr key={shortCode}>
                  <td className="p-2">{originalUrl}</td>
                  <td className="p-2">
                    <a href={`/urls/${shortCode}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      {window.location.origin}/urls/{shortCode}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}