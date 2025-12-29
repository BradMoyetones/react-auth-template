'use client';

import { useState } from 'react';
import { Search, Plus, Users, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getRolesWithPermissions } from '@/lib/mock-data';
import { CreateRoleDialog } from './create-role-dialog';
import { RolePermissionsDialog } from './role-permissions-dialog';
import type { RoleWithPermissions } from '@/types';

export function RolesTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(null);
    const [editRole, setEditRole] = useState<RoleWithPermissions | null>(null);
    const roles = getRolesWithPermissions();

    const filteredRoles = roles.filter(
        (role) =>
            role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getLevelColor = (level: number | null) => {
        if (!level) return 'bg-muted';
        if (level >= 80) return 'bg-destructive/10 text-destructive';
        if (level >= 50) return 'bg-warning/10 text-warning';
        return 'bg-success/10 text-success';
    };

    const handleDeleteRole = (role: RoleWithPermissions) => {
        console.log('Eliminar rol:', {
            role_id: role.id,
            action: 'delete',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar roles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Crear Rol
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRoles.map((role, index) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <Card className="p-6 transition-all hover:border-primary/50">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg text-foreground">
                                            {role.title || role.name}
                                        </h3>
                                        {role.level && (
                                            <Badge variant="outline" className={getLevelColor(role.level)}>
                                                Nivel {role.level}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground font-mono">{role.name}</p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setEditRole(role)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar rol
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => handleDeleteRole(role)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Eliminar rol
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Usuarios con este rol</span>
                                    <Badge variant="secondary" className="gap-1">
                                        <Users className="h-3 w-3" />
                                        {role.userCount || 0}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Permisos asignados</span>
                                    <Badge variant="outline">{role.permissions.length}</Badge>
                                </div>

                                <div className="pt-2">
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions.slice(0, 3).map((perm) => (
                                            <Badge key={perm.id} variant="secondary" className="text-xs">
                                                {perm.ability?.title || perm.ability?.name}
                                            </Badge>
                                        ))}
                                        {role.permissions.length > 3 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{role.permissions.length - 3} más
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full mt-4 bg-transparent"
                                onClick={() => setSelectedRole(role)}
                            >
                                Gestionar permisos
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <CreateRoleDialog
                open={createDialogOpen || !!editRole}
                onOpenChange={(open) => {
                    setCreateDialogOpen(open);
                    if (!open) setEditRole(null);
                }}
                editRole={editRole || undefined}
            />

            {selectedRole && (
                <RolePermissionsDialog
                    role={selectedRole}
                    open={!!selectedRole}
                    onOpenChange={(open) => !open && setSelectedRole(null)}
                />
            )}
        </div>
    );
}
