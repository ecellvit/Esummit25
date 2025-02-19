import { useEffect, useState, useRef } from "react";
import { FaFacebook, FaXTwitter, FaLinkedin, FaInstagram } from "react-icons/fa6";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import Link from "next/link";
import bg1 from "@/assets/footer2.svg";
import { useRouter, usePathname } from "next/navigation";
import bg2 from "@/assets/footer1.svg";
import Image from "next/image";

export default function Footer() {
  const router = useRouter();
  const sectionRef = useRef(null);
  const [value, setValue] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const pathname = usePathname();
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`/#${id}`);
  };
  useEffect(() => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
        }
      }
    }, [pathname]);
  return (
      <div
        id="foot"
        className="relative w-full bg-gradient-to-t from-[#1C0000] to-[#6F0F0F] shadow-md bottom-0 flex flex-col justify-between p-0 mb-0 min-h-[40vh] md:min-h-[80vh] rounded-t-3xl md:round-t-none"
      >
        <Image src={bg1} alt="bg1" className="hidden md:block absolute bottom-0 left-0 w-full h-full" />
        <Image src={bg2} alt="bg1" className="block md:hidden absolute bottom-0 left-0 w-full h-full" />
        <div className="relative px-5 text-white pt-20 flex-row hidden md:flex justify-between">
          <div className="text-center pointer-events-auto ml-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">E-CELL</h1>
            <p className="text-md md:text-lg mb-4">#WeBreedBusiness</p>
            <a href="tel:+918777793331" className="text-sm md:text-md block mb-4">+91 87777 93331</a>
            <a href="mailto:ecell@vit.ac.in" className="text-sm md:text-md block mb-4">ecell@vit.ac.in</a>
          </div>
          <div className="text-center pointer-events-auto text-sm md:text-md mr-10">
            <p className="mb-4">
              <a href="https://www.instagram.com/ecell_vit" className="hover:text-gray-500 flex items-center gap-2">
                <FaInstagram size={20} />
                Instagram
              </a>
            </p>
            <p className="mb-4">
              <a href="https://www.linkedin.com/company/ecellvitvellore" className="hover:text-gray-500 flex items-center gap-2">
                <FaLinkedin size={20} />
                LinkedIn
              </a>
            </p>
            <p className="mb-4">
              <a href="https://twitter.com/ecell_vit" className="hover:text-gray-500 flex items-center gap-2">
                <FaXTwitter size={20} />
                Twitter
              </a>
            </p>
            <p className="mb-4">
              <a href="https://www.facebook.com/ecellvit" className="hover:text-gray-500 flex items-center gap-2">
                <FaFacebook size={20} />
                Facebook
              </a>
            </p>
          </div>
          {/* <div className="pointer-events-auto text-sm md:text-md">
            <p className="mb-4"><Link href="/#home" scroll={false} onClick={(e) => handleScroll(e, "home")} className="hover:text-gray-500 text white mb-4">
              HOME
            </Link></p>
            <p className="mb-4"><Link href="/#ESummit" scroll={false} onClick={(e) => handleScroll(e, "ESummit")} className="hover:text-gray-500 text white mb-4">
              ABOUT US
            </Link></p>
            <p className="mb-4"><Link href="/#timeline" scroll={false} onClick={(e) => handleScroll(e, "timeline")} className="hover:text-gray-500 text white mb-4">
              SCHEDULE
            </Link></p>
            <p className="mb-4"><Link href="/#faq" scroll={false} onClick={(e) => handleScroll(e, "faq")} className="hover:text-gray-500 text white mb-4">
              FAQ
            </Link></p>
          </div> */}
        </div>
        <div className="relative px-5 text-white pt-8 flex-col flex md:hidden">
          <div className="text-center pointer-events-auto mb-8">
            <h1 className="text-6xl font-bold mb-1">E-CELL</h1>
            <p className="text-xl mb-2">#WeBreedBusiness</p>
            <a href="tel:+918777793331" className="text-lg block mb-1">+91 87777 93331</a>
            <a href="mailto:ecell@vit.ac.in" className="text-lg mb-2">ecell@vit.ac.in</a>
          </div>
          <div className="items-center mb-4 px-2 pointer-events-auto flex flex-wrap justify-center gap-x-16 gap-y-4 text-sm">
            <p>
              <a href="https://www.instagram.com/ecell_vit" className="hover:text-gray-500 flex items-center gap-2">
                <FaInstagram size={20} />
                Instagram
              </a>
            </p>
            <p>
              <a href="https://www.linkedin.com/company/ecellvitvellore" className="hover:text-gray-500 flex items-center gap-2">
                <FaLinkedin size={20} />
                LinkedIn
              </a>
            </p>
            <p>
              <a href="https://www.twitter.com/ecell_vit" className="hover:text-gray-500 flex items-center gap-2">
                <FaXTwitter size={20} />
                Twitter
              </a>
            </p>
            <p>
              <a href="https://www.facebook.com/ecellvit" className="hover:text-gray-500 flex items-center gap-2">
                <FaFacebook size={20} />
                Facebook
              </a>
            </p>
          </div>
        </div>
      </div>
  );
}