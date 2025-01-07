import React, { useEffect, useState } from 'react';
import Logo from "../../assets/images/logo.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from '../../data/navbar-links';
import { useSelector } from 'react-redux';
import { GrCart } from "react-icons/gr";
import toast from 'react-hot-toast';
import { apiConnector } from '../../services/apiConnector';
import { categories } from '../../services/apis';
import { IoChevronDownSharp } from "react-icons/io5";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import ProfileDropdown from '../core/auth/ProfileDropDown';

const Navbar = () => {
  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [subLinks, setSubLinks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(result.data.category); 
      } catch (error) {
        console.error("Error fetching categories!");
        toast.error("Error fetching Categories data!");
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className='h-14 border-b-2 items-center justify-center border-richblack-700 flex'>
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to={"/"}>
          <img src={Logo} loading='lazy' className='h-14 w-[11rem] object-contain' alt='Course Craft Logo'/>
        </Link>

        {/* Mobile Hamburger Menu Icon */}
        <div className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <HiMenuAlt3 className="text-2xl mr-[-4] cursor-pointer" />
        </div>

        {/* Nav Links for Desktop */}
        <nav className="hidden md:flex">
          <ul className='flex gap-x-5 text-richblack-25'>
            {NavbarLinks.map((ele, i) => (
              <li key={i}>
                {ele.title === "Catalog" ? (
                  <div className='flex relative group items-center gap-2 group z-50'>
                    <p>
                      <span className='flex items-center cursor-pointer gap-2'>
                        {ele.title} <IoChevronDownSharp className='ml-1 arrowBTN group-hover:rotate-180 transition-transform duration-500'/>
                      </span>
                    </p>
                    <div className="invisible absolute left-[50%] translate-x-[-45%] translate-y-[70%] flex flex-col rounded-md bg-richblack-25 text-richblack-800 p-4 opacity-0 duration-200 group-hover:opacity-100 w-40 lg:w-[300px] group-hover:visible">
                      <div className="absolute left-[50%] -z-10 top-0 h-6 w-6 rotate-45 translate-y-[-30%] rounded-sm bg-richblack-25"></div>
                      {subLinks.map((subLink, j) => (
                        <div key={j} className='flex justify-center'>
                          <Link to={`/catalog/${subLink.name}`}>
                            <p className='p-2 hover:bg-pure-greys-5 border-b-2 border-b-richblack-400 transition-all duration-200 hover:rounded-md cursor-pointer'>
                              {subLink.name}
                            </p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className={`${matchRoute(ele.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                    <Link to={ele.path}>{ele.title}</Link>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login / Signup / Cart */}
        <div className="flex gap-x-4 items-center">
          {user && user.accountType !== "Instructor" && (
            <Link to={"/dashboard/cart"} className='relative'>
              <span className='flex items-center justify-center'>
                <GrCart className='text-2xl'/>
              </span>
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}

          {token === null ? (
            <>
              <Link to={"/signup"}>
                <button className='hover:border-b-[4px] hover:border-r-[4px] bg-richblack-700 rounded-md hover:scale-95 transition-all duration-150 hover:bg-richblack-500 py-[5px] px-2'>
                  Signup
                </button>
              </Link>
              <Link to={"/login"}>
                <button className='hover:border-b-[4px] hover:border-r-[4px] bg-richblack-700 rounded-md hover:scale-95 transition-all duration-150 hover:bg-richblack-500 py-[5px] px-2'>
                  Login
                </button>
              </Link>
            </>
          ) : (
            <ProfileDropdown/>
          )}
        </div>
      </div>

      {/* Mobile Popup Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={() => setMenuOpen(false)}>
          <div className="bg-richblack-700 w-2/5 h-fit p-8 rounded-md" onClick={(e) => e.stopPropagation()}>
            {/* Close Icon */}
            <div className="flex justify-end">
              <HiX className="text-3xl cursor-pointer" onClick={() => setMenuOpen(false)} />
            </div>

            <ul className="flex flex-col gap-y-4">
              {NavbarLinks.map((ele, i) => (
                <li key={i}>
                  {ele.title === "Catalog" ? (
                    <div className='relative group'>
                      <p>
                        <span className='flex items-center cursor-pointer gap-2'>
                          {ele.title} <IoChevronDownSharp className='ml-1 arrowBTN group-hover:rotate-180 transition-transform duration-500'/>
                        </span>
                      </p>
                      <div className="invisible md:invisible absolute left-[50%] translate-x-[-25%] translate-y-[-12%] flex flex-col rounded-md bg-richblack-800 text-richblue-5 p-4 opacity-0 duration-200 group-hover:opacity-100 w-40 lg:w-[300px] group-hover:visible">
                        {/* <div className="absolute left-[50%] -z-10 top-0 h-6 w-6 rotate-45 translate-y-[-30%] rounded-sm bg-richblack-25"></div> */}
                        {subLinks.map((subLink, j) => (
                          <div key={j} className='flex justify-center'>
                            <Link to={`/catalog/${subLink.name}`}>
                              <p className='p-2 hover:bg-pure-greys-300 border-b-2 border-b-richblack-400 transition-all duration-200 hover:rounded-md cursor-pointer'>
                                {subLink.name}
                              </p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className={`${matchRoute(ele.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                      <Link to={ele.path}>{ele.title}</Link>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
