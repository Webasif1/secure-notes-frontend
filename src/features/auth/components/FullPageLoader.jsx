import Spinner from "../../shared/components/Spinner";
import Logo from "../../layout/components/Logo";

const FullPageLoader = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg" role="status">
    <Logo />
    <Spinner className="h-5 w-5 text-primary" />
    <span className="sr-only">Loading</span>
  </div>
);

export default FullPageLoader;
