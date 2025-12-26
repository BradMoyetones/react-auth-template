'use client';

import { useState } from 'react';
import { Search, Plus, Key, Lock, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
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
                {Object.entries(groupedAbilities).map(([entity, abilities], entityIndex) => (
                    <motion.div
                        key={entity}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: entityIndex * 0.1 }}
                    >
                        <div className="mb-3 flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground">{entity}</h3>
                            <Badge variant="secondary">{abilities.length}</Badge>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {abilities.map((ability, index) => (
                                <motion.div
                                    key={ability.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                >
                                    <Card className="p-4 transition-all hover:border-primary/50">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-lg bg-muted p-2">
                                                    <Key className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm text-foreground">
                                                        {ability.title || ability.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground font-mono">
                                                        {ability.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => setEditAbility(ability)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDeleteAbility(ability)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {ability.only_owned && (
                                                <Badge
                                                    variant="outline"
                                                    className="gap-1 text-xs bg-accent text-accent-foreground border-accent/20"
                                                >
                                                    <Lock className="h-3 w-3" />
                                                    Solo propios
                                                </Badge>
                                            )}
                                            {ability.scope && (
                                                <Badge variant="outline" className="text-xs">
                                                    Scope: {ability.scope}
                                                </Badge>
                                            )}
                                        </div>

                                        {ability.entity_type && (
                                            <div className="mt-3 pt-3 border-t border-border">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">Tipo de entidad</span>
                                                    <span className="font-medium text-foreground">
                                                        {ability.entity_type}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
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
