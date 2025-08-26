import React from "react";

export const LegalNotice: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          1. Identificación del Responsable
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la
          Sociedad de la Información y Comercio Electrónico (LSSI-CE), se
          informa que el titular de esta plataforma es{" "}
          <strong>Nombre de tu Empresa / Titular</strong>, con NIF/CIF{" "}
          <strong>XXXXXXX</strong> y domicilio en{" "}
          <strong>Dirección completa</strong>. Puedes ponerte en contacto a
          través del correo electrónico{" "}
          <a
            href="mailto:contacto@tudominio.com"
            className="text-indigo-600 dark:text-indigo-400"
          >
            contacto@tudominio.com
          </a>
          .
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          2. Protección de Datos
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Los datos personales facilitados por los usuarios se tratan de acuerdo
          con lo establecido en el Reglamento (UE) 2016/679 (RGPD) y la Ley
          Orgánica 3/2018 (LOPDGDD). El responsable garantiza la
          confidencialidad y seguridad de los datos, y estos solo se utilizarán
          para la gestión de los servicios ofrecidos en la plataforma.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          3. Finalidad del Tratamiento
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Los datos podrán ser utilizados para la prestación de servicios,
          gestión de la cuenta de usuario, facturación, así como para el envío
          de comunicaciones relacionadas con el servicio contratado. En ningún
          caso se cederán a terceros salvo obligación legal o consentimiento
          expreso del usuario.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          4. Derechos del Usuario
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Los usuarios tienen derecho a acceder, rectificar, suprimir y portar
          sus datos, así como a oponerse o limitar su tratamiento. Para ejercer
          estos derechos, pueden enviar una solicitud al correo{" "}
          <a
            href="mailto:contacto@tudominio.com"
            className="text-indigo-600 dark:text-indigo-400"
          >
            contacto@tudominio.com
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          5. Propiedad Intelectual
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Todos los contenidos de esta plataforma, incluyendo textos, imágenes,
          logotipos y software, están protegidos por derechos de propiedad
          intelectual e industrial. Queda prohibida su reproducción,
          distribución o modificación sin autorización expresa del titular.
        </p>
      </section>
    </div>
  );
};
