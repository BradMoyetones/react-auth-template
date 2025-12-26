'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Plus, Trash2, Ban } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockAbilities, mockRoles } from '@/lib/mock-data';
import type { UserWithPermissions } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserPermissionsDialogProps {
    user: UserWithPermissions;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserPermissionsDialog({ user, open, onOpenChange }: UserPermissionsDialogProps) {
    const [selectedAbility, setSelectedAbility] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    const handleAssignPermission = () => {
        console.log('Assign permission:', { userId: user.id, abilityId: selectedAbility });
        setSelectedAbility('');
    };

    const handleAssignRole = () => {
        console.log('Assign role:', { userId: user.id, roleId: selectedRole });
        setSelectedRole('');
    };

    const handleRevokePermission = (permissionId: string) => {
        console.log('Revoke permission:', { permissionId });
    };

    const handleRemoveRole = (roleId: string) => {
        console.log('Remove role:', { userId: user.id, roleId });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
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

                    <TabsContent value="permissions" className="space-y-4 mt-4">
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                            <h4 className="text-sm font-medium mb-3">Asignar nuevo permiso</h4>
                            <div className="flex gap-2">
                                <Select value={selectedAbility} onValueChange={setSelectedAbility}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Selecciona una habilidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockAbilities.map((ability) => (
                                            <SelectItem key={ability.id} value={ability.id}>
                                                <div className="flex items-center gap-2">
                                                    <span>{ability.title || ability.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        ({ability.entity_type})
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAssignPermission} disabled={!selectedAbility} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Asignar
                                </Button>
                            </div>
                        </div>

                        <ScrollArea className="h-75 rounded-lg border border-border">
                            <div className="p-4 space-y-2">
                                <AnimatePresence>
                                    {user.permissions.length > 0 ? (
                                        user.permissions.map((permission) => (
                                            <motion.div
                                                key={permission.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-muted p-2 shrink-0">
                                                        <Key className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {permission.ability?.title || permission.ability?.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {permission.ability?.entity_type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {permission.forbidden && (
                                                        <Badge variant="destructive" className="gap-1">
                                                            <Ban className="h-3 w-3" />
                                                            Denegado
                                                        </Badge>
                                                    )}
                                                    {permission.ability?.only_owned && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Solo propios
                                                        </Badge>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => handleRevokePermission(permission.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Key className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                            <p className="text-sm text-muted-foreground">
                                                No hay permisos directos asignados
                                            </p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="roles" className="space-y-4 mt-4">
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                            <h4 className="text-sm font-medium mb-3">Asignar nuevo rol</h4>
                            <div className="flex gap-2">
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Selecciona un rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockRoles.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                                <div className="flex items-center gap-2">
                                                    <span>{role.title || role.name}</span>
                                                    {role.level && (
                                                        <span className="text-xs text-muted-foreground">
                                                            (Nivel {role.level})
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAssignRole} disabled={!selectedRole} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Asignar
                                </Button>
                            </div>
                        </div>

                        <ScrollArea className="h-75 rounded-lg border border-border">
                            <div className="p-4 space-y-2">
                                <AnimatePresence>
                                    {user.roles.length > 0 ? (
                                        user.roles.map((role) => (
                                            <motion.div
                                                key={role.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-muted p-2 shrink-0">
                                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{role.title || role.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Nivel {role.level || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() => handleRemoveRole(role.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Shield className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                            <p className="text-sm text-muted-foreground">No hay roles asignados</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
