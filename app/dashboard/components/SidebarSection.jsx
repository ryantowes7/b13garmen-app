export default function SidebarSection({ title, children }) {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-1">{title}</h3>
            <div className="flex flex-col gap-1">
                {children}
            </div>
        </div>
    );
}