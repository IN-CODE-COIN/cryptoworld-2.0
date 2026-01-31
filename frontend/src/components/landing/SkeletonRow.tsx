import { useTheme } from "../../hooks/useTheme";

export const SkeletonRow = () => {
  const { theme } = useTheme();

  return (
    <tr
      className={`transition-colors text-xs ${
        theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
      }`}
    >
      <td className="px-1 sm:px-3 py-3 font-medium text-gray-500 dark:text-gray-400 w-8">
        <div className={`h-4 w-6 rounded animate-pulse ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`} />
      </td>
      <td className="px-2 sm:px-4 py-3 font-medium">
        <div className="flex items-center gap-1 sm:gap-3">
          <div className={`w-6 h-6 rounded-full animate-pulse flex-shrink-0 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`} />
          <div className="flex flex-col min-w-0 flex-1">
            <div className={`h-4 w-20 sm:w-24 rounded animate-pulse font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`} />
            <div className={`h-3 w-10 sm:w-12 rounded animate-pulse text-xs text-gray-500 dark:text-gray-400 mt-1 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`} />
          </div>
        </div>
      </td>
      <td className="px-2 sm:px-4 py-3 text-right font-medium text-gray-900 dark:text-white text-sm sm:text-base">
        <div className={`h-4 w-16 sm:w-20 rounded animate-pulse ml-auto ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`} />
      </td>
      <td className="px-1 sm:px-4 py-3 text-right font-medium text-sm sm:text-base">
        <div className={`h-4 w-8 sm:w-12 rounded animate-pulse ml-auto ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`} />
      </td>
      <td className="px-1 sm:px-4 py-3 text-right text-gray-600 dark:text-gray-400 text-sm sm:text-base">
        <div className={`h-4 w-12 sm:w-20 rounded animate-pulse ml-auto ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`} />
      </td>
      <td className="px-2 sm:px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
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
