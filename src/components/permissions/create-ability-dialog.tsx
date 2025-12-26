'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Ability } from '@/types';

const abilitySchema = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .regex(/^[a-z_]+\.[a-z_]+$/, 'Formato debe ser recurso.accion (ej: attendance.view)'),
    title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
    entity_type: z.string().min(2, 'El tipo de entidad es requerido'),
    only_owned: z.boolean(),
});

type AbilityFormData = z.infer<typeof abilitySchema>;

interface CreateAbilityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editAbility?: Ability;
}

export function CreateAbilityDialog({ open, onOpenChange, editAbility }: CreateAbilityDialogProps) {
    const form = useForm<AbilityFormData>({
        resolver: zodResolver(abilitySchema),
        defaultValues: {
            name: '',
            title: '',
            entity_type: '',
            only_owned: false,
        },
    });

    useEffect(() => {
        if (editAbility) {
            form.reset({
                name: editAbility.name,
                title: editAbility.title || '',
                entity_type: editAbility.entity_type || '',
                only_owned: editAbility.only_owned,
            });
        } else {
            form.reset({
                name: '',
                title: '',
                entity_type: '',
                only_owned: false,
            });
        }
    }, [editAbility, form]);

    const onSubmit = (data: AbilityFormData) => {
        if (editAbility) {
            console.log('Actualizar habilidad:', {
                ability_id: editAbility.id,
                ...data,
            });
        } else {
            console.log('Crear habilidad:', data);
        }
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{editAbility ? 'Editar habilidad' : 'Crear nueva habilidad'}</DialogTitle>
                    <DialogDescription>
                        {editAbility
                            ? 'Modifica los datos de la habilidad.'
                            : 'Define una nueva acción que puede realizarse en el sistema.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre técnico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="attendance.view, user.create" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Formato: recurso.accion (minúsculas, separado por punto)
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
                                        <Input placeholder="Ver asistencias, Crear usuarios" {...field} />
                                    </FormControl>
                                    <FormDescription>Nombre que se mostrará en la interfaz</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="entity_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de entidad</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Attendance, User, Report" {...field} />
                                    </FormControl>
                                    <FormDescription>Modelo al que pertenece esta habilidad</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="only_owned"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Solo recursos propios</FormLabel>
                                        <FormDescription>
                                            Esta habilidad solo aplica a recursos que pertenecen al usuario
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 justify-end pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset();
                                    onOpenChange(false);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit">{editAbility ? 'Guardar cambios' : 'Crear habilidad'}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
