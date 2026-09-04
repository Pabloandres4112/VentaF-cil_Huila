import type { SVGProps } from "react";

function Svg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    />
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={2} />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth={2} />
      <path d="M3 10.5h18" stroke="currentColor" strokeWidth={2} />
    </Svg>
  );
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M12 21s-6.5-5.4-6.5-10.5a6.5 6.5 0 1113 0C18.5 15.6 12 21 12 21z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.5" r="2.25" stroke="currentColor" strokeWidth={2} />
    </Svg>
  );
}

export function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth={2} />
      <path
        d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M20.5 14.7A8.5 8.5 0 019.3 3.5a8.5 8.5 0 1011.2 11.2z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M3 4h2l2.2 11.4a2 2 0 002 1.6h7.6a2 2 0 002-1.6L20 8H6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" />
    </Svg>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ImagePlaceholderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth={1.6} />
      <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth={1.6} />
      <path
        d="M4 17l5-5 3.5 3.5L16 12l4 5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M4 20l1-4.5L15.5 5 19 8.5 8.5 19 4 20z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.9 17.1 10.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M4 7h16M9.5 7V5a1 1 0 011-1h3a1 1 0 011 1v2m-8 0 1 12.5A1.5 1.5 0 0 0 9 21h6a1.5 1.5 0 0 0 1.5-1.5L17.5 7"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2" stroke="currentColor" strokeWidth={1.8} />
      <path
        d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"
        stroke="currentColor"
        strokeWidth={1.8}
      />
    </Svg>
  );
}

export function ExternalLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M9 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3M14 4h6v6M20 4 11 13"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ColombiaFlagIcon({
  width = 18,
  height = 13,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 13"
      aria-hidden="true"
      className={className}
    >
      <rect width="18" height="13" rx="1.5" fill="#FCD116" />
      <path d="M0 6.5h18v3.25a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 0 9.75V6.5z" fill="#003893" />
      <path d="M0 9.75h18V11.5A1.5 1.5 0 0 1 16.5 13h-15A1.5 1.5 0 0 1 0 11.5V9.75z" fill="#CE1126" />
    </svg>
  );
}

export function PaletteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-.4-.15-.75-.4-1.05-.25-.3-.4-.65-.4-1.05 0-.83.67-1.4 1.5-1.4H16a3 3 0 0 0 3-3c0-4.42-3.13-8-7-8Z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={7.5} cy={10.5} r={1.1} fill="currentColor" />
      <circle cx={11} cy={7.5} r={1.1} fill="currentColor" />
      <circle cx={15} cy={8.5} r={1.1} fill="currentColor" />
    </Svg>
  );
}

export function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path
        d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2 1 2.4.1.1 1.7 2.6 4.1 3.6.6.2 1 .4 1.4.5.6.2 1.1.1 1.5.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3z"
        fill="currentColor"
      />
      <path
        d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5.1-1.3c1.4.8 3.1 1.2 4.9 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.2-.4-4.5-1.2l-.3-.2-3 .8.8-2.9-.2-.3C4 15 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z"
        fill="currentColor"
      />
    </Svg>
  );
}
