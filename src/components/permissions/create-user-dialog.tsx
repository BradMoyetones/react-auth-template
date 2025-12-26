'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockRoles, mockAbilities } from '@/lib/mock-data';
import { useState } from 'react';
import { Shield, Lock } from 'lucide-react';

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

    const isPermissionSelected = (abilityId: string, entityType: string | null = null) => {
        return selectedPermissions.some((p) => p.abilityId === abilityId && p.entityType === entityType);
    };

    const isPermissionDenied = (abilityId: string, entityType: string | null = null) => {
        return (
            selectedPermissions.find((p) => p.abilityId === abilityId && p.entityType === entityType)?.forbidden ||
            false
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

    const groupedAbilities = mockAbilities.reduce((acc, ability) => {
        const key = ability.entity_type || 'general';
        if (!acc[key]) acc[key] = [];
        acc[key].push(ability);
        return acc;
    }, {} as Record<string, typeof mockAbilities>);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
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
                                                <Input type="number" placeholder="1234567890" {...field} onChange={(e) => field.onChange(Number(e.target.value) === 0 ? "" : Number(e.target.value))} />
                                            </FormControl>
                                            <FormDescription>Número de identificación del usuario</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Form>
                    </TabsContent>

                    <TabsContent value="roles">
                        <ScrollArea className="h-100 pr-4">
                            <div className="space-y-3">
                                {mockRoles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-start space-x-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={selectedRoles.includes(role.id)}
                                            onCheckedChange={() => toggleRole(role.id)}
                                        />
                                        <div className="flex-1 space-y-1">
                                            <label
                                                htmlFor={`role-${role.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                                            >
                                                {role.name}
                                                <Badge variant="outline" className="text-xs">
                                                    Nivel {role.level}
                                                </Badge>
                                            </label>
                                            {role.title && (
                                                <p className="text-sm text-muted-foreground">{role.title}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="permissions">
                        <ScrollArea className="h-100 pr-4">
                            <div className="space-y-6">
                                {Object.entries(groupedAbilities).map(([entityType, abilities]) => (
                                    <div key={entityType} className="space-y-3">
                                        <h4 className="font-semibold text-sm capitalize flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            {entityType}
                                        </h4>
                                        <div className="space-y-2">
                                            {abilities.map((ability) => {
                                                const isSelected = isPermissionSelected(
                                                    ability.id,
                                                    ability.entity_type
                                                );
                                                const isDenied = isPermissionDenied(ability.id, ability.entity_type);

                                                return (
                                                    <div
                                                        key={ability.id}
                                                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-3 flex-1">
                                                            <Checkbox
                                                                id={`ability-${ability.id}`}
                                                                checked={isSelected}
                                                                onCheckedChange={() =>
                                                                    togglePermission(ability.id, ability.entity_type)
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={`ability-${ability.id}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                                                            >
                                                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                                                    {ability.name}
                                                                </code>
                                                                {ability.only_owned && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        Solo propios
                                                                    </Badge>
                                                                )}
                                                                {ability.scope && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {ability.scope}
                                                                    </Badge>
                                                                )}
                                                            </label>
                                                        </div>

                                                        {isSelected && (
                                                            <Button
                                                                type="button"
                                                                variant={isDenied ? 'destructive' : 'outline'}
                                                                size="sm"
                                                                onClick={() =>
                                                                    toggleDeny(ability.id, ability.entity_type)
                                                                }
                                                                className="ml-2"
                                                            >
                                                                <Lock className="h-3 w-3 mr-1" />
                                                                {isDenied ? 'DENY' : 'ALLOW'}
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
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
