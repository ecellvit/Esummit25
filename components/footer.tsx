'use client';
import React from 'react';

//import { faYoutube, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import PhoneIcon from '../assets/phoneicon';
import MailIcon from '../assets/mailicon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[purple] box-sizing" id="footer">
      <div className="flex flex-col gap-10 sm:hidden md:flex pt-10">
        <div className="flex flex-row text-white flex-grow flex-1">
          <div className="flex flex-col pl-5 pr-5 w-[50vw]">
            <h1
              className="pl-10 text-[5vw] font-[700] after:content-['We_Breed_Business'] after:text-[1.5vw] after:font-Almaria after:text-[#FFFFFF] flex flex-col gap-0 after:static leading-[60%] after:pl-[0.4vw] mt-[2vh]"
              style={{ fontFamily: "'Almarai', sans-serif" }}
            >
              E-CELL
            </h1>
            <div className="pl-10">
              <div className="flex items-center gap-2">
                <p>
                  <PhoneIcon />
                </p>
                <a href="tel:+91 87777 93331">+91 87777 93331</a>
              </div>
              <div className="flex items-center gap-2">
                <p className="pt-[0.8vh]">
                  <MailIcon />
                </p>
                <a href="mailto:helloecellvit@gmail.com">helloecellvit@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-center items-center pl-5 pr-5 w-[50vw]">
            <p className="text-sm justify-center items-center flex w-[40vw] text-[rgba(255,255,255,0.61)] text-justify pt-10">
              The Entrepreneurship Cell, VIT Vellore, is a student-led organization established to promote the spirit of
              entrepreneurship among young innovators. E-Cell aims to provide students with a platform along with the
              necessary tools to convert their ideas into successful business ventures. The club’s mission is to create
              an engaging entrepreneurial culture within the institution while establishing a network of various
              investors, mentors, and evaluators to enhance the startup ecosystem for the future.
            </p>
          </div>
        </div>
        <div className="h-[fit-content] flex justify-around items-center flex-wrap gap-10 mb-5 ml-10 mr-10">
          {/** Social Media Sections */}
          {[
            { platform: 'INSTAGRAM', url: 'https://www.instagram.com/ecell_vit/', description: 'Stay up to Date' },
            { platform: 'LINKEDIN', url: 'https://www.linkedin.com/company/ecellvitvellore', description: 'Let’s connect' },
            { platform: 'YOUTUBE', url: 'https://www.youtube.com/@e-cellvit7216', description: 'Learn with us' },
            { platform: 'X', url: 'https://twitter.com/ecell_vit', description: 'Ideas in real time' },
          ].map(({ platform, url, description }) => (
            <div key={platform} className="min-w-[18vw] h-[fit-content] flex flex-col flex-1">
              <div
                className="border rounded-xl border-b-0 pb-5 p-5"
                style={{
                  fontFamily: "'Freeman', sans-serif",
                  background: 'white',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <h1 className="text-[#FFFFFF] text-2xl text-bold pl-2 items-center pt-2">{platform}</h1>
              </div>
              <div className="flex flex-row justify-around gap-5 pl-5 border-2 pr-2 rounded-xl border-t-0 pt-5 pb-2">
                <a href={url} className="text-[#FFFFFF] underline text-sm flex items-center" target="_blank" rel="noopener noreferrer">
                  {description}
                </a>
                <a href={url} className="p-1 border-2 border-[#FFFFFF] rounded-xl flex items-center" target="_blank" rel="noopener noreferrer">
                  
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
