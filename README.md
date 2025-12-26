## 🧠 Visión general del sistema

Este sistema implementa un **modelo de autorización desacoplado**, flexible y escalable, basado en:

* **Abilities** → qué acciones existen en el sistema
* **Permissions** → quién puede hacer qué
* **Roles** → agrupadores de permisos
* **Users** → sujetos finales que ejecutan acciones

La clave del diseño es esta idea:

> **Las acciones existen independientemente de los usuarios o roles.
> Los permisos solo enlazan sujetos con acciones.**

Esto evita hardcodear lógica en código, permite overrides finos y escala sin romper nada.

---

## 🧩 Tabla: `abilities`

### ¿Qué es?

Define **qué se puede hacer en el sistema**.
No dice *quién* puede hacerlo, solo *qué acciones existen*.

Ejemplos reales:

* `attendance.view`
* `attendance.create`
* `attendance.update`
* `post.publish`
* `calendar.manage`

### Campos clave

**`id` (UUID)**
Identificador único. Se usa UUID para evitar colisiones y permitir generación distribuida.

**`name`**
Nombre técnico de la habilidad.
Formato recomendado:

```
entidad.accion
```

Ejemplo:

```
attendance.view
```

Este campo es el que usa el middleware y el `PermissionService`.

**`title`**
Nombre humano para UI:

```
"Ver asistencias"
```

Nunca se usa en lógica, solo para interfaces.

**`entity_type`**
Representa **a qué modelo lógico pertenece la habilidad**.
Ejemplo:

```
Attendance
```

Esto permite:

* validar permisos por tipo de entidad
* mantener coherencia entre código y DB

**`only_owned`**
Booleano crítico.

* `0` → permiso global
* `1` → solo si el recurso pertenece al usuario

Ejemplo:

> editar **tu propia** asistencia, pero no la de otros.

Este campo **no valida nada solo**, lo interpreta el `PermissionService`.

**`options`**
Campo flexible (JSON / longtext).
Sirve para:

* flags especiales
* configuraciones futuras
* no romper el esquema si el negocio cambia

**`scope`**
Permite multitenancy, sedes, empresas, etc.
Puede ser `NULL` si no se usa.

---

### Por qué esta tabla escala bien

* Puedes agregar nuevas acciones **sin tocar código**
* No depende de usuarios ni roles
* Es estable en el tiempo

---

## 🧩 Tabla: `permissions`

### ¿Qué es?

Es **el corazón del sistema**.

Define:

> *Quién puede hacer qué, bajo qué condiciones.*

Cada fila es una **regla explícita de autorización**.

---

### Campos clave

**`ability_id`**
Referencia a la acción (`abilities.id`).

Esto separa:

* definición de la acción
* asignación de permisos

**`subject_id`**
ID del sujeto que recibe el permiso.
⚠️ **Puede ser un user o un role**.

Este diseño evita tener:

* `user_permissions`
* `role_permissions`

Todo vive en una sola tabla.

**`subject_type`**
Define qué tipo de sujeto es:

```
'user' | 'role'
```

Gracias a esto:

* el mismo permiso puede aplicarse a usuarios o roles
* el sistema es polimórfico sin herencias raras

**`entity_id`**
Permite permisos **sobre un recurso específico**.

Ejemplo:

> Usuario puede editar **solo esta** asistencia.

Si es `NULL`, el permiso es global para esa entidad.

**`entity_type`**
Refuerza a qué tipo de entidad aplica el permiso.

Ejemplo:

```
Attendance
```

Sirve para:

* coherencia
* filtros
* validaciones futuras

**`forbidden`**
Campo clave para reglas de DENY.

* `0` → permite
* `1` → deniega explícitamente

Regla del sistema:

> **DENY siempre gana, incluso sobre permisos heredados**

Esto permite:

* bloquear a un usuario aunque su rol tenga permiso
* overrides quirúrgicos

**`scope`**
Mismo concepto que en `abilities`.
Permite limitar permisos por empresa, sede, tenant, etc.

---

### Por qué esta tabla es poderosa

* Permite permisos:

  * por usuario
  * por rol
  * por entidad específica
* Permite overrides sin hacks
* Permite reglas negativas (deny)

Este diseño es típico de **sistemas enterprise**, no CRUD simples.

---

## 🧩 Tabla: `roles`

### ¿Qué es?

Un **agrupador lógico de permisos**.

Un rol **no tiene lógica**, solo:

* nombre
* jerarquía opcional
* conjunto de permisos asociados vía `permissions`

---

### Campos clave

**`name`**
Identificador técnico del rol.
Ejemplo:

```
admin
teacher
assistant
```

**`title`**
Nombre visible en UI:

```
Administrador
Profesor
Auxiliar
```

**`level`**
Jerarquía opcional.
Ejemplo:

* 100 → super admin
* 50 → admin
* 10 → usuario

No es obligatorio usarlo, pero permite:

* comparaciones
* herencias futuras
* ordenamiento

**`scope`**
Otra vez: multitenancy.

---

### Nota importante

Un rol **no otorga permisos directamente**.
Los permisos se otorgan vía la tabla `permissions` usando:

```
subject_type = 'role'
subject_id = roles.id
```

Esto mantiene todo consistente.

---

## 🧩 Tabla: `role_user`

### ¿Qué es?

Tabla pivote **simple y directa**.

Relaciona:

* usuarios
* roles

Nada más.

---

### Por qué es minimalista

* No tiene ID propio
* No tiene timestamps
* No tiene lógica

Eso es correcto.
Su única responsabilidad es decir:

> “este usuario tiene este rol”

Todo lo demás se resuelve aguas arriba.

---

## 🧩 Tabla: `users`

### ¿Qué es?

El sujeto final del sistema.

Un usuario:

* puede tener roles
* puede tener permisos directos
* puede tener overrides

---

### Campos relevantes para autorización

**`id` (UUID)**
Clave primaria, usada en:

* role_user
* permissions

**`is_verified` / `is_first_login`**
Campos de estado, no afectan permisos directamente, pero pueden usarse en middleware.

**`deleted_at`**
Soft delete.
Importante porque:

* un usuario borrado no debe autorizar nada
* mantiene integridad histórica

---

### Relación clave

Un usuario puede tener permisos directos usando:

```
permissions.subject_type = 'user'
permissions.subject_id = users.id
```

Esto permite:

* excepciones
* permisos temporales
* accesos especiales sin roles

---

## 🔄 Cómo funciona todo junto (flujo real)

1. Llega una request a una ruta con nombre:

   ```
   attendance.data
   ```

2. El middleware traduce eso a:

   ```
   ability = attendance.view
   entity_type = Attendance
   ```

3. `PermissionService`:

   * busca la ability
   * busca permisos:

     * directos del usuario
     * heredados de sus roles
   * aplica reglas:

     * DENY gana
     * `only_owned` si aplica

4. Si hay permiso válido → pasa
   Si no → 403

Todo esto **sin ifs hardcodeados**, sin switch gigantes, sin lógica en controladores.

---

## 🚀 Por qué este diseño escala

* Agregar nuevas entidades no rompe nada
* Nuevas acciones → solo inserts
* Nuevos roles → solo data
* Overrides → una fila más en `permissions`

El código **no cambia**, solo los datos.
