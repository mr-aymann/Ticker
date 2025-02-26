// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   FaFacebook,
//   FaTwitter,
//   FaInstagram,
//   FaPinterest,
//   FaLinkedin,
//   FaXing,
// } from "react-icons/fa";
// import { AiOutlineMail } from "react-icons/ai";

// const iconStyle = {
//   marginRight: "10px",
//   fontSize: "24px",
//   color: "#fff",
//   transition: "transform 0.3s ease-in-out",
// };

// const hoveredStyle = {
//   transform: "scale(1.2)",
// };

// const Footer = () => {
//   return (
//     <div className="bg-gray-800 text-white py-8 lg:pl-16 px-6">
//       <div className="container mx-auto flex flex-wrap justify-center lg:justify-between">
//         <div className="w-full lg:w-1/4 mb-8 lg:mb-0 text-center lg:text-left">
//           <h3 className="text-xl lg:text-xl font-semibold mb-4">Contact Us</h3>
//           <p>Email: info@example.com</p>
//           <p>Phone: +123 456 7890</p>
//         </div>
//         <div className="w-full lg:w-1/4 mb-8 lg:mb-0 text-center lg:text-left">
//           <h3 className="text-xl lg:text-xl font-semibold mb-4">Follow Us</h3>
//           <div className="flex justify-center lg:justify-start items-center">
//             <Link to="#" style={iconStyle}>
//               <FaFacebook />
//             </Link>
//             <Link to="#" style={iconStyle}>
//               <FaTwitter />
//             </Link>
//             <Link to="#" style={iconStyle}>
//               <FaInstagram />
//             </Link>
//             <Link to="#" style={iconStyle}>
//               <FaPinterest />
//             </Link>
//             <Link to="#" style={iconStyle}>
//               <FaLinkedin />
//             </Link>
//             <Link to="#" style={iconStyle}>
//               <FaXing />
//             </Link>
//             <Link to="#" style={iconStyle}>
//               <AiOutlineMail />
//             </Link>
//           </div>
//         </div>
//         <div className="w-full lg:w-1/4 text-center lg:text-left">
//           <h3 className="text-xl lg:text-xl font-semibold mb-4">
//             Terms and Conditions
//           </h3>
//           <div className="mb-2">
//             <Link to="/privacy-policy" className="text-sm lg:text-base">
//               Privacy Policy
//             </Link>
//           </div>
//           <Link to="/terms-of-service" className="text-sm lg:text-base">
//             Terms of Service
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;


// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#333333] text-[#B3B3B3] pt-10 py-10">
      <div className="container mx-auto px-4">
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="text-white mb-4 font-semibold">Popular Categories</h4>
            <ul>
              <li><a href="#" className="hover:text-white">Movies</a></li>
              <li><a href="#" className="hover:text-white">Events</a></li>
              <li><a href="#" className="hover:text-white">Plays</a></li>
              <li><a href="#" className="hover:text-white">Sports</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4 font-semibold">Information</h4>
            <ul>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4 font-semibold">Partner with Us</h4>
            <ul>
              <li><a href="#" className="hover:text-white">List Your Show</a></li>
              <li><a href="#" className="hover:text-white">Become an Affiliate</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4 font-semibold">Connect with Us</h4>
            <div className="flex space-x-4">

              
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-[#555555] mt-8 pt-4 text-center text-xs">
          <p className="text-[#B3B3B3]">© {new Date().getFullYear()} BookMyShow Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
