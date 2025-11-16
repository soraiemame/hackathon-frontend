import { Loader } from "./loader";

export function FullPageLoader() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Loader size={40} />
    </div>
  );
}
