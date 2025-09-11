'use client'

import { useEffect, useRef } from 'react'
import DottedMap from 'dotted-map'

export function Map() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Create the dotted map with basic configuration
    const map = new DottedMap({
      height: 200,
      grid: 'vertical'
    })

    // Generate SVG path data
    const svgMap = map.getSVG({
      radius: 0.8,
      color: '#6b7280', // gray-500
      shape: 'circle'
    })

    // Set the SVG content
    svgRef.current.innerHTML = svgMap
  }, [])

  return (
    <div className="w-full h-48 flex items-center justify-center">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 300 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  )
}
