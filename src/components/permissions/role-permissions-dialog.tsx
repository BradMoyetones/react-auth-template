'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { RoleWithPermissions } from '@/types';
import { PermissionsGrid } from '@/components/permissions/permissions-grid';

interface RolePermissionsDialogProps {
    role: RoleWithPermissions;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RolePermissionsDialog({ role, open, onOpenChange }: RolePermissionsDialogProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<
        {
            abilityId: string;
            entityType: string | null;
            entityId: string | null;
            forbidden: boolean;
        }[]
    >(
        role.permissions.map((p) => ({
            abilityId: p.ability_id,
            entityType: p.ability?.entity_type || null,
            entityId: p.entity_id,
            forbidden: p.forbidden,
        }))
    );

    const togglePermission = (abilityId: string, entityType: string | null = null) => {
        setSelectedPermissions((prev) => {
            const exists = prev.find((p) => p.abilityId === abilityId && p.entityType === entityType);
            const newPermissions = exists
                ? prev.filter((p) => !(p.abilityId === abilityId && p.entityType === entityType))
                : [...prev, { abilityId, entityType, entityId: null, forbidden: false }];

            console.log('Update role permissions:', { roleId: role.id, permissions: newPermissions });
            return newPermissions;
        });
    };

    const toggleDeny = (abilityId: string, entityType: string | null = null) => {
        setSelectedPermissions((prev) => {
            const newPermissions = prev.map((p) =>
                p.abilityId === abilityId && p.entityType === entityType ? { ...p, forbidden: !p.forbidden } : p
            );
            console.log('Toggle permission deny for role:', { roleId: role.id, permissions: newPermissions });
            return newPermissions;
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl! max-h-[90vh]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-accent/10 p-3">
                            <Shield className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">{role.title || role.name}</DialogTitle>
                            <p className="text-sm text-muted-foreground">Gestiona los permisos de este rol</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-4">
                    <PermissionsGrid
                        selectedPermissions={selectedPermissions}
                        onPermissionToggle={togglePermission}
                        onDenyToggle={toggleDeny}
                    />
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                    <Button
                        onClick={() => {
                            console.log('Guardar permisos del rol:', {
                                roleId: role.id,
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
