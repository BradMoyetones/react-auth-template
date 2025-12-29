'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { mockAbilities } from '@/lib/mock-data';
import type { RoleWithPermissions } from '@/types';
import { PermissionsGrid } from '@/components/permissions/permissions-grid';

const roleSchema = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .regex(/^[a-z_]+$/, 'Solo letras minúsculas y guiones bajos'),
    title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
    level: z.number().min(0).max(100).optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface CreateRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editRole?: RoleWithPermissions;
}

export function CreateRoleDialog({ open, onOpenChange, editRole }: CreateRoleDialogProps) {
    const [selectedAbilities, setSelectedAbilities] = useState<string[]>([]);
    const [deniedAbilities, setDeniedAbilities] = useState<string[]>([]);

    const form = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: '',
            title: '',
            level: undefined,
        },
    });

    useEffect(() => {
        if (editRole) {
            form.reset({
                name: editRole.name,
                title: editRole.title || '',
                level: editRole.level || undefined,
            });
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedAbilities(editRole.permissions.map((p) => p.ability_id));
            setDeniedAbilities(editRole.permissions.filter((p) => p.forbidden).map((p) => p.ability_id));
        } else {
            form.reset({
                name: '',
                title: '',
                level: undefined,
            });
            setSelectedAbilities([]);
            setDeniedAbilities([]);
        }
    }, [editRole, form]);

    const onSubmit = (data: RoleFormData) => {
        const permissions = selectedAbilities.map((abilityId) => ({
            ability_id: abilityId,
            forbidden: deniedAbilities.includes(abilityId),
        }));

        if (editRole) {
            console.log('Actualizar rol:', {
                role_id: editRole.id,
                ...data,
                permissions,
            });
        } else {
            console.log('Crear rol:', {
                ...data,
                permissions,
            });
        }
        form.reset();
        setSelectedAbilities([]);
        setDeniedAbilities([]);
        onOpenChange(false);
    };

    const togglePermission = (abilityId: string) => {
        setSelectedAbilities((prev) =>
            prev.includes(abilityId) ? prev.filter((id) => id !== abilityId) : [...prev, abilityId]
        );
        // Si se deselecciona, quitar tambien de denied
        if (selectedAbilities.includes(abilityId)) {
            setDeniedAbilities((prev) => prev.filter((id) => id !== abilityId));
        }
    };

    const toggleDeny = (abilityId: string) => {
        setDeniedAbilities((prev) =>
            prev.includes(abilityId) ? prev.filter((id) => id !== abilityId) : [...prev, abilityId]
        );
    };

    const selectedPermissions = selectedAbilities.map((abilityId) => {
        const ability = mockAbilities.find((a) => a.id === abilityId);
        return {
            abilityId,
            entityType: ability?.entity_type || null,
            entityId: null,
            forbidden: deniedAbilities.includes(abilityId),
        };
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl! w-full max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{editRole ? 'Editar rol' : 'Crear nuevo rol'}</DialogTitle>
                    <DialogDescription>
                        {editRole
                            ? 'Modifica los datos y permisos del rol.'
                            : 'Define un nuevo rol y asigna sus permisos.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="info">Información básica</TabsTrigger>
                                <TabsTrigger value="permissions">Permisos</TabsTrigger>
                            </TabsList>

                            <TabsContent value="info" className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre técnico</FormLabel>
                                            <FormControl>
                                                <Input placeholder="admin, manager, employee" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Identificador único en minúsculas (ej: admin, manager)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Título visible</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Administrador, Gerente, Empleado" {...field} />
                                            </FormControl>
                                            <FormDescription>Nombre que se mostrará en la interfaz</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nivel de jerarquía (opcional)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0-100" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Nivel jerárquico del rol (0-100, siendo 100 el más alto)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="permissions" className="mt-4 pt-4">
                                <PermissionsGrid
                                    selectedPermissions={selectedPermissions}
                                    onPermissionToggle={togglePermission}
                                    onDenyToggle={toggleDeny}
                                />
                            </TabsContent>
                        </Tabs>

                        <div className="flex gap-2 justify-end pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset();
                                    setSelectedAbilities([]);
                                    setDeniedAbilities([]);
                                    onOpenChange(false);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit">{editRole ? 'Guardar cambios' : 'Crear rol'}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
