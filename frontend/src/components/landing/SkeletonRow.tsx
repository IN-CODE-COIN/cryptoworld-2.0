import { useTheme } from "../../hooks/useTheme";

export const SkeletonRow = () => {
  const { theme } = useTheme();

  return (
    <tr
      className={`transition-colors ${
        theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
      }`}
    >
      <td className="px-2 py-2 font-medium text-gray-500 dark:text-gray-400">
        <div className={`h-4 w-6 rounded animate-pulse ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`} />
      </td>
      <td className="px-2 py-2 font-medium">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full animate-pulse ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`} />
          <div className={`h-4 w-24 rounded animate-pulse ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`} />
        </div>
      </td>
      <td className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
        <div className={`h-4 w-12 rounded animate-pulse ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`} />
      </td>
      <td className="px-2 py-2 text-right font-medium text-gray-900 dark:text-white">
        <div className={`h-4 w-16 rounded animate-pulse ml-auto ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`} />
      </td>
      <td className="px-2 py-2 text-right font-medium">
        <div className={`h-4 w-12 rounded animate-pulse ml-auto ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`} />
      </td>
      <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300">
        <div className={`h-4 w-20 rounded animate-pulse ml-auto ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`} />
      </td>
      <td className="px-2 py-2 text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className={`h-6 w-6 rounded animate-pulse ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`} />
          <div className={`h-6 w-6 rounded animate-pulse ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`} />
        </div>
      </td>
    </tr>
  );
};
