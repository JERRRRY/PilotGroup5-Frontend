import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/">
          <div className="relative max-w-7xl mx-auto">
            <div className="mb-2 mt-2">
              <h1 className="text-2xl font-medium tracking-tight">
                <span className="text-violet-600 font-semibold">Pi</span>
                <span className="text-slate-900">Tube</span>
              </h1>
              <p className="text-slate-500 text-sm">Learn your course online</p>
            </div>
          </div>
        </Link>

        <Link
          to="/course/edit-search"
          className="rounded-md px-3 py-1.5 text-lg font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          Edit
        </Link>
      </div>
    </header>
  );
};

export default Header;
