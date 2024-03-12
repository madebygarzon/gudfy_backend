import ImagePlaceholderIcon from "../shared/icons/image-placeholder-icon";
import clsx from "clsx";

type Props = {
  src?: string | null;
  className?: string;
  size?: "xsmall" | "small" | "medium" | "large";
};

export const Thumbnail = ({ src, className, size = "small" }: Props) => {
  return (
    <div
      className={clsx(
        "bg-grey-5  flex items-center justify-center overflow-hidden",
        {
          "h-6 w-[18px]": size === "xsmall",
          "h-10 w-[30px]": size === "small",
          "h-12 w-9": size === "medium",
          "h-[226px] w-[170px]": size === "large",
        },
        className
      )}
    >
      {src ? (
        <img src={src} className="object-cover object-center h-10 w-[30px]" />
      ) : (
        <ImagePlaceholderIcon />
      )}
    </div>
  );
};
