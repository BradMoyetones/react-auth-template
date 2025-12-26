'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Plus, Trash2, Ban, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockAbilities } from '@/lib/mock-data';
import type { RoleWithPermissions } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface RolePermissionsDialogProps {
    role: RoleWithPermissions;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RolePermissionsDialog({ role, open, onOpenChange }: RolePermissionsDialogProps) {
    const [selectedAbility, setSelectedAbility] = useState<string>('');
    const [forbiddenMode, setForbiddenMode] = useState(false);

    const handleAssignPermission = () => {
        console.log('Assign permission to role:', {
            roleId: role.id,
            abilityId: selectedAbility,
            forbidden: forbiddenMode,
        });
        setSelectedAbility('');
        setForbiddenMode(false);
    };

    const handleRevokePermission = (permissionId: string) => {
        console.log('Revoke permission from role:', { permissionId });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
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

                <div className="space-y-4 mt-4">
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                        <h4 className="text-sm font-medium mb-3">Asignar nuevo permiso al rol</h4>
                        <div className="space-y-3">
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
                                                    {ability.only_owned && (
                                                        <Badge variant="outline" className="text-xs ml-1">
                                                            Solo propios
                                                        </Badge>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleAssignPermission}
                                    disabled={!selectedAbility}
                                    className="gap-2"
                                    variant={forbiddenMode ? 'destructive' : 'default'}
                                >
                                    <Plus className="h-4 w-4" />
                                    {forbiddenMode ? 'Denegar' : 'Permitir'}
                                </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="forbidden"
                                    checked={forbiddenMode}
                                    onCheckedChange={(checked) => setForbiddenMode(checked === true)}
                                />
                                <label
                                    htmlFor="forbidden"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                                >
                                    <Ban className="h-4 w-4 text-destructive" />
                                    <span>Denegar este permiso (DENY)</span>
                                </label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Los permisos denegados siempre tienen prioridad sobre los permitidos
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium">Permisos asignados</h4>
                            <Badge variant="secondary">{role.permissions.length} permisos</Badge>
                        </div>
                        <ScrollArea className="h-100 rounded-lg border border-border">
                            <div className="p-4 space-y-2">
                                <AnimatePresence>
                                    {role.permissions.length > 0 ? (
                                        role.permissions.map((permission) => (
                                            <motion.div
                                                key={permission.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`rounded-lg p-2 ${
                                                            permission.forbidden ? 'bg-destructive/10' : 'bg-primary/10'
                                                        }`}
                                                    >
                                                        {permission.forbidden ? (
                                                            <Ban className="h-4 w-4 text-destructive" />
                                                        ) : (
                                                            <Key className="h-4 w-4 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-sm">
                                                                {permission.ability?.title || permission.ability?.name}
                                                            </p>
                                                            {permission.ability?.only_owned && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-accent/10 text-accent border-accent/20"
                                                                >
                                                                    <Lock className="h-3 w-3 mr-1" />
                                                                    Solo propios
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {permission.ability?.entity_type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {permission.forbidden ? (
                                                        <Badge variant="destructive" className="gap-1">
                                                            <Ban className="h-3 w-3" />
                                                            Denegado
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="default"
                                                            className="gap-1 bg-primary/20 text-primary border-primary/20"
                                                        >
                                                            Permitido
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
                                                No hay permisos asignados a este rol
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Comienza agregando habilidades arriba
                                            </p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
