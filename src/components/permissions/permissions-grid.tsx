'use client';

import { useState, useMemo } from 'react';
import { Search, Shield, Lock, Ban } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockAbilities } from '@/lib/mock-data';
import type { Ability } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface PermissionsGridProps {
    selectedPermissions: {
        abilityId: string;
        entityType: string | null;
        entityId: string | null;
        forbidden: boolean;
    }[];
    onPermissionToggle: (abilityId: string, entityType: string | null) => void;
    onDenyToggle: (abilityId: string, entityType: string | null) => void;
    showDenyOption?: boolean;
}

export function PermissionsGrid({
    selectedPermissions,
    onPermissionToggle,
    onDenyToggle,
    showDenyOption = true,
}: PermissionsGridProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAbilities = useMemo(() => {
        return mockAbilities.filter(
            (ability) =>
                ability.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ability.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ability.entity_type?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const groupedAbilities = useMemo(() => {
        return filteredAbilities.reduce((acc, ability) => {
            const key = ability.entity_type || 'general';
            if (!acc[key]) acc[key] = [];
            acc[key].push(ability);
            return acc;
        }, {} as Record<string, Ability[]>);
    }, [filteredAbilities]);

    const isPermissionSelected = (abilityId: string, entityType: string | null = null) => {
        return selectedPermissions.some((p) => p.abilityId === abilityId && p.entityType === entityType);
    };

    const isPermissionDenied = (abilityId: string, entityType: string | null = null) => {
        return (
            selectedPermissions.find((p) => p.abilityId === abilityId && p.entityType === entityType)?.forbidden ||
            false
        );
    };

    const selectedCount = selectedPermissions.length;
    const deniedCount = selectedPermissions.filter((p) => p.forbidden).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar habilidades por nombre o tipo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                        {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
                    </Badge>
                    {deniedCount > 0 && (
                        <Badge variant="destructive" className="gap-1">
                            <Ban className="h-3 w-3" />
                            {deniedCount} denegado{deniedCount !== 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>
            </div>

            <ScrollArea className="h-[500px]">
                <div className="space-y-6 pr-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-8">
                    {Object.entries(groupedAbilities).map(([entityType, abilities]) => (
                        <div key={entityType} className="space-y-3">
                            <div className="flex items-center gap-2 sticky top-0 bg-background py-2 z-10 border-b">
                                <Shield className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-sm capitalize">{entityType}</h4>
                                <Badge variant="outline" className="text-xs">
                                    {abilities.length}
                                </Badge>
                            </div>
                            <div className="grid gap-1">
                                {abilities.map((ability) => {
                                    const isSelected = isPermissionSelected(ability.id, ability.entity_type);
                                    const isDenied = isPermissionDenied(ability.id, ability.entity_type);

                                    return (
                                        <label
                                            key={ability.id}
                                            htmlFor={`ability-${ability.id}`}
                                            className={`group relative rounded-lg border-2 p-1 transition-all ${
                                                isDenied
                                                    ? 'border-destructive bg-destructive/5'
                                                    : isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border bg-card hover:border-primary/50'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Checkbox
                                                    id={`ability-${ability.id}`}
                                                    checked={isSelected}
                                                    onCheckedChange={() =>
                                                        onPermissionToggle(ability.id, ability.entity_type)
                                                    }
                                                    className="mt-0.5"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3
                                                        className="text-sm font-medium leading-tight cursor-pointer block"
                                                    >
                                                        {ability.title || ability.name}
                                                    </h3>
                                                    <code className="text-xs text-muted-foreground font-mono block mt-1 truncate">
                                                        {ability.name}
                                                    </code>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {ability.only_owned && (
                                                            <Badge variant="secondary" className="text-xs gap-1">
                                                                <Lock className="h-2.5 w-2.5" />
                                                                Solo propios
                                                            </Badge>
                                                        )}
                                                        {ability.scope && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {ability.scope} sad asd asd asd asd asd 
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                {isSelected && showDenyOption && (
                                                    <div className="border-border">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    type="button"
                                                                    variant={isDenied ? 'destructive' : 'outline'}
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        onDenyToggle(ability.id, ability.entity_type)
                                                                    }
                                                                    className="size-6 gap-1 text-xs"
                                                                >
                                                                    <Ban />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{isDenied ? 'Denegado (DENY)' : 'Permitir (ALLOW)'}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {Object.keys(groupedAbilities).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
                            <p className="text-sm text-muted-foreground">No se encontraron habilidades</p>
                            <p className="text-xs text-muted-foreground mt-1">Intenta con otro término de búsqueda</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
