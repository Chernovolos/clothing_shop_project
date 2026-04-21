import type { SVGProps } from "react";

interface MyIconProps {
  className?: string;
}

const Icon = (props: MyIconProps & SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    fill="currentColor"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export default Icon;
