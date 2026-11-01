# Marketing Catalyst

Actúa como un arquitecto de producto, diseñador UX/UI senior y desarrollador full stack experto en aplicaciones SaaS B2B, automatización comercial, CRM, email marketing, WhatsApp Business Platform, IA generativa y cumplimiento normativo RGPD, LOPDGDD y LSSI-CE.

 

Quiero construir una aplicación web SaaS denominada MarketingHub AI para gestionar campañas comerciales multicanal por email y WhatsApp, orientada a captar nuevos clientes, trabajar clientes existentes, generar mensajes publicitarios personalizados, revisar envíos antes de lanzarlos, gestionar respuestas de clientes y automatizar campañas evolutivas con refuerzos sucesivos.

La aplicación debe estar pensada para empresas que quieren lanzar campañas comerciales, pero debe incorporar desde el diseño controles de cumplimiento legal, consentimiento, trazabilidad, opt-in, opt-out, auditoría, revisión humana y protección de datos.

Las distintas funcionalidades que se describen a continuación, están separadas por apartados con rótulo en el que se enumera cada apartado. Los primeros siete módulos ya están construidos y se conectarán a esta aplicación más adelante. Céntrate en construir los módulos número 8, 9, 10 y 11. Los módulos posteriores también están construidos y se integrarán más adelante. Ten en cuenta, no obstante. que los módulos iniciales, del 1 al 7 y posteriores al 11existirán con las funciones que se describen que se integrarán.

IMPORTANTE:

No construyas una aplicación para hacer spam, scraping indiscriminado ni envío masivo no autorizado. La aplicación solo podrá usar datos de contacto obtenidos de forma lícita, fuentes permitidas, registros propios, bases verificadas o contactos con consentimiento válido. Todo contacto deberá tener registrada su base jurídica, origen del dato, fecha de obtención, consentimiento por canal, finalidad autorizada y estado de oposición o baja.

 

Desarrolla una primera versión funcional en Lovable con una arquitectura modular, moderna, responsive, escalable y preparada para conectarse posteriormente con APIs reales de email, WhatsApp Business Platform, CRM, bases de datos externas, herramientas de enriquecimiento de leads y modelos de IA.

 

La aplicación debe incluir los siguientes módulos:

 

1. Dashboard principal

 

Crear un dashboard ejecutivo con indicadores generales:

 

- Número total de clientes existentes.

- Número total de potenciales clientes.

- Leads nuevos detectados.

- Leads pendientes de validar.

- Leads con consentimiento válido.

- Leads sin consentimiento.

- Clientes activos.

- Campañas activas.

- Campañas programadas.

- Campañas finalizadas.

- Mensajes enviados por email.

- Mensajes enviados por WhatsApp.

- Mensajes pendientes de revisión.

- Mensajes en borrador.

- Respuestas recibidas.

- Respuestas pendientes de revisar.

- Tasa de apertura de email.

- Tasa de respuesta.

- Tasa de conversión.

- Tasa de baja u opt-out.

- Alertas de cumplimiento.

- Alertas de contactos sin consentimiento.

- Alertas de campañas con revisión pendiente.

- Gráficos temporales por canal, campaña, producto y segmento.

 

El dashboard debe permitir filtrar por:

 

- Campaña.

- Producto o servicio.

- Segmento de cliente.

- Canal.

- Estado del cliente.

- Estado del consentimiento.

- Fecha.

- Responsable comercial.

 

2. Módulo de clientes existentes

 

Crear un CRM interno para gestionar clientes ya existentes.

 

Cada cliente existente tendrá como mínimo:

 

- Nombre o razón social.

- Nombre comercial.

- Tipo de cliente: empresa, autónomo, particular, administración pública u otro.

- NIF/CIF opcional.

- Sector.

- Subsector.

- Tamaño de empresa.

- País.

- Provincia.

- Ciudad.

- Web.

- LinkedIn.

- Persona de contacto.

- Cargo de la persona de contacto.

- Email.

