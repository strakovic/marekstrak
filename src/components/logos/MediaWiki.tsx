import { type SVGProps } from 'react'

export default function MediaWiki(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <title>{'MediaWiki'}</title>
            <circle cx="12" cy="12" r="10" fill="#006699" />
            <path
                d="M8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h6v2H8v-2z"
                fill="white"
            />
            <path
                d="M6 6h2v12H6V6z"
                fill="white"
            />
        </svg>
    )
}

