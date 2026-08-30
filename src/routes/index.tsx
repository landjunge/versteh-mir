import { createFileRoute } from "@tanstack/react-router";
import { VerstehMirWindow } from "@/components/versteh-mir/window";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <VerstehMirWindow />;
}
