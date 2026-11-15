import { Link, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

const NotFound = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="mx-auto w-full max-w-page flex-1 px-5 py-24 sm:px-8 md:py-32">
        <p className="label">404</p>
        <h1 className="mt-6 max-w-[40rem] font-serif text-[2.5rem] leading-[1.05] tracking-[-0.02em] sm:text-6xl">
          Nothing lives at <span className="italic text-primary">{pathname}</span>.
        </h1>
        <p className="mt-8 flex gap-6 text-[0.9375rem]">
          <Link to="/" className="link">
            <span aria-hidden="true">←</span> Home
          </Link>
          <Link to="/blogs" className="link">
            Writing
          </Link>
        </p>
      </main>
    </div>
  );
};

export default NotFound;