- Teléfono.

- WhatsApp.

- Idioma preferente.

- Zona horaria.

- Responsable comercial.

- Productos contratados.

- Productos potencialmente relevantes.

- Estado comercial: activo, inactivo, en oportunidad, en riesgo, perdido.

- Etiquetas.

- Notas.

- Histórico de interacciones.

- Histórico de campañas recibidas.

- Consentimiento para email marketing.

- Consentimiento para WhatsApp marketing.

- Fecha de consentimiento por canal.

- Fuente del consentimiento.

- Evidencia del consentimiento.

- Estado de baja u oposición por canal.

- Fecha de baja u oposición.

- Observaciones legales.

 

Incluir vistas de tabla, ficha detallada, edición rápida, filtros avanzados y búsqueda global.

 

3. Módulo de potenciales clientes y prospección

 

Crear un módulo para identificar potenciales clientes para un tipo de negocio dado.

 

El usuario podrá introducir:

 

- Tipo de negocio objetivo.

- Producto o servicio a vender.

- País o zona geográfica.

- Sector objetivo.

- Tamaño de empresa objetivo.

- Cargo objetivo dentro de la empresa.

- Palabras clave.

- Exclusiones.

- Idioma.

- Nivel de prioridad.

- Criterios de encaje comercial.

 

La aplicación deberá generar una lista de potenciales clientes con:

 

- Nombre de empresa.

- Web.

- Sector.

- Ubicación.

- Descripción breve.

- Posible necesidad detectada.

- Nivel de encaje con el producto.

- Justificación del encaje.

- Fuente del dato.

- Fecha de obtención.

- Persona de contacto si existe fuente lícita.

- Email corporativo si existe fuente válida.

- Teléfono corporativo si existe fuente válida.

- URL de origen.

- Estado de validación.

- Estado de consentimiento.

- Riesgo legal del contacto.

- Recomendación de acción siguiente.

 

Condiciones obligatorias:

- No se debe asumir que un dato público autoriza el envío de comunicaciones comerciales.

- Todo lead nuevo debe pasar por un estado de validación antes de incorporarse a una campaña.

- Todo contacto debe tener trazabilidad de origen.

- Si no existe consentimiento para marketing, la aplicación debe marcarlo como “No apto para campaña comercial directa”.

- La aplicación debe permitir preparar acciones previas de obtención de consentimiento o contacto legítimo, pero no enviar campañas comerciales sin base válida.

- Si se integra un sistema de scraping o crawling en el futuro, debe respetar robots.txt, términos de uso, límites de frecuencia, fuentes permitidas y normativa de protección de datos.

- Incluir un campo de “base jurídica propuesta” y otro de “validación legal requerida”.

 

4. Módulo de productos y servicios

 

Crear un catálogo de productos o servicios sobre los que se podrán diseñar campañas.

 

Cada producto tendrá:

 

- Nombre.

- Descripción corta.

- Descripción comercial.

- Público objetivo.

- Problemas que resuelve.

- Beneficios principales.

- Argumentos de venta.

- Casos de uso.

- Sectores recomendados.

- Objeciones habituales.

- Respuestas a objeciones.

- Materiales comerciales asociados.

- URL de landing page.

- Precio orientativo.

- Estado: activo, pausado, retirado.

- Etiquetas.

- Nivel de prioridad comercial.

 

5. Módulo de campañas

 

Crear un módulo completo de gestión de campañas.

 

Cada campaña tendrá:

 

- Nombre de campaña.

- Producto o servicio asociado.

- Objetivo de la campaña.

- Tipo de campaña: captación, reactivación, upselling, cross-selling, fidelización, recordatorio, evento, lanzamiento, nutrición.

- Público objetivo.

- Segmento de clientes.

- Canal principal: email, WhatsApp o mixto.

- Canales secundarios.

- Fecha de inicio.

- Fecha de fin.

- Estado: borrador, pendiente de revisión, aprobada, programada, activa, pausada, finalizada, cancelada.

