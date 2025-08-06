interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

export default function StatsCard({ title, value, icon, iconBgColor, iconColor }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 ${iconBgColor} bg-opacity-10 rounded-full`}>
          <i className={`${icon} ${iconColor} text-xl`}></i>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
