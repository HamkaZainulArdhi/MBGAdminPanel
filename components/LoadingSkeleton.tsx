import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="flex h-screen">
            {/* SIDEBAR — lebar ~300px, ada logo di atas, nav items, user info di bawah */}
            <aside className="w-[00px] shrink-0 border-r flex flex-col h-full hidden md:flex">
                {/* Logo area */}
                <div className="flex items-center gap-3 p-5 border-b h-[72px]">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-20" />
                        <Skeleton className="h-3.5 w-16" />
                        <Skeleton className="h-3.5 w-24" />
                    </div>
                </div>

                {/* Nav items */}
                

                {/* User info di bawah */}
                <div className="p-4 border-t space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-1">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-3.5 w-16" />
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* NAVBAR — icon toggle sidebar, label halaman, icon tema di kanan */}
                
                {/* CONTENT */}
                <div className="flex-1 overflow-auto p-8 bg-muted/30 space-y-6">
                    {/* Page title + subtitle */}
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-56" />
                        <Skeleton className="h-4 w-72" />
                    </div>

                    {/* Filter bar — search + 3 dropdown */}
                    <div className="bg-background border rounded-xl p-4 flex items-center gap-3">
                        <Skeleton className="h-10 flex-1 max-w-xs rounded-lg" />
                        <Skeleton className="h-10 w-44 rounded-lg" />
                        <Skeleton className="h-10 w-36 rounded-lg" />
                        <Skeleton className="h-10 w-44 rounded-lg" />
                    </div>

                    {/* Table skeleton */}
                    <div className="bg-background border rounded-xl overflow-hidden">
                        {/* Table header */}
                        <div className="bg-[#1a5276] px-4 py-3 grid grid-cols-[40px_1fr_100px_100px_80px_100px_90px_160px_120px] gap-4">
                            {[...Array(9)].map((_, i) => (
                                <Skeleton key={i} className="h-4 bg-white/20" />
                            ))}
                        </div>

                        {/* Table rows */}
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="px-4 py-4 grid grid-cols-[40px_1fr_100px_100px_80px_100px_90px_160px_120px] gap-4 border-b last:border-0 items-center"
                            >
                                <Skeleton className="h-4 w-5" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-4 w-16" />
                                <div className="space-y-1">
                                    <Skeleton className="h-3.5 w-10" />
                                    <Skeleton className="h-3.5 w-8" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}