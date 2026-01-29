import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export const ActivePlan: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const userPlan = user?.rol === "pro" ? "Profesional" : "Gratuito";
  const usedtrial = user?.trial_ends_at !== null ? "- Versión de Prueba" : "";
  const isPro = user?.rol === "pro";

  return (
    <div className={`rounded-xl border p-6 ${
      theme === "dark"
        ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
        : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
    }`}>
      <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-2">
        Plan Actual
      </h3>
      <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        Este es el plan que estás usando actualmente.
      </p>
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
        isPro
          ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white"
          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
      } font-semibold`}>
        {userPlan} {usedtrial}
      </div>
    </div>
  );
};
