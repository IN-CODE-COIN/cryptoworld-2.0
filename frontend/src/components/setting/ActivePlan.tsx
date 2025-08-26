import { useAuth } from "../../hooks/useAuth";

export const ActivePlan: React.FC = () => {
  const { user } = useAuth();

  const userPlan = user?.rol === "pro" ? "Profesional" : "Gratuito";
  const usedtrial = user?.trial_ends_at !== null ? "- Version de Prueba" : "";

  return (
    <div className="w-full overflow-x-auto mt-15">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Plan Actual
      </h2>
      <p className="mt-1 text-gray-500">
        Este es el plan que estás usando actualmente.
      </p>
      <div className="border rounded-lg border-gray-400 dark:bg-gray-600 px-5 py-5 dark:text-white text-xl font-semibold mt-5">
        {userPlan} {usedtrial}
      </div>
    </div>
  );
};
