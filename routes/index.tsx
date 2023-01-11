import { Head } from "$fresh/runtime.ts";
import CoherenceTimer from "../islands/CoherenceTimer.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>breathing.hudak.land</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <CoherenceTimer />
      </div>
    </>
  );
}
