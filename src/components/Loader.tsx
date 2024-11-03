// import { BiLoader } from "react-icons/bi";
import { twMerge } from "tailwind-merge";

interface PropType {
  className?: string
}

const Loader = ({ className }: PropType) => {
  // return <BiLoader className="animate-spin " />;
  return <div
    className={twMerge(
      "w-8 h-8 border-4 border-pink border-dashed rounded-full animate-spin-slow",
      className
    )}
  />;
};

export default Loader;
