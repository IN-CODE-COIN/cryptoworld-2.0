import { useTheme } from "../../hooks/useTheme";

export const ServicesLanding = () => {
  const { theme } = useTheme();

  const services = [
    {
      icon: "📊",
      title: "Monitoreo en Tiempo Real",
      description:
        "Sigue el precio y desempeño de tus criptomonedas favoritas con actualizaciones en tiempo real.",
    },
    {
      icon: "💼",
      title: "Gestión de Cartera",
      description:
        "Organiza y administra tus inversiones cripto en un dashboard intuitivo y fácil de usar.",
    },
    {
      icon: "📈",
      title: "Análisis Detallado",
      description:
        "Accede a gráficos detallados, estadísticas de mercado y análisis técnico de cada cripto.",
    },
    {
      icon: "⭐",
      title: "Watchlist Personalizada",
      description:
        "Crea tu propia lista de seguimiento con las criptomonedas que más te interesen.",
    },
    {
      icon: "🔔",
      title: "Alertas Personalizadas",
      description:
        "Recibe notificaciones cuando los precios alcanzan los niveles que defines.",
    },
    {
      icon: "🛡️",
      title: "Seguridad Premium",
      description:
        "Tus datos están protegidos con encriptación de nivel empresarial.",
    },
  ];

  return (
    <section
      id="services"
      className={`py-20 ${
        theme === "dark"
          ? "bg-gray-900 border-t border-gray-800"
          : "bg-gray-50 border-t border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Funcionalidades Poderosas
          </h2>
          <p
            className={`text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            Todo lo que necesitas para dominar el mercado de criptomonedas
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                  : "bg-white border-gray-200 hover:border-blue-500"
              }`}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3
                className={`text-xl font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {service.title}
              </h3>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
