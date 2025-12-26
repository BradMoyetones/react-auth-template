'use client';

import { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockRoles } from '@/lib/mock-data';
import type { UserWithPermissions } from '@/types';

interface AssignRoleDialogProps {
    user: UserWithPermissions;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AssignRoleDialog({ user, open, onOpenChange }: AssignRoleDialogProps) {
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(user.roles.map((r) => r.id));

    const toggleRole = (roleId: string) => {
        setSelectedRoleIds((prev) => (prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]));
    };

    const handleSave = () => {
        console.log('Asignar roles a usuario:', {
            user_id: user.id,
            role_ids: selectedRoleIds,
            action: 'assign_roles',
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Asignar roles</DialogTitle>
                    <DialogDescription>
                        Selecciona los roles para {user.name} {user.lastname}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-100 pr-4">
                    <div className="space-y-2">
                        {mockRoles.map((role) => {
                            const isSelected = selectedRoleIds.includes(role.id);
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => toggleRole(role.id)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                        isSelected
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50 bg-background'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`rounded-lg p-2 ${
                                                    isSelected ? 'bg-primary/10' : 'bg-muted'
                                                }`}
                                            >
                                                <Shield
                                                    className={`h-4 w-4 ${
                                                        isSelected ? 'text-primary' : 'text-muted-foreground'
                                                    }`}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">{role.title || role.name}</h4>
                                                <p className="text-xs text-muted-foreground font-mono">{role.name}</p>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="rounded-full bg-primary p-1">
                                                <Check className="h-3 w-3 text-primary-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    {role.level && (
                                        <Badge variant="outline" className="mt-2">
                                            Nivel {role.level}
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>

                <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>Guardar cambios</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
