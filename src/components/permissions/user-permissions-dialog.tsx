'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserWithPermissions } from '@/types';
import { PermissionsGrid } from './permissions-grid';
import { RolesGrid } from './roles-grid';
import { Key, Shield } from 'lucide-react';

interface UserPermissionsDialogProps {
    user: UserWithPermissions;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserPermissionsDialog({ user, open, onOpenChange }: UserPermissionsDialogProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<
        {
            abilityId: string;
            entityType: string | null;
            entityId: string | null;
            forbidden: boolean;
        }[]
    >(
        user.permissions.map((p) => ({
            abilityId: p.ability_id,
            entityType: p.ability?.entity_type || null,
            entityId: p.entity_id,
            forbidden: p.forbidden,
        }))
    );

    const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles.map((r) => r.id));

    const toggleRole = (roleId: string) => {
        setSelectedRoles((prev) => {
            const newRoles = prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId];
            console.log('Update user roles:', { userId: user.id, roles: newRoles });
            return newRoles;
        });
    };

    const togglePermission = (abilityId: string, entityType: string | null = null) => {
        setSelectedPermissions((prev) => {
            const exists = prev.find((p) => p.abilityId === abilityId && p.entityType === entityType);
            const newPermissions = exists
                ? prev.filter((p) => !(p.abilityId === abilityId && p.entityType === entityType))
                : [...prev, { abilityId, entityType, entityId: null, forbidden: false }];

            console.log('Update user permissions:', { userId: user.id, permissions: newPermissions });
            return newPermissions;
        });
    };

    const toggleDeny = (abilityId: string, entityType: string | null = null) => {
        setSelectedPermissions((prev) => {
            const newPermissions = prev.map((p) =>
                p.abilityId === abilityId && p.entityType === entityType ? { ...p, forbidden: !p.forbidden } : p
            );
            console.log('Toggle permission deny:', { userId: user.id, permissions: newPermissions });
            return newPermissions;
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl! max-h-[90vh]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {user.name[0]}
                                {user.lastname[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-xl">
                                {user.name} {user.lastname}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="permissions" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="permissions" className="gap-2">
                            <Key className="h-4 w-4" />
                            Permisos directos
                        </TabsTrigger>
                        <TabsTrigger value="roles" className="gap-2">
                            <Shield className="h-4 w-4" />
                            Roles
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="permissions" className="pt-4">
                        <PermissionsGrid
                            selectedPermissions={selectedPermissions}
                            onPermissionToggle={togglePermission}
                            onDenyToggle={toggleDeny}
                        />
                    </TabsContent>

                    <TabsContent value="roles" className="pt-4">
                        <RolesGrid selectedRoles={selectedRoles} onRoleToggle={toggleRole} />
                    </TabsContent>
                </Tabs>

                <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                    <Button
                        onClick={() => {
                            console.log('Guardar cambios para usuario:', {
                                userId: user.id,
                                roles: selectedRoles,
                                permissions: selectedPermissions,
                            });
                            onOpenChange(false);
                        }}
                    >
                        Guardar cambios
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