- Responsable.

- Presupuesto orientativo.

- Métricas objetivo.

- Mensaje principal.

- Secuencia de mensajes.

- Reglas de evolución.

- Reglas de exclusión.

- Reglas de baja.

- Requisitos de consentimiento.

- Validación legal.

- Observaciones.

 

La campaña debe poder aplicarse a:

 

- Un grupo de clientes.

- Un grupo de potenciales clientes.

- Un producto concreto.

- Un cliente concreto.

- Un cliente y producto concreto.

- Un segmento comercial.

- Una combinación de filtros.

 

6. Módulo de generación de mensajes con IA

 

Crear un módulo para generar mensajes publicitarios con IA.

 

El usuario podrá seleccionar:

 

- Campaña.

- Producto.

- Canal: email o WhatsApp.

- Tipo de mensaje.

- Tono: formal, cercano, ejecutivo, consultivo, comercial, técnico, breve, premium.

- Idioma.

- Nivel de personalización.

- Objetivo del mensaje.

- Llamada a la acción.

- Longitud.

- Segmento.

- Cliente concreto.

- Datos del cliente a utilizar.

- Restricciones legales.

- Palabras o expresiones prohibidas.

- Propuesta de valor.

- Objeciones a anticipar.

 

La IA deberá poder generar:

 

- Mensaje genérico para toda la campaña.

- Mensajes personalizados por cliente.

- Asuntos de email.

- Preheaders.

- Cuerpo del email.

- Mensajes breves para WhatsApp.

- Mensajes de seguimiento.

- Mensajes de recordatorio.

- Mensajes de reactivación.

- Mensajes de agradecimiento.

- Respuestas a objeciones.

- Variantes A/B.

- Mensajes adaptados a cliente, sector, cargo o producto.

 

Cada mensaje generado debe incluir:

 

- Texto del mensaje.

- Canal recomendado.

- Cliente asignado.

- Campaña asociada.

- Producto asociado.

- Nivel de personalización.

- Variables utilizadas.

- Riesgos detectados.

- Estado de revisión.

- Fecha de generación.

- Autor o modelo que lo generó.

- Versión.

- Historial de cambios.

 

Condiciones obligatorias:

- La IA no debe inventar datos del cliente.

- Si falta información, debe generar un mensaje más genérico.

- Debe evitar afirmaciones no verificadas.

- Debe evitar promesas comerciales absolutas.

- Debe respetar el consentimiento y las preferencias del cliente.

- Debe incluir opción de baja cuando aplique.

- Debe permitir edición manual antes del envío.

 

7. Módulo de revisión de mensajes por cliente

 

Crear un módulo de revisión previa que permita ver los mensajes asignados a cada cliente antes de enviarlos.

 

Debe existir una vista tipo bandeja o tabla con:

 

- Cliente.

- Producto.

- Campaña.

- Canal.

- Mensaje asignado.

- Estado del consentimiento.

- Estado del mensaje.

- Riesgo legal.

- Nivel de personalización.

- Fecha prevista de envío.

- Acciones disponibles.

 

Acciones:

 

- Ver detalle.

- Editar mensaje.

- Regenerar mensaje con IA.

- Aprobar mensaje.

- Rechazar mensaje.

- Marcar para revisión legal.

- Marcar para revisión comercial.

- Enviar individualmente.

- Programar individualmente.

- Excluir cliente de la campaña.

- Ver histórico del cliente.

- Ver justificación de personalización.

 

Debe existir una pantalla de detalle del mensaje con:

 

- Datos del cliente.

- Datos del producto.

- Datos de la campaña.

- Mensaje original.

- Mensaje editado.

- Comparativa de versiones.

- Motivo de personalización.

- Riesgos.

- Consentimientos.

- Botón de aprobar.

- Botón de enviar.

- Botón de guardar como borrador.

- Botón de devolver a generación.

 

8. Módulo de envíos

 

Crear un módulo para gestionar envíos individuales y masivos.

 

Tipos de envío:

 

