import CodeBlockIllustration from "@/components/code-block-illustration"
import IntelliJIDEA from '@/components/logos/intellij'
import VisualStudioCode from '@/components/logos/vs-code'
import Windsurf from '@/components/logos/windsurf'

export default function APIFeaturesSection() {
    return (
        <section className="bg-background">
            <div className="bg-muted @container py-24 [--color-secondary:var(--color-brand-100)]">
                <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
                    <div className="@3xl:grid-cols-3 relative grid gap-12">
                        <div className="@3xl:pb-3 flex flex-col justify-between gap-12">
                            <div>
                                <h2 className="relative z-10 text-balance text-3xl font-neue-montreal-bold md:text-4xl">Build powerful integrations with our API</h2>
                                <p className="text-muted-foreground my-6 max-w-2xl text-lg font-neue-montreal-book">Generate payment links at scale, enabling seamless marketing campaigns, efficient sales processes, and faster payment.</p>
                            </div>

                            <div className="max-w-56 space-y-3">
                                <h3 className="font-neue-montreal-medium">Native IDE Support</h3>
                                <div className="*:bg-foreground/5 grid grid-cols-3 gap-0.5 *:flex *:items-center *:justify-center *:rounded *:px-2 *:py-3">
                                    <div className="!rounded-l-lg">
                                        <IntelliJIDEA className="size-5" />
                                    </div>
                                    <div>
                                        <VisualStudioCode className="size-5" />
                                    </div>
                                    <div className="!rounded-r-lg">
                                        <Windsurf className="size-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="@3xl:col-span-2 mt-auto h-fit">
                            <CodeBlockIllustration />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
