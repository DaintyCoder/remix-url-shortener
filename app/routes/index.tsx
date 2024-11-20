/* export default function Index() {
  return (
    <>
      <div>
        <h1>Remix/MongoDB Stack</h1>
        <p>Check out the README.md file for more details.</p>
      </div>
    </>
  );
}
 */

import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">URL Shortener</h1>
      <Link to="/urls/add" className="text-blue-500 underline">
        Add a new URL
      </Link>
    </div>
  );
}