import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAthleteContext } from '../contexts/AthleteContext';
import { calculateFollowUpDate } from '../lib/followUpRules';
import { format } from 'date-fns';

export interface Interaction {
    id: string;
    athlete_id: string;
    school_id: string;
    coach_id: string | null;
    type: string;
    date: string;
    notes: string;
    created_at: string;
    updated_at: string;
    // Joined data
    school?: {
        id: string;
        name: string;
    };
    coach?: {
        id: string;
        name: string;
    };
}

interface CreateInteractionData {
    school_id: string;
    coach_id?: string;
    type: string;
    date: string;
    notes: string;
}

interface UseInteractionsReturn {
    interactions: Interaction[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createInteraction: (data: CreateInteractionData) => Promise<{ interaction: Interaction | null; followUpDate: Date | null }>;
    getInteractionsForSchool: (schoolId: string) => Promise<Interaction[]>;
}

export function useInteractions(): UseInteractionsReturn {
    const { athlete } = useAthleteContext();
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInteractions = useCallback(async () => {
        if (!athlete?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('interactions')
                .select(`
          *,
          school:schools(id, name),
          coach:coaches(id, name)
        `)
                .eq('athlete_id', athlete.id)
                .order('date', { ascending: false })
                .limit(50);

            if (fetchError) throw fetchError;

            setInteractions(data || []);
        } catch (err) {
            console.error('Error fetching interactions:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch interactions');
        } finally {
            setLoading(false);
        }
    }, [athlete?.id]);

    useEffect(() => {
        fetchInteractions();
    }, [fetchInteractions]);

    const createInteraction = async (data: CreateInteractionData): Promise<{ interaction: Interaction | null; followUpDate: Date | null }> => {
        if (!athlete?.id) return { interaction: null, followUpDate: null };

        try {
            setError(null);

            // Create interaction
            const { data: newInteraction, error: createError } = await supabase
                .from('interactions')
                .insert({
                    athlete_id: athlete.id,
                    school_id: data.school_id,
                    coach_id: data.coach_id || null,
                    type: data.type,
                    date: data.date,
                    notes: data.notes,
                })
                .select()
                .single();

            if (createError) throw createError;

            // Calculate and create follow-up if needed
            const followUpDueDate = calculateFollowUpDate(data.type, data.date);

            if (followUpDueDate) {
                const { error: followUpError } = await supabase
                    .from('follow_ups')
                    .insert({
                        athlete_id: athlete.id,
                        interaction_id: newInteraction.id,
                        school_id: data.school_id,
                        due_date: format(followUpDueDate, 'yyyy-MM-dd'),
                        completed: false,
                    });

                if (followUpError) {
                    console.error('Error creating follow-up:', followUpError);
                    // Don't fail the whole operation if follow-up creation fails
                }
            }

            // Refresh interactions list
            await fetchInteractions();

            return { interaction: newInteraction, followUpDate: followUpDueDate };
        } catch (err) {
            console.error('Error creating interaction:', err);
            setError(err instanceof Error ? err.message : 'Failed to create interaction');
            return { interaction: null, followUpDate: null };
        }
    };

    const getInteractionsForSchool = async (schoolId: string): Promise<Interaction[]> => {
        try {
            const { data, error: fetchError } = await supabase
                .from('interactions')
                .select(`
          *,
          coach:coaches(id, name)
        `)
                .eq('school_id', schoolId)
                .order('date', { ascending: false });

            if (fetchError) throw fetchError;

            return data || [];
        } catch (err) {
            console.error('Error fetching interactions for school:', err);
            return [];
        }
    };

    return {
        interactions,
        loading,
        error,
        refetch: fetchInteractions,
        createInteraction,
        getInteractionsForSchool,
    };
}
