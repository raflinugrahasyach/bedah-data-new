import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function BrandLogo({ className = "", size = "md", href = "/" }: BrandLogoProps) {
  const dimensions = {
    sm: { width: 130, height: 32 },
    md: { width: 165, height: 40 },
    lg: { width: 200, height: 48 },
  };

  const { width, height } = dimensions[size];

  const content = (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <Image
        src="/brand/logo-color.png"
        alt="Bedah Data"
        width={width}
        height={height}
        priority
        className="h-auto w-auto object-contain max-h-[38px]"
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
