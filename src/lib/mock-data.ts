import type { Ability, Role, User, Permission, UserWithPermissions, RoleWithPermissions } from '@/types';

// Mock Abilities
export const mockAbilities: Ability[] = [
    {
        id: 'e23ea500-e273-11f0-9f63-685b3591dcbc',
        name: 'attendance.view',
        title: 'Ver asistencias',
        entity_type: 'Attendance',
        only_owned: false,
        options: null,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
    {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'attendance.create',
        title: 'Crear asistencias',
        entity_type: 'Attendance',
        only_owned: false,
        options: null,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
    {
        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        name: 'attendance.update',
        title: 'Actualizar asistencias',
        entity_type: 'Attendance',
        only_owned: true,
        options: null,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
    {
        id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        name: 'attendance.delete',
        title: 'Eliminar asistencias',
        entity_type: 'Attendance',
        only_owned: false,
        options: null,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
    {
        id: 'd4e5f6a7-b8c9-0123-def1-234567890123',
        name: 'user.view',
        title: 'Ver usuarios',
        entity_type: 'User',
        only_owned: false,
        options: null,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
    {
        id: 'e5f6a7b8-c9d0-1234-ef12-345678901234',
        name: 'user.create',
        title: 'Crear usuarios',
        entity_type: 'User',
        only_owned: false,
        options: null,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
    {
        id: 'f6a7b8c9-d0e1-2345-f123-456789012345',
        name: 'user.update',
        title: 'Actualizar usuarios',
        entity_type: 'User',
        only_owned: true,
        options: null,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
    {
        id: 'a7b8c9d0-e1f2-3456-1234-567890123456',
        name: 'report.view',
        title: 'Ver reportes',
        entity_type: 'Report',
        only_owned: false,
        options: null,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
    {
        id: 'b8c9d0e1-f2a3-4567-2345-678901234567',
        name: 'report.export',
        title: 'Exportar reportes',
        entity_type: 'Report',
        only_owned: false,
        options: null,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
];

// Mock Roles
export const mockRoles: Role[] = [
    {
        id: 'role-admin-001',
        name: 'admin',
        title: 'Administrador',
        level: 100,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
    {
        id: 'role-manager-002',
        name: 'manager',
        title: 'Gerente',
        level: 50,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
    {
        id: 'role-employee-003',
        name: 'employee',
        title: 'Empleado',
        level: 10,
        scope: null,
        created_at: '2025-12-26T15:59:39.000Z',
        updated_at: '2025-12-26T16:19:41.000Z',
    },
];

// Mock Users
export const mockUsers: User[] = [
    {
        id: '019b51e2-5293-73c9-8322-d3cc1f77ac7f',
        name: 'Brad',
        lastname: 'Moyetones',
        document: 1034310911,
        email: 'example@example.com',
        image: 'http://localhost/uploads/uploadthing/upload_694c4296cdc1a.jpg',
        is_verified: true,
        is_first_login: false,
        worth_id: null,
        deleted_at: null,
        created_at: '2025-12-24T19:42:25.000Z',
        updated_at: '2025-12-24T20:01:24.000Z',
    }
];

// Mock Permissions
export const mockPermissions: Permission[] = [
    {
        id: '59340aa6-e274-11f0-9f63-685b3591dcbc',
        ability_id: 'e23ea500-e273-11f0-9f63-685b3591dcbc',
        subject_id: '019b51e2-5293-73c9-8322-d3cc1f77ac7f',
        subject_type: 'user',
        entity_id: null,
        entity_type: 'Attendance',
        forbidden: false,
        scope: null,
        created_at: '2025-12-26T16:02:58.000Z',
        updated_at: '2025-12-26T16:02:58.000Z',
    }
];

// Get users with their roles and permissions
export function getUsersWithPermissions(): UserWithPermissions[] {
    return mockUsers.map((user) => ({
        ...user,
        roles: mockRoles.filter((role) => {
            // Mock role assignment: admin role to Brad
            if (user.id === '019b51e2-5293-73c9-8322-d3cc1f77ac7f' && role.id === 'role-admin-001') return true;
            return false;
        }),
        permissions: mockPermissions
            .filter((p) => p.subject_type === 'user' && p.subject_id === user.id)
            .map((p) => ({
                ...p,
                ability: mockAbilities.find((a) => a.id === p.ability_id),
            })),
    }));
}

// Get roles with their permissions
export function getRolesWithPermissions(): RoleWithPermissions[] {
    return mockRoles.map((role) => ({
        ...role,
        permissions: mockPermissions
            .filter((p) => p.subject_type === 'role' && p.subject_id === role.id)
            .map((p) => ({
                ...p,
                ability: mockAbilities.find((a) => a.id === p.ability_id),
            })),
        userCount: getUsersWithPermissions().filter((u) => u.roles.some((r) => r.id === role.id)).length,
    }));
}
