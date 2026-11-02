import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
}

export function BrandLogo({ className = "", size = "md", href = "/" }: BrandLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-10 w-auto sm:h-11",
    lg: "h-11 w-auto sm:h-12 md:h-13",
    xl: "h-13 w-auto sm:h-15 md:h-16",
  };

  const dimensions = {
    sm: { width: 192, height: 32 },
    md: { width: 240, height: 40 },
    lg: { width: 288, height: 48 },
    xl: { width: 336, height: 56 },
  };

  const { width, height } = dimensions[size];

  const content = (
    <div className={`flex items-center select-none shrink-0 ${className}`}>
      <Image
        src="/brand/logo-color.png"
        alt="Bedah Data"
        width={width}
        height={height}
        priority
        className={`${sizeClasses[size]} max-w-full object-contain shrink-0`}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block shrink-0 transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
