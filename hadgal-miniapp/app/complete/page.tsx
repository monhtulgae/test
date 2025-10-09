import { Suspense } from "react";
import CompletePage from "./CompletePage";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompletePage />
    </Suspense>
  );
}
