import { type SVGProps } from 'react'

export default function VSCodium(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <title>{'VSCodium'}</title>
            <path
                d="M17.5 2L6.5 12l-2.5-2L2 12l2.5 2L17.5 22L22 19V5L17.5 2z"
                fill="url(#vscodium-gradient)"
            />
            <path
                d="M17.5 2L6.5 12L17.5 22"
                stroke="white"
                strokeWidth="0.5"
                strokeOpacity="0.5"
            />
            <defs>
                <linearGradient id="vscodium-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0078D4" />
                    <stop offset="100%" stopColor="#005A9E" />
                </linearGradient>
            </defs>
        </svg>
    )
}

