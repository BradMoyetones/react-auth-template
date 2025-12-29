'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { PermissionsGrid } from './permissions-grid';
import { RolesGrid } from './roles-grid';

const userSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastname: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Debe ser un email válido'),
    document: z.number().min(1, 'El documento es requerido'),
});

type UserFormData = z.infer<typeof userSchema>;

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<
        {
            abilityId: string;
            entityType: string | null;
            entityId: string | null;
            forbidden: boolean;
        }[]
    >([]);

    const form = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            lastname: '',
            email: '',
            document: undefined,
        },
    });

    const toggleRole = (roleId: string) => {
        setSelectedRoles((prev) => (prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]));
    };

    const togglePermission = (abilityId: string, entityType: string | null = null) => {
        setSelectedPermissions((prev) => {
            const exists = prev.find((p) => p.abilityId === abilityId && p.entityType === entityType);
            if (exists) {
                return prev.filter((p) => !(p.abilityId === abilityId && p.entityType === entityType));
            }
            return [...prev, { abilityId, entityType, entityId: null, forbidden: false }];
        });
    };

    const toggleDeny = (abilityId: string, entityType: string | null = null) => {
        setSelectedPermissions((prev) =>
            prev.map((p) =>
                p.abilityId === abilityId && p.entityType === entityType ? { ...p, forbidden: !p.forbidden } : p
            )
        );
    };

    const onSubmit = (data: UserFormData) => {
        const payload = {
            user: data,
            roles: selectedRoles,
            permissions: selectedPermissions,
        };
        console.log('Crear usuario con roles y permisos:', payload);
        form.reset();
        setSelectedRoles([]);
        setSelectedPermissions([]);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl! max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Crear nuevo usuario</DialogTitle>
                    <DialogDescription>
                        Completa los datos del usuario y asigna roles o permisos directamente.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="data" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="data">Datos básicos</TabsTrigger>
                        <TabsTrigger value="roles">Roles</TabsTrigger>
                        <TabsTrigger value="permissions">Permisos</TabsTrigger>
                    </TabsList>

                    <TabsContent value="data" className="space-y-4 pt-4">
                        <Form {...form}>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Juan" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apellido</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pérez" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="juan.perez@empresa.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="document"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Documento</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="1234567890" {...field} />
                                            </FormControl>
                                            <FormDescription>Número de identificación del usuario</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Form>
                    </TabsContent>

                    <TabsContent value="roles" className="pt-4">
                        <RolesGrid selectedRoles={selectedRoles} onRoleToggle={toggleRole} />
                    </TabsContent>

                    <TabsContent value="permissions" className="pt-4">
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
                            setSelectedRoles([]);
                            setSelectedPermissions([]);
                            onOpenChange(false);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button onClick={form.handleSubmit(onSubmit)}>Crear usuario</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
