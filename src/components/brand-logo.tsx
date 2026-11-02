import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
}

export function BrandLogo({ className = "", size = "md", href = "/" }: BrandLogoProps) {
  const sizeClasses = {
    sm: "h-7 w-auto",
    md: "h-9 w-auto sm:h-10",
    lg: "h-11 w-auto sm:h-12",
    xl: "h-14 w-auto",
  };

  const dimensions = {
    sm: { width: 168, height: 28 },
    md: { width: 216, height: 36 },
    lg: { width: 264, height: 44 },
    xl: { width: 312, height: 52 },
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