- Envío individual inmediato.

- Envío individual programado.

- Envío masivo inmediato.

- Envío masivo programado.

- Envío por lotes.

- Envío de secuencias sucesivas.

- Envío condicionado por respuesta.

- Envío condicionado por falta de respuesta.

 

Antes de permitir un envío masivo, la aplicación debe validar:

 

- Que la campaña está aprobada.

- Que el mensaje está aprobado.

- Que el cliente tiene consentimiento válido para el canal.

- Que no existe baja u oposición.

- Que el canal está habilitado.

- Que la frecuencia de contacto es aceptable.

- Que no hay alertas legales bloqueantes.

- Que se ha incluido mecanismo de baja cuando aplique.

- Que no se supera el límite de envíos configurado.

 

Para cada envío registrar:

 

- Cliente.

- Canal.

- Campaña.

- Producto.

- Mensaje.

- Estado: pendiente, programado, enviado, entregado, leído, respondido, fallido, cancelado.

- Fecha de programación.

- Fecha de envío.

- Fecha de entrega.

- Fecha de lectura si está disponible.

- Fecha de respuesta.

- Error si aplica.

- ID externo del proveedor si aplica.

- Usuario que aprobó.

- Usuario que envió.

- Historial.

 

9. Módulo de campañas evolutivas y secuencias

 

La aplicación debe permitir programar campañas con mensajes sucesivos de refuerzo.

 

Cada campaña podrá tener una secuencia de pasos:

 

- Mensaje inicial.

- Primer seguimiento.

- Segundo seguimiento.

- Recordatorio.

- Mensaje con caso de uso.

- Mensaje con propuesta de valor ampliada.

- Mensaje de cierre.

- Mensaje de reactivación.

- Mensaje posterior a respuesta.

- Mensaje posterior a no respuesta.

 

Cada paso tendrá:

 

- Orden.

- Canal.

- Plantilla.

- Condición de activación.

- Espera entre mensajes.

- Segmento afectado.

- Variación del contenido.

- Objetivo del paso.

- Estado.

- Revisión requerida.

 

Condiciones posibles:

 

- Si el cliente no responde.

- Si el cliente responde positivamente.

- Si el cliente responde negativamente.

- Si el cliente pide más información.

- Si el cliente solicita baja.

- Si el cliente muestra interés en otro producto.

- Si el email no se entrega.

- Si el WhatsApp no se entrega.

- Si el cliente abre el email pero no responde.

- Si el cliente hace clic.

- Si el cliente agenda reunión.

- Si el comercial marca oportunidad.

 

La IA deberá poder adaptar el contenido de los mensajes sucesivos en función de:

 

- Historial de interacción.

- Respuesta del cliente.

- Producto.

- Segmento.

- Objeciones detectadas.

- Tono de la conversación.

- Estado de la oportunidad.

 

10. Bandeja de entrada

 

Crear una bandeja de entrada unificada para mensajes recibidos de clientes.

 

La bandeja debe mostrar:

 

- Cliente.

- Canal.

- Campaña.

- Producto.

- Fecha.

- Mensaje recibido.

- Sentimiento aparente sin etiquetar emociones internas de personas, solo clasificando intención comercial.

- Intención detectada.

- Prioridad.

- Estado.

- Responsable.

- Próxima acción recomendada.

 

Clasificaciones permitidas:

 

- Interesado.

- Solicita más información.

- Solicita llamada.

- Objeción de precio.

- Objeción de timing.

- No interesado.

- Solicita baja.

- Respuesta automática.

- Error de contacto.

- Queja.

- Otro.

 

Acciones:

 

- Abrir conversación.

- Asignar responsable.

- Generar respuesta con IA.

- Guardar respuesta como borrador.

- Enviar respuesta.

- Marcar como resuelto.

- Crear oportunidad.

- Excluir de campaña.

- Registrar baja.

- Ver histórico.

- Añadir nota.

 

11. Bandeja de salida y borradores

 

