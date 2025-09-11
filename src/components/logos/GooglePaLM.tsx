import { type SVGProps } from 'react'

export default function GooglePaLM(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <title>{'Google PaLM'}</title>
            <circle cx="12" cy="12" r="10" fill="url(#palm-gradient)" />
            <path
                d="M12 3v6l5-3-5-3zm0 6v6l5-3-5-3zm0 6v6l5-3-5-3z"
                fill="white"
                fillOpacity="0.9"
            />
            <path
                d="M12 3v6l-5-3 5-3zm0 6v6l-5-3 5-3zm0 6v6l-5-3 5-3z"
                fill="white"
                fillOpacity="0.7"
            />
            <defs>
                <linearGradient id="palm-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4285F4" />
                    <stop offset="25%" stopColor="#34A853" />
                    <stop offset="50%" stopColor="#FBBC04" />
                    <stop offset="75%" stopColor="#EA4335" />
                    <stop offset="100%" stopColor="#4285F4" />
                </linearGradient>
            </defs>
        </svg>
    )
}

