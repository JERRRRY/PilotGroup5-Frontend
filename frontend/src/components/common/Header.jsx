import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
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
  );
};

export default Header;