Crear una bandeja de salida donde queden almacenadas las respuestas generadas pero no enviadas.

 

La bandeja debe mostrar:

 

- Cliente.

- Canal.

- Campaña.

- Producto.

- Respuesta generada.

- Estado: borrador, pendiente de revisión, aprobada, programada, enviada, cancelada.

- Responsable.

- Fecha de creación.

- Fecha prevista de envío.

- Riesgo legal.

- Acciones.

 

Acciones:

 

- Revisar.

- Editar.

- Aprobar.

- Enviar.

- Programar.

- Cancelar.

- Regenerar con IA.

- Marcar para revisión legal.

- Ver mensaje original del cliente.

 

12. Módulo de respuesta inteligente

 

Cuando llegue una respuesta de un cliente, la aplicación deberá poder preparar una respuesta personalizada.

 

La IA debe analizar:

 

- Mensaje recibido.

- Histórico de la campaña.

- Producto asociado.

- Mensajes previos.

- Estado del cliente.

- Consentimientos.

- Preferencias.

- Próxima acción comercial recomendada.

 

La IA podrá generar:

 

- Respuesta inmediata.

- Respuesta en borrador.

- Respuesta con tono comercial.

- Respuesta consultiva.

- Respuesta breve para WhatsApp.

- Respuesta formal para email.

- Respuesta ante objeción.

- Respuesta para agendar reunión.

- Respuesta para enviar información adicional.

- Respuesta de baja u oposición.

 

Condiciones obligatorias:

- Si el cliente solicita baja, la aplicación debe priorizar registrar la baja y no generar nuevos mensajes comerciales.

- Si el cliente se opone al tratamiento, debe marcarse el contacto como bloqueado para campañas.

- Si el cliente pide información legal o privacidad, derivar a respuesta revisable.

- Si la respuesta contiene una queja, marcar prioridad alta.

- Si la respuesta genera una oportunidad, permitir crear oportunidad comercial.

 

13. Vista masiva por grupo, producto, cliente o producto-cliente

 

La aplicación debe permitir visualizar y operar de forma masiva desde diferentes perspectivas:

 

Vista por grupo de clientes:

- Lista de clientes incluidos.

- Campañas asociadas.

- Mensajes asignados.

- Estado de revisión.

- Estado de envío.

- Respuestas recibidas.

- Métricas agregadas.

 

Vista por producto:

- Campañas del producto.

- Clientes impactados.

- Potenciales clientes.

- Mensajes generados.

- Oportunidades creadas.

- Conversión por segmento.

 

Vista por cliente:

- Datos del cliente.

- Productos ofrecidos.

- Campañas recibidas.

- Mensajes enviados.

- Respuestas.

- Consentimientos.

- Histórico completo.

 

Vista por cliente y producto:

- Estado del producto para ese cliente.

- Mensajes enviados sobre ese producto.

- Respuestas.

- Oportunidad asociada.

- Próxima acción recomendada.

- Secuencia activa.

 

14. Módulo de consentimiento y cumplimiento

 

Crear un módulo específico de cumplimiento.

 

Debe gestionar:

 

- Consentimiento por canal.

- Consentimiento para email.

- Consentimiento para WhatsApp.

- Fecha de consentimiento.

- Fuente del consentimiento.

- Texto aceptado.

- Evidencia.

- Finalidad autorizada.

- Productos o categorías autorizadas.

- Revocación del consentimiento.

- Fecha de revocación.

- Derecho de oposición.

- Baja de comunicaciones.

- Lista interna de exclusión.

- Registro de actividad.

- Auditoría de envíos.

- Política de privacidad asociada.

- Base jurídica.

- Responsable del tratamiento.

- Encargados o proveedores.

- Plazo de conservación.

- Estado de validación legal.

 

Reglas obligatorias:

- No permitir envíos comerciales a contactos sin consentimiento o sin base válida.

- No permitir WhatsApp marketing sin opt-in específico o claramente trazable.

- No permitir email marketing a nuevos contactos sin consentimiento expreso.

