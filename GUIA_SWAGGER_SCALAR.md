# Guía: Swagger + Scalar en NestJS

Esta guía documenta la API del proyecto con **Swagger UI** y **Scalar**.

- Prefijo global `api` y `ValidationPipe` con `whitelist` y `forbidNonWhitelisted`.
- Scalar no genera la documentación por sí solo: muestra el documento OpenAPI que genera `@nestjs/swagger`. Por eso se instalan los dos.

---

## Paso 1: Instalar dependencias

```bash
npm install @nestjs/swagger @scalar/nestjs-api-reference
```

No hace falta `swagger-ui-express`: con `@nestjs/platform-express`, `@nestjs/swagger` ya trae su UI.

---

## Paso 2: Configurar `src/main.ts`

```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ---- Documentación ----
  const config = new DocumentBuilder()
    .setTitle('Aux II Backend')
    .setDescription('API de habitaciones, reservas, productos y pedidos')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI -> http://localhost:3000/docs
  SwaggerModule.setup('docs', app, document);

  // Scalar -> http://localhost:3000/reference
  app.use(
    '/reference',
    apiReference({
      content: document,
      theme: 'purple', // opcional
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
```

Notas:
- `/docs` y `/reference` quedan **fuera** del prefijo `api`, porque `setGlobalPrefix` no afecta a `SwaggerModule.setup` ni a `app.use`. Los endpoints sí aparecen documentados como `/api/...`.
- Si tu versión de `@scalar/nestjs-api-reference` es antigua y `content` da error de tipos, usa `{ spec: { content: document } }`.
- Para bajo el prefijo (`/api/docs`), pasa `{ useGlobalPrefix: true }` como cuarto argumento de `SwaggerModule.setup`.

---

## Paso 3: Activar el plugin de Swagger (recomendado)

Sin el plugin habría que poner `@ApiProperty()` en cada campo de cada DTO. El plugin lo infiere a partir de los tipos y de los decoradores de `class-validator`.

En `nest-cli.json`:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "options": {
          "classValidatorShim": true,
          "introspectComments": true
        }
      }
    ]
  }
}
```

- El plugin solo actúa con `nest build` y `nest start`. No funciona con `vitest` ni con otros bundlers.
- Los archivos deben terminar en `.dto.ts` o `.entity.ts` para que el plugin los analice.

---

## Paso 4: `PartialType` en los Update DTOs

`@nestjs/mapped-types` solo copia la metadata de `class-validator` y `class-transformer`, no la de Swagger.

| Situación | Resultado |
|---|---|
| Plugin activo con `mapped-types` | Muchas veces funciona, pero no es del todo fiable. |
| Sin plugin con `mapped-types` | Los `Update...Dto` salen vacíos en la documentación. |
| `PartialType` de `@nestjs/swagger` | Funciona siempre. |

La validación y la API funcionan igual en todos los casos. Es solo un tema de documentación.

**Recomendación:** prueba primero con `mapped-types`. Si algún `Update...Dto` sale vacío en `/docs`, cambia el import:

```ts
import { PartialType } from '@nestjs/swagger';   // antes: '@nestjs/mapped-types'
import { CreateCategoriaDto } from './create-categoria.dto.js';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}
```

---

## Paso 5: Completar los DTOs

Con `whitelist: true` y `forbidNonWhitelisted: true`, un `Create...Dto` vacío **rechaza cualquier campo** enviado. Declara los campos con sus validadores. Con el plugin activo no necesitas `@ApiProperty()`.

```ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  /** Nombre de la categoría */
  @IsString()
  @IsNotEmpty()
  nombre: string;

  /** Descripción opcional */
  @IsString()
  @IsOptional()
  descripcion?: string;
}
```

Los comentarios `/** ... */` se convierten en descripciones gracias a `introspectComments`.

---

## Paso 6: Decoradores opcionales en los controllers

Agrupan y describen los endpoints:

```ts
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Categorías')
@Controller('categoria')
export class CategoriaController {
  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías' })
  findAll() { ... }
}
```

Si más adelante agregas JWT, usa `@ApiBearerAuth()` en los controllers y `.addBearerAuth()` en el `DocumentBuilder`.

---

## Paso 7: Probar

```bash
npm run start:dev
```

| Qué | URL |
|---|---|
| Swagger UI | http://localhost:3000/docs |
| Scalar | http://localhost:3000/reference |
| JSON OpenAPI | http://localhost:3000/docs-json |

Comprueba que:
1. Aparecen todos los controllers con sus rutas `/api/...`.
2. Los esquemas de los DTOs tienen campos.
3. Puedes ejecutar un endpoint desde Scalar con "Test Request".

---

## Otros problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| Los DTOs salen vacíos | El plugin no está en `nest-cli.json`, el archivo no termina en `.dto.ts`, o faltan los campos (Paso 5). Reinicia con `npm run start:dev`. |
| Los `Update...Dto` salen vacíos | Falta cambiar el import de `PartialType` (Paso 4). |
| Error de tipos en `apiReference({ content })` | Versión antigua de Scalar: usa `spec: { content: document }`. |
| `Cannot find module ... .js` | En ESM los imports relativos deben llevar `.js`. |
