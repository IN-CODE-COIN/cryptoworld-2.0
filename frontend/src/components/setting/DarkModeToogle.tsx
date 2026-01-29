import { SunFilled, MoonFilled } from "@ant-design/icons";
import { useTheme } from "../../hooks/useTheme";

const themeOptions = [
  {
    code: "light",
    label: "Claro",
    icon: <SunFilled className="text-yellow-500 text-2xl" />,
    description:
      "Modo claro para mejor visibilidad en entornos iluminados.",
  },
  {
    code: "dark",
    label: "Oscuro",
    icon: <MoonFilled className="text-blue-400 text-2xl" />,
    description:
      "Modo oscuro para mejor visibilidad en entornos con poca luz.",
  },
];

export const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const handleChange = (value: string) => {
    if (value !== theme) toggleTheme();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-2">
        Tema
      </h3>
      <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        Elige entre claro y oscuro para adaptarte a tus preferencias.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {themeOptions.map(({ code, label, icon, description }) => {
          const isSelected = theme === code;
          return (
            <button
              key={code}
              onClick={() => handleChange(code)}
              className={`rounded-lg border p-4 text-left transition-all duration-300 ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{icon}</div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold mb-1 ${
                      isSelected
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {label}
                  </h4>
                  <p
                    className={`text-sm ${
                      isSelected
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {description}
                  </p>
                </div>
                {isSelected && (
                  <div className="text-blue-500 text-lg">✓</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
