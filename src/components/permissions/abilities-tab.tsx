'use client';

import { useState } from 'react';
import { Search, Plus, Lock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockAbilities } from '@/lib/mock-data';
import { CreateAbilityDialog } from './create-ability-dialog';
import type { Ability } from '@/types';

export function AbilitiesTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editAbility, setEditAbility] = useState<Ability | null>(null);

    const filteredAbilities = mockAbilities.filter(
        (ability) =>
            ability.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ability.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ability.entity_type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedAbilities = filteredAbilities.reduce((acc, ability) => {
        const entity = ability.entity_type || 'Sin categoría';
        if (!acc[entity]) {
            acc[entity] = [];
        }
        acc[entity].push(ability);
        return acc;
    }, {} as Record<string, typeof mockAbilities>);

    const handleDeleteAbility = (ability: Ability) => {
        console.log('Eliminar habilidad:', {
            ability_id: ability.id,
            action: 'delete',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar habilidades..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Crear Habilidad
                </Button>
            </div>

            <div className="space-y-6">
                {Object.entries(groupedAbilities).map(([entity, abilities]) => (
                    <div key={entity} className="space-y-3">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground">{entity}</h3>
                            <Badge variant="secondary">{abilities.length}</Badge>
                        </div>
                        <div className="rounded-lg border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-b">
                                        <tr>
                                            <th className="text-left p-3 text-sm font-medium">Nombre técnico</th>
                                            <th className="text-left p-3 text-sm font-medium">Título</th>
                                            <th className="text-left p-3 text-sm font-medium">Tipo</th>
                                            <th className="text-left p-3 text-sm font-medium">Flags</th>
                                            <th className="text-right p-3 text-sm font-medium">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {abilities.map((ability) => (
                                            <tr
                                                key={ability.id}
                                                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="p-3">
                                                    <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                                                        {ability.name}
                                                    </code>
                                                </td>
                                                <td className="p-3 text-sm">{ability.title || '-'}</td>
                                                <td className="p-3 text-sm text-muted-foreground">
                                                    {ability.entity_type || '-'}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        {ability.only_owned && (
                                                            <Badge variant="secondary" className="gap-1 text-xs">
                                                                <Lock className="h-3 w-3" />
                                                                Solo propios
                                                            </Badge>
                                                        )}
                                                        {ability.scope && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {ability.scope}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => setEditAbility(ability)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                            onClick={() => handleDeleteAbility(ability)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <CreateAbilityDialog
                open={createDialogOpen || !!editAbility}
                onOpenChange={(open) => {
                    setCreateDialogOpen(open);
                    if (!open) setEditAbility(null);
                }}
                editAbility={editAbility || undefined}
            />
        </div>
    );
}
