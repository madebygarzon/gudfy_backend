# Módulo de Bus de Evento en Medusa

El módulo de bus de eventos en Medusa es esencial para activar eventos y notificaciones a los suscriptores que escuchan. Aquí, se describen dos opciones para configurar el módulo de bus de eventos: **Local** para entornos de desarrollo y **Redis Event Bus** para producción.

## Módulo de Bus de Evento Local

El módulo de bus de eventos local es adecuado para entornos de desarrollo. Aquí se proporciona información sobre cómo configurarlo:

- [Configuración del Módulo de Bus de Evento Local](https://docs.medusajs.com/modules/customers/backend/send-confirmation)

Este recurso ya esta implementado por lo que se debe de comentar si se desea llevar a producción: configuracion en **medusa-config.js**.

```javascript

const modules = {
  //codigo a comentar 
  // eventBus: {
  //   resolve: "@medusajs/event-bus-local",
  // },
};
```

## Módulo de Bus de Evento para Producción

Para entornos de producción, se recomienda utilizar el **Módulo Redis Event Bus** para garantizar una mayor escalabilidad y fiabilidad. Aquí se proporciona información sobre cómo configurar esta opción:

- [Configuración del Módulo Redis Event Bus para Producción](https://docs.medusajs.com/development/events/modules/redis)

Este recurso te proporciona instrucciones detalladas sobre cómo configurar el Módulo Redis Event Bus en tu aplicación Medusa para garantizar un funcionamiento eficiente y confiable en entornos de producción.


# Configuracion para el entorno de SendGrid (Gestor de envios de correo)

Importante mencionar que esta erramienta nos brinda un uso gratuito de 100 emails por dia, se puede considerar la opcion de 100.000 emials 

estos pasos estan resumidos por lo que se recomienda mirar su [configuracion recomendada](https://docs.medusajs.com/plugins/notifications/sendgrid#install-the-sendgrid-plugin) 

- [Se debe de crear un Usuarios en su pagina oficial](https://signup.sendgrid.com/) 

Para que la integración funcione, debe crear una clave API en su cuenta SendGrid.
Puede hacerlo eligiendo en la barra lateral de su panel de SendGrid Configuración> Claves API. Luego, haga clic en Crear clave API.

El complemento SendGrid utiliza plantillas SendGrid para enviar correos electrónicos. Si no proporciona el complemento con las plantillas necesarias, no se enviarán correos electrónicos.

Para crear una plantilla de correo electrónico, vaya a API de correo electrónico > Plantillas dinámicas. Luego, haga clic en "Crear una plantilla dinámica". Luego podrá ver la ID de la plantilla que necesitará para la configuración de su complemento.

Entonces, en tu **.en** varchivo agregue la clave API que creó anteriormente, así como el envío desde el correo electrónico:

```javascript
SENDGRID_API_KEY=<API_KEY>
SENDGRID_FROM=<SEND_FROM_EMAIL>
```

Asegúrese de reemplazar el <API_KEY> con la clave API de SendGrid y el <SEND_FROM_EMAIL> con el correo electrónico que estás utilizando en SendGrid como remitente único.

Además, debes agregar el ID de cada plantilla que crees en .env también. Por ejemplo:
```javascript
SENDGRID_ORDER_PLACED_ID=<ORDER_PLACED_TEMPLATE_ID>
```
Dónde <ORDER_PLACED_TEMPLATE_IDes> el ID de su plantilla para los correos electrónicos de pedidos realizados.

Finalmente, en tu **medusa-config.js** archivo, agregue el complemento SendGrid a la matriz de complementos:

```javascript
const plugins = [
  // ...,
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: 
        process.env.SENDGRID_ORDER_PLACED_ID,
      localization: {
        "de-DE": { // locale key
          order_placed_template:
            process.env.SENDGRID_ORDER_PLACED_ID_LOCALIZED,
        },
      },
    },
  },
]
```
Ela pi_key y from Se requieren opciones. Luego, use la clave de cada plantilla que cree (de la referencia ) como nombre de la opción con el ID de la plantilla como valor.

# Implementación y configuración del plugin *medusa-plugin-auth*

Para la implementación de la herramienta, se siguieron los pasos recomendados por la documentación oficial en https://medusa-plugins.vercel.app/authentication.

Se debe tener en cuenta que en la carpeta del back-end, medusa-config.js se implementa el plugin, con una característica modificada, la cual es { strict: "none"}, esta permite que los usuarios que previamente ya se han registrado en la plataforma de gudfy puedan iniciar sesión con sus redes sociales.

## Facebook & Gmail ## 
Utilizando el plugin medusa-plugin-auth, puedes habilitar el inicio de sesión a través de Facebook y Gmail. La documentación proporciona un detallado paso a paso para configurarlo. Además, es importante mencionar que debes agregar las variables de entorno necesarias en el archivo .env. Para obtener estas variables, te recomendamos contactar directamente con la documentacion de la API de Autenticación de terceros de Facebook y Gmail.


## Codigo Manipulado en librerias ## 

**server\node_modules\@medusajs\medusa\dist\services\product-variant.js**

**comentar la linea 237:  this.validateVariantsToCreate_(product, variants_);**
Se comento esta funcion de validacion para la creacion de la Variante de producto  por medio del id del producto, ya que esta funcion esta generando error en la forma en como se utilisa el Servicio de la tabla (Entity) ProductVariantService. este endpoint personalisado esta ubicado en server/src/api/routes/seller/update-seller-product.ts

