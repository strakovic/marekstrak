import { type SVGProps } from 'react'

export default function MagicUI(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <title>{'MagicUI'}</title>
            <circle cx="12" cy="12" r="10" fill="url(#magicui-gradient)" />
            <path
                d="M12 6l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3L12 6z"
                fill="white"
            />
            <defs>
                <linearGradient id="magicui-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
            </defs>
        </svg>
    )
}

