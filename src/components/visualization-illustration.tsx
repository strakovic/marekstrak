export const VisualizationIllustration = () => {
    return (
        <div
            aria-hidden
            className="mask-b-from-65% group relative -mx-4 px-4 pt-6">
            <div className="bg-green-50 dark:bg-green-950 relative z-10 rounded-2xl p-6 shadow-xl shadow-black/10 border border-green-200/50 dark:border-green-800/50">
                <div className="text-foreground font-medium">
                    <span className="bg-amber-100 py-1 text-amber-900">Spending</span> Limit
                </div>
                <div className="text-muted-foreground mt-0.5 text-sm">New users by First user primary channel group</div>
                <div className="relative mb-4 mt-4 flex">
                    <div className="h-5 w-1/5 rounded-l-md bg-green-300 dark:bg-green-700" />
                    <div className="bg-red-500 h-5 w-1/5 duration-300 group-hover:w-[90%]" />
                    <div className="h-5 w-3/5 rounded-r-md border border-gray-300 dark:border-gray-600 duration-300 [--stripes-color:theme(colors.zinc.300)] [background-image:linear-gradient(-45deg,var(--stripes-color)_25%,transparent_25%,transparent_50%,var(--stripes-color)_50%,var(--stripes-color)_75%,transparent_75%,transparent)] [background-size:5px_5px] group-hover:w-[10%]" />
                </div>
                <div className="flex gap-1 border-b border-dashed pb-3">
                    <div className="w-2/5 group-hover:w-[90%] transition-all duration-300">
                        <div className="text-foreground text-xl font-medium">
                            <span className="group-hover:opacity-0 transition-opacity duration-300">40%</span>
                            <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">90%</span>
                        </div>
                        <div className="text-muted-foreground text-sm">Used</div>
                    </div>
                    <div className="w-3/5 group-hover:w-[10%] transition-all duration-300">
                        <div className="text-foreground text-xl font-medium">
                            <span className="group-hover:opacity-0 transition-opacity duration-300">60%</span>
                            <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">10%</span>
                        </div>
                        <div className="text-muted-foreground text-sm">Free</div>
                    </div>
                </div>
                <div className="mt-3 space-y-1">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                        <div className="size-1.5 rounded-full bg-[color-mix(in_oklab,var(--color-foreground)50%,var(--color-primary))]"></div>
                        <div className="line-clamp-1 text-sm font-medium">
                            Running <span className="text-muted-foreground">(20%)</span> average of 12 Minutes
                        </div>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                        <div className="bg-primary size-1.5 rounded-full"></div>
                        <div className="line-clamp-1 text-sm font-medium">
                            Swimming <span className="text-muted-foreground">(20%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}