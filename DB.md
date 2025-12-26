# 📚 Esquema de la Base de Datos para el Sistema de Autorización

> Este documento describe las tablas y campos clave utilizados en el sistema de autorización basado en habilidades y permisos.

## 📄 `abilities.sql`

```sql
CREATE TABLE `abilities` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `entity_type` VARCHAR(255) DEFAULT NULL,
  `only_owned` TINYINT(1) NOT NULL DEFAULT 0,
  `options` LONGTEXT DEFAULT NULL,
  `scope` CHAR(36) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ability_name_entity` (`name`, `entity_type`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;
```

---

## 📄 `roles.sql`

```sql
CREATE TABLE `roles` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `level` INT UNSIGNED DEFAULT NULL,
  `scope` CHAR(36) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_name` (`name`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;
```

---

## 📄 `users.sql` (versión simplificada para documentación)

```sql
CREATE TABLE `users` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `lastname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;
```

---

## 📄 `role_user.sql`

```sql
CREATE TABLE `role_user` (
  `user_id` CHAR(36) NOT NULL,
  `role_id` CHAR(36) NOT NULL,

  PRIMARY KEY (`user_id`, `role_id`),
  KEY `idx_role_user_role` (`role_id`),

  CONSTRAINT `fk_role_user_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT `fk_role_user_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `roles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;
```

---

## 📄 `permissions.sql`

```sql
CREATE TABLE `permissions` (
  `id` CHAR(36) NOT NULL,
  `ability_id` CHAR(36) NOT NULL,
  `subject_id` CHAR(36) NOT NULL,
  `subject_type` ENUM('user','role') NOT NULL,
  `entity_id` CHAR(36) DEFAULT NULL,
  `entity_type` VARCHAR(255) DEFAULT NULL,
  `forbidden` TINYINT(1) NOT NULL DEFAULT 0,
  `scope` CHAR(36) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),

  KEY `idx_permissions_ability` (`ability_id`),
  KEY `idx_permissions_subject` (`subject_id`, `subject_type`),
  KEY `idx_permissions_entity` (`entity_id`, `entity_type`),
  KEY `idx_permissions_scope` (`scope`),

  CONSTRAINT `fk_permissions_ability`
    FOREIGN KEY (`ability_id`)
    REFERENCES `abilities` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;
```

---

## 🧠 Notas finales para la documentación

* **`permissions.subject_id` NO tiene FK intencionalmente**
  → porque puede apuntar a `users` o `roles`.

* **Toda la inteligencia vive en los datos**, no en el esquema.

* El sistema es:

  * polimórfico
  * extensible
  * seguro
  * enterprise-grade

Esto ya es un **módulo de autorización reusable**, no algo pegado a un proyecto.