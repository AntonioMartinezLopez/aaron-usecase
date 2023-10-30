export const StatsCard = ({ title, value, desc }: { title: string, value: number | undefined, desc: string }) => {
    return (
        <div className="stats text-base shadow h-36 min-h-[9rem] overflow-hidden ">
            <div className="stat bg-slate-700">
                <div className="stat-title">{title}</div>
                <div className="stat-value">{value}</div>
                <div className="stat-desc text-sm">{desc}</div>
            </div>
        </div>
    )
}