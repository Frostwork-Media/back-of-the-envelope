import { Board } from "./_components/Board";
import { Posthog } from "./_components/Posthog";

export default function Page() {
  return (
    <Posthog>
      <Board />
    </Posthog>
  );
}