- Permitir excepción de cliente existente solo si cumple relación contractual previa, datos obtenidos lícitamente, productos similares y ausencia de oposición.

- Registrar todo envío.

- Registrar toda baja.

- Registrar toda modificación de consentimiento.

- Mostrar alertas legales antes de campañas masivas.

- Incluir privacidad desde el diseño y por defecto.

- Minimizar datos personales.

- Permitir exportar evidencias de consentimiento.

- Permitir anonimizar o eliminar datos cuando proceda.

 

15. Integraciones previstas

 

Preparar la arquitectura para futuras integraciones con:

 

- Proveedor de email transaccional o marketing.

- WhatsApp Business Platform Cloud API.

- CRM externo.

- Base de datos Supabase.

- Servicios de enriquecimiento de leads.

- Herramientas de scraping o crawling autorizadas.

- Modelos de IA para generación de mensajes.

- Sistema de autenticación.

- Sistema de auditoría.

- Webhooks de recepción de respuestas.

- APIs de analítica.

 

En esta primera versión, si no hay APIs reales configuradas, crear conectores simulados o mock services claramente identificados.

 

16. Modelo de datos mínimo

 

Crear tablas o colecciones para:

 

- users

- companies

- customers

- leads

- contacts

- products

- campaigns

- campaign_segments

- campaign_steps

- message_templates

- generated_messages

- message_reviews

- outbound_messages

- inbound_messages

- outbox_drafts

- consents

- opt_outs

- legal_audit_logs

- interaction_history

- opportunities

- ai_generation_logs

- integrations

- settings

 

Cada tabla debe incluir campos created_at, updated_at, created_by, updated_by cuando aplique.

 

17. Roles y permisos

 

Crear control de acceso por roles:

 

Administrador:

- Acceso completo.

 

Responsable comercial:

- Gestiona campañas, clientes, productos, mensajes y oportunidades.

 

Marketing:

- Crea campañas, segmentos, mensajes y plantillas.

 

Legal/compliance:

- Revisa consentimientos, campañas, alertas y auditoría.

 

Comercial:

- Revisa mensajes de sus clientes, responde y crea oportunidades.

 

Solo lectura:

- Consulta dashboards e informes.

 

La aplicación debe impedir que usuarios sin permiso lancen campañas masivas o modifiquen consentimientos.

 

18. UX/UI

 

Diseñar una interfaz moderna, clara y profesional.

 

Requisitos visuales:

 

- Menú lateral.

- Dashboard inicial.

- Diseño limpio tipo SaaS B2B.

- Tarjetas con KPIs.

- Tablas filtrables.

- Buscador global.

- Filtros avanzados.

- Etiquetas de estado.

- Colores para estados: aprobado, pendiente, bloqueado, riesgo, enviado, respondido.

- Paneles de detalle.

- Modales de revisión.

- Vistas kanban para campañas y mensajes.

- Bandeja de entrada tipo email.

- Bandeja de salida tipo workflow.

- Vista conversacional por cliente.

- Responsive para escritorio y tablet.

 

19. Flujos principales

 

Implementar al menos los siguientes flujos:

 

Flujo 1: Crear campaña

- Crear producto.

- Crear campaña.

- Seleccionar segmento.

- Validar consentimiento.

- Generar mensajes.

- Revisar mensajes.

- Aprobar.

- Programar o enviar.

 

Flujo 2: Captar nuevos leads

- Definir tipo de negocio.

- Generar búsqueda de potenciales clientes.

- Validar leads.

- Revisar fuentes.

- Comprobar consentimiento.

- Marcar aptos o no aptos.

- Incorporar a campaña solo si procede.

 

Flujo 3: Personalizar mensajes

- Seleccionar campaña.

- Seleccionar clientes.

- Generar mensajes personalizados.

- Revisar uno a uno.

- Aprobar o editar.

- Enviar individual o masivo.

 

Flujo 4: Gestionar respuestas

- Recibir respuesta.

