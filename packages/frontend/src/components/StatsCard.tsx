export const StatsCard = ({ title, value, desc }: { title: string, value: number | undefined, desc: string }) => {
    return (
        <div className="stats text-sm md:text-base shadow h-26 md:h-36 overflow-hidden ">
            <div className="stat bg-slate-700">
                <div className="stat-title">{title}</div>
                <div className="stat-value text-lg md:text-2xl">{value}</div>
                <div className="stat-desc text-sm">{desc}</div>
            </div>
        </div>
    )
}