import logo from "../assets/logoonly.png";

const Logo = ({ size = 69 }: { size?: number }) => {
  return (
    <img
      src={logo}
      alt="logo"
      width={size}
      height={size}
    className="rounded-xl"/>
  );
};

export default Logo;