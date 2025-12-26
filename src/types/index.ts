// Database types based on MySQL schema

export type SubjectType = 'user' | 'role';

export interface Ability {
    id: string;
    name: string;
    title: string | null;
    entity_type: string | null;
    only_owned: boolean;
    options: string | null;
    scope: string | null;
    created_at: string;
    updated_at: string;
}

export interface Permission {
    id: string;
    ability_id: string;
    subject_id: string;
    subject_type: SubjectType;
    entity_id: string | null;
    entity_type: string | null;
    forbidden: boolean;
    scope: string | null;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: string;
    name: string;
    title: string | null;
    level: number | null;
    scope: string | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    name: string;
    lastname: string;
    document: number;
    email: string;
    image: string | null;
    is_verified: boolean;
    is_first_login: boolean;
    worth_id: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface RoleUser {
    user_id: string;
    role_id: string;
}

// Extended types for UI
export interface PermissionWithDetails extends Permission {
    ability?: Ability;
    user?: User;
    role?: Role;
}

export interface UserWithPermissions extends User {
    roles: Role[];
    permissions: PermissionWithDetails[];
}

export interface RoleWithPermissions extends Role {
    permissions: PermissionWithDetails[];
    userCount?: number;
}
