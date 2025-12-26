'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { mockAbilities } from '@/lib/mock-data';
import type { RoleWithPermissions } from '@/types';

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

    const toggleAbility = (abilityId: string) => {
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

    const groupedAbilities = mockAbilities.reduce((acc, ability) => {
        const entity = ability.entity_type || 'Sin categoría';
        if (!acc[entity]) {
            acc[entity] = [];
        }
        acc[entity].push(ability);
        return acc;
    }, {} as Record<string, typeof mockAbilities>);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
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

                            <TabsContent value="permissions" className="mt-4">
                                <ScrollArea className="h-100 pr-4">
                                    <div className="space-y-6">
                                        {Object.entries(groupedAbilities).map(([entity, abilities]) => (
                                            <div key={entity}>
                                                <div className="mb-3 flex items-center gap-2">
                                                    <h4 className="text-sm font-semibold text-foreground">{entity}</h4>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {abilities.length}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    {abilities.map((ability) => {
                                                        const isSelected = selectedAbilities.includes(ability.id);
                                                        const isDenied = deniedAbilities.includes(ability.id);
                                                        return (
                                                            <div
                                                                key={ability.id}
                                                                className={`p-3 rounded-lg border-2 transition-all ${
                                                                    isDenied
                                                                        ? 'border-destructive bg-destructive/5'
                                                                        : isSelected
                                                                        ? 'border-primary bg-primary/5'
                                                                        : 'border-border bg-background'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3 flex-1">
                                                                        <Checkbox
                                                                            checked={isSelected}
                                                                            onCheckedChange={() =>
                                                                                toggleAbility(ability.id)
                                                                            }
                                                                        />
                                                                        <div className="flex-1">
                                                                            <h5 className="font-medium text-sm">
                                                                                {ability.title || ability.name}
                                                                            </h5>
                                                                            <p className="text-xs text-muted-foreground font-mono">
                                                                                {ability.name}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    {isSelected && (
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant={
                                                                                isDenied ? 'destructive' : 'outline'
                                                                            }
                                                                            onClick={() => toggleDeny(ability.id)}
                                                                            className="gap-1"
                                                                        >
                                                                            <Shield className="h-3 w-3" />
                                                                            {isDenied ? 'DENY' : 'Denegar'}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <div className="mt-4 p-3 bg-muted rounded-lg">
                                    <p className="text-xs text-muted-foreground">
                                        {selectedAbilities.length} permisos seleccionados
                                        {deniedAbilities.length > 0 && ` (${deniedAbilities.length} denegados)`}
                                    </p>
                                </div>
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
