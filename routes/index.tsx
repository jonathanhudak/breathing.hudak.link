import { Head } from "$fresh/runtime.ts";
import { LongCoherenceTimer } from "../islands/CoherenceTimer.jsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>breathing.hudak.land</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <LongCoherenceTimer />
      </div>
    </>
  );
}