- Clasificar intención.

- Generar borrador.

- Revisar.

- Enviar.

- Crear oportunidad o registrar baja.

 

Flujo 5: Campaña evolutiva

- Definir secuencia.

- Programar pasos.

- Evaluar respuesta o no respuesta.

- Adaptar siguiente mensaje.

- Mantener trazabilidad.

 

20. Analítica e informes

 

Crear informes de:

 

- Rendimiento por campaña.

- Rendimiento por producto.

- Rendimiento por canal.

- Rendimiento por segmento.

- Clientes impactados.

- Leads generados.

- Respuestas recibidas.

- Oportunidades creadas.

- Conversiones.

- Bajas.

- Riesgos legales.

- Consentimientos obtenidos.

- Mensajes bloqueados por cumplimiento.

- Comparativa email vs WhatsApp.

 

21. Reglas de IA responsable

 

La aplicación debe incluir controles para:

 

- No inventar datos.

- No generar mensajes engañosos.

- No usar presión indebida.

- No ocultar identidad del remitente.

- No enviar mensajes a quien se haya dado de baja.

- No usar datos sensibles para segmentación.

- No usar atributos protegidos.

- No inferir información personal sensible.

- Mantener revisión humana en envíos masivos.

- Guardar logs de generación.

- Permitir explicar por qué se generó un mensaje.

- Permitir editar siempre antes del envío.

 

22. Requisitos técnicos para Lovable

 

Construye la aplicación con:

 

- Frontend moderno en React.

- Componentes reutilizables.

- Diseño responsive.

- Supabase como backend si está disponible.

- Autenticación de usuarios.

- Base de datos estructurada.

- Estados simulados si las APIs reales no están configuradas.

- Datos de ejemplo para probar todos los módulos.

- Separación clara entre lógica de UI, datos, servicios e integraciones.

- Código limpio y mantenible.

- Navegación lateral.

- Rutas para cada módulo.

- Componentes de tabla, filtros, formularios, estado, detalle y modales.

- Preparación para webhooks de entrada.

- Preparación para APIs de envío.

 

23. Pantallas que debe crear

 

Crear estas pantallas:

 

- Login.

- Dashboard.

- Clientes.

- Detalle de cliente.

- Potenciales clientes.

- Prospección de leads.

- Productos.

- Campañas.

- Detalle de campaña.

- Constructor de campaña.

- Secuencias de campaña.

- Generador de mensajes.

- Revisión de mensajes.

- Envíos.

- Bandeja de entrada.

- Bandeja de salida.

- Conversación con cliente.

- Consentimientos.

- Auditoría legal.

- Analítica.

- Configuración.

- Integraciones.

- Usuarios y roles.

 

24. Datos de ejemplo

 

Incluye datos ficticios para poder probar la aplicación:

 

- 10 clientes existentes.

- 20 potenciales clientes.

- 5 productos.

- 4 campañas.

- 3 campañas con secuencias.

- Mensajes generados por email.

- Mensajes generados por WhatsApp.

- Mensajes pendientes de revisión.

- Respuestas recibidas.

- Borradores en bandeja de salida.

- Consentimientos válidos.

- Contactos sin consentimiento.

- Contactos dados de baja.

- Alertas legales.

 

Los datos deben ser claramente ficticios y no deben corresponder a personas reales.

 

25. Resultado esperado

 

Genera una primera versión funcional y navegable de la aplicación MarketingHub AI.

 

Debe ser posible:

 

- Ver el dashboard.

- Gestionar clientes.

- Gestionar leads.

- Crear productos.

- Crear campañas.

- Generar mensajes.

- Revisar mensajes por cliente.

- Simular envíos.

- Programar campañas.

- Ver bandeja de entrada.

- Generar respuestas.

- Guardar respuestas en borrador.

- Aprobar y enviar respuestas.

- Consultar consentimiento.

- Bloquear envíos no permitidos.

- Ver analítica.

- Gestionar roles.

 

