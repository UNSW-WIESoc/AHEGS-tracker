import wiesocLogoSVG from "@/imports/wiesoc-logo-navbar.svg";

interface Props {
  size?: "sm" | "md" | "lg";
  /** Tint the logo to a specific hex colour, with transparent background */
  tint?: string;
  className?: string;
}

export default function WiesocLogo({
  size = "md",
  tint = "#9396d4",
  className = "",
}: Props) {
  const heights: Record<string, string> = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  };

  // if (tint) {
  //   return (
  //     <div className={`relative inline-flex items-center ${heights[size]} ${className}`} style={{ isolation: 'isolate' }}>
  //       <img
  //         src={wiesocLogo}
  //         alt="WIESOC"
  //         className={`${heights[size]} w-auto object-contain`}
  //         style={{ filter: 'grayscale(1) contrast(1.1)', mixBlendMode: 'luminosity' }}
  //       />
  //       <div
  //         className="absolute inset-0"
  //         style={{ background: tint, mixBlendMode: 'color', pointerEvents: 'none' }}
  //       />
  //       {/* Knock out white background */}
  //       <div
  //         className="absolute inset-0"
  //         style={{ background: 'transparent', mixBlendMode: 'multiply', pointerEvents: 'none' }}
  //       />
  //     </div>
  //   )
  // }

  return (
    <div
      className={`relative inline-flex items-center ${heights[size]} ${className}`}
      style={{
        width: "auto",
        aspectRatio: "4 / 1",
        backgroundColor: tint,
        maskImage: `url(${wiesocLogoSVG})`,
        WebkitMaskImage: `url(${wiesocLogoSVG})`,
        maskRepeat: "no-repeat",
        maskSize: "contain",
        maskPosition: "center",
        isolation: "isolate",
      }}
    />
  );
}