Prioriza una experiencia completa y coherente, aunque algunas integraciones reales queden simuladas.

Recomendaciones importantes antes de usarlo en Lovable

No pedir a Lovable “recuperar datos de contacto” sin límites

Mejor formula la funcionalidad como “identificar potenciales clientes y registrar datos de contacto solo si proceden de fuentes lícitas, son corporativos, están justificados y pasan validación de consentimiento”. La AEPD indica que las comunicaciones publicitarias o promocionales por email u otro medio electrónico equivalente requieren solicitud o autorización expresa previa, salvo la excepción de relación contractual previa en productos similares. [aepd.es]

WhatsApp debe tratarse como canal especialmente sensible

La documentación interna en  250410_BSSOS_247_WhatsApp.pptx recoge que para respetar GDPR el destinatario debe dar consentimiento explícito, recibir información sobre el tipo de mensajes, poder revocar el consentimiento y no ser agregado sin permiso. La documentación de Meta Developers sobre WhatsApp Business Platform indica que la plataforma permite mensajería programática, plantillas, analítica y gestión de activos de WhatsApp Business. [250410_BSS...7_WhatsApp | PowerPoint] [developers...cebook.com]

Incluir “compliance by design” en el prompt evita que Lovable construya una herramienta de spam

En el prompt he añadido bloqueos automáticos, evidencias de consentimiento, auditoría, listas de exclusión, revisión humana y reglas de opt-out porque son elementos necesarios para que el producto sea defendible desde el punto de vista legal y operativo. El archivo interno  DOC20260319155501LIC9687 PCP.pdf recoge obligaciones de privacidad desde el diseño y por defecto, medidas de seguridad, confidencialidad, registro de actividades y evidencias de cumplimiento del RGPD. [DOC2026031...IC9687 PCP | PDF]

Versión corta para pegar si Lovable se bloquea con prompts largos

Si Lovable se queda pensando, usa primero esta versión resumida:

Construye una aplicación SaaS B2B llamada MarketingHub AI para gestionar campañas comerciales por email y WhatsApp con IA generativa, CRM, prospección de leads, generación de mensajes, revisión humana, envíos individuales y masivos, campañas secuenciales, bandeja de entrada, bandeja de salida, respuestas inteligentes, analítica y cumplimiento RGPD/LSSI.

 

La aplicación debe incluir módulos de dashboard, clientes, potenciales clientes, productos, campañas, generación de mensajes, revisión por cliente, envíos, secuencias, bandeja de entrada, bandeja de salida, consentimiento, auditoría legal, analítica, configuración, integraciones y roles.

 

Debe permitir crear campañas para clientes existentes y potenciales clientes, generar mensajes genéricos o personalizados por email y WhatsApp, revisar cada mensaje antes del envío, aprobar mensajes, enviarlos individualmente o de forma masiva, programar secuencias de seguimiento y adaptar respuestas según las contestaciones del cliente.

 

Debe incorporar cumplimiento legal desde el diseño: no enviar comunicaciones comerciales sin consentimiento o base jurídica válida, registrar origen del dato, consentimiento por canal, opt-in, opt-out, bajas, oposición, evidencia de consentimiento, auditoría de envíos y bloqueo automático de contactos no aptos.

 

No debe permitir spam, scraping indiscriminado ni uso de datos sin trazabilidad. Los datos de ejemplo deben ser ficticios.

 

Usa React, diseño responsive, menú lateral, dashboard con KPIs, tablas filtrables, fichas de detalle, modales de revisión, estados visuales, Supabase si está disponible, datos mock si no hay APIs reales, y arquitectura preparada para integrar WhatsApp Business Platform, email provider, CRM, webhooks e IA.

Mi recomendación práctica: empieza en Lovable con la versión corta, genera la estructura base y después ve pegando módulos del prompt largo por bloques: primero CRM y campañas, luego mensajes, después bandejas y por último cumplimiento e integraciones.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5a53cb2d-e07e-4a44-ad3a-f398bafaca40).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